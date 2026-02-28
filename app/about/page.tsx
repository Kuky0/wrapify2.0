import { cookies } from "next/headers";
import Link from "next/link";

export const metadata = {
  title: "About",
  description: "View information about this site",
};

export default async function AboutPage() {
  const cookieStore = await cookies();
  const hasToken = Boolean(cookieStore.get("spotify_access_token")?.value);

  return (
    <main className="pageCenter">
      <div className="textPanel">
        <h1 className="pageTitle">About</h1>
        <p className="pageLead">
          The goal of this project is to create a seamless and intuitive user experience for viewing
          and managing your top songs. There will be more features added in the future, including AI
          that can help you create playlists based on your listening habits.
        </p>

        <div className="ctaRow">
          {hasToken ? (
            <Link className="btn btnPrimary" href="/dashboard">
              Go to Dashboard
            </Link>
          ) : (
            <Link className="btn btnPrimary" href="/login">
              Login with Spotify
            </Link>
          )}
          <Link className="btn" href="/">
            Home
          </Link>
          <Link className="btn" href="/contact">
            Contact
          </Link>
          <Link className="btn" href="/privacy">
            Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  );
}
