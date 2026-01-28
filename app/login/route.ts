import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function base64UrlEncode(bytes: Uint8Array) {
  return Buffer.from(bytes)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function randomString(length: number) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes).slice(0, length);
}

async function sha256(input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hash);
}

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return new NextResponse(
      "Missing SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI in .env.local",
      { status: 500 }
    );
  }

  const state = randomString(32);
  const codeVerifier = randomString(64);
  const codeChallenge = base64UrlEncode(await sha256(codeVerifier));

  const cookieStore = await cookies();
  cookieStore.set("spotify_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // localhost; change to true when deploying https
    path: "/",
    maxAge: 10 * 60, // 10 minutes
  });
  cookieStore.set("spotify_verifier", codeVerifier, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 10 * 60,
  });

  const scope = "user-top-read"; // minimal for now

  const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("scope", scope);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);

  return NextResponse.redirect(authorizeUrl.toString());
}
