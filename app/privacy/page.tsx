import { cookies } from "next/headers";
import Link from "next/link";

export default async function PrivacyPage() {
  const cookieStore = await cookies();
  const hasToken = Boolean(cookieStore.get("spotify_access_token")?.value);

  return (
    <main className="pageCenter">
      <div className="textPanel">
        <h1 className="pageTitle">Privacy Policy</h1>
        <p className="pageLead">How we handle your data.</p>

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
          <Link className="btn" href="/about">
            About
          </Link>
          <Link className="btn" href="/contact">
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
