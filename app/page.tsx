import { cookies } from "next/headers";
import LandingClient from "./LandingClient";

/**
 * Landing page (Server Component)
 * We read the HttpOnly access token cookie on the server so we can show
 * either "Login with Spotify" or "Go to Dashboard" immediately (no flicker).
 */
export default async function HomePage() {
  const cookieStore = await cookies();
  const hasToken = Boolean(cookieStore.get("spotify_access_token")?.value);

  return <LandingClient hasToken={hasToken} />;
}
