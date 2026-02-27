import Link from "next/link";
import { cookies } from "next/headers";

import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const hasToken = Boolean(cookieStore.get("spotify_access_token")?.value);

  if (!hasToken) {
    return (
      <main className="centerGate">
        <div className="gateCard">
          <h1 className="gateTitle">Log in to Spotify</h1>
          <p className="gateSub">
            Connect your account to build playlists from your top tracks.
          </p>
          <Link className="btnPrimary" href="/login">
            Continue with Spotify
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <DashboardClient />
    </main>
  );
}
