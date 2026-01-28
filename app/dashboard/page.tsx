import Link from "next/link";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const hasToken = Boolean(cookieStore.get("spotify_access_token")?.value);

  return (
    <main className="landing">
      <section className="landingInner">
        <div className="textPanel">
          <h1>Dashboard</h1>

          {!hasToken ? (
            <>
              <p>You’re not logged in yet.</p>
              <Link className="btn btnPrimary" href="/login">
                Login with Spotify
              </Link>
            </>
          ) : (
            <>
              <p>Choose a time range to view your top tracks.</p>
              <div className="ctaRow">
                <button className="btn" type="button">Short term</button>
                <button className="btn" type="button">Medium term</button>
                <button className="btn" type="button">Long term</button>
              </div>
            </>
          )}
        </div>

        <div />
      </section>
    </main>
  );
}
