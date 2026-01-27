import Link from "next/link";

export const metadata = {
  title: "About",
  description: "View information about this site",
};

export default function AboutPage() {
  return (
    <main className="aboutPage">
      <div className="textPanel">
        <h1>About</h1>
        <p>The Goal of this project is to create a seamless and intuitive 
           user experience for viewing and managing your Top Songs. 
           There will be more features added in the future like AI. 
           AI will be able to help you precisely create playlists based off 
           your listening habits.</p>

        <div className="ctaRow">
          <Link className="btn btnPrimary" href="/login">
            Login with Spotify
          </Link>
          <Link className="btn" href="/">
            Home
          </Link>
          <Link className="btn" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="btn" href="/contact">
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
