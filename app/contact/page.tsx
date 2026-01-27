import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="pageCenter">
      <div className="textPanel">
        <h1 className="pageTitle">Contact</h1>
        <p className="pageLead">How to reach us.</p>

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
          <Link className="btn" href="/privacy">
            Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  );
}
