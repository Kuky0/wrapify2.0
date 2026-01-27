import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="pageCenter">
      <div className="textPanel">
        <h1 className="pageTitle">Privacy Policy</h1>
        <p className="pageLead">How we handle your data.</p>

        <div className="ctaRow">
          <Link className="btn btnPrimary" href="/login">
            Login with Spotify
          </Link>
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
