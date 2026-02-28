import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Logs the user out by clearing our server-side (HttpOnly) cookies.
 * This does NOT log the user out of Spotify globally; it just removes Wrapify's tokens.
 */
export async function GET() {
  const cookieStore = await cookies();

  // Remove auth + one-time OAuth cookies
  cookieStore.delete("spotify_access_token");
  cookieStore.delete("spotify_refresh_token");
  cookieStore.delete("spotify_state");
  cookieStore.delete("spotify_verifier");

  const appUrl = process.env.APP_URL || "http://127.0.0.1:3000";
  return NextResponse.redirect(new URL("/", appUrl));
}
