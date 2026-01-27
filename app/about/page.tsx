import Link from "next/link";

export const metadata = {
  title: "About",
  description: "View information about this site",
};

export default function AboutPage() {
  return (
    // `pageCenter` gives us the same centered shell used on other simple routes.
    <main className="pageCenter">
      <div className="textPanel">
        {/* Reuse shared typography helpers for consistent headings and body text. */}
        <h1 className="pageTitle">About</h1>
        <p className="pageLead">
          The goal of this project is to create a seamless and intuitive user experience for viewing
          and managing your top songs. There will be more features added in the future, including AI
          that can help you create playlists based on your listening habits.
        </p>

        <div className="ctaRow">
          <Link className="btn btnPrimary" href="/login">
            Login with Spotify
          </Link>
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
