import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return new NextResponse(
      "Missing SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI in .env.local",
      { status: 500 }
    );
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) return new NextResponse(`Spotify error: ${error}`, { status: 400 });
  if (!code || !returnedState)
    return new NextResponse("Missing code/state from Spotify callback", {
      status: 400,
    });

  const cookieStore = await cookies();
  const storedState = cookieStore.get("spotify_state")?.value;
  const codeVerifier = cookieStore.get("spotify_verifier")?.value;

  if (!storedState || !codeVerifier)
    return new NextResponse("Missing verifier/state cookies (try logging in again)", {
      status: 400,
    });

  if (returnedState !== storedState)
    return new NextResponse("State mismatch (possible CSRF)", { status: 400 });

  // Exchange code for tokens
  const body = new URLSearchParams();
  body.set("client_id", clientId);
  body.set("grant_type", "authorization_code");
  body.set("code", code);
  body.set("redirect_uri", redirectUri);
  body.set("code_verifier", codeVerifier);

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    return new NextResponse(`Token exchange failed: ${text}`, { status: 400 });
  }

  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.access_token as string;
  const refreshToken = tokenJson.refresh_token as string | undefined;
  const expiresIn = tokenJson.expires_in as number; // seconds

  // Clean up one-time cookies
  cookieStore.delete("spotify_state");
  cookieStore.delete("spotify_verifier");

  // Store tokens (minimal approach for now)
  cookieStore.set("spotify_access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: expiresIn,
  });

  if (refreshToken) {
    cookieStore.set("spotify_refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
