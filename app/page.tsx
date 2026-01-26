import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing">
      <section className="landingInner">
        <div className="vStack" aria-label="Time range previews">
          <div className="vCard" role="button" tabIndex={0}>
            <img className="vImg" src="/minutes.png" alt="Short term preview" />
            <div className="overlay">
              <div>
                <div className="overlayTitle">Short term</div>
                <div className="overlaySub">~ 4 weeks</div>
              </div>
            </div>
          </div>

          <div className="vCard" role="button" tabIndex={0}>
            <img className="vImg" src="/top artists.png" alt="Medium term preview" />
            <div className="overlay">
              <div>
                <div className="overlayTitle">Medium term</div>
                <div className="overlaySub">~ 6 months</div>
              </div>
            </div>
          </div>

          <div className="vCard" role="button" tabIndex={0}>
            <img className="vImg" src="/top albums.png" alt="Long term preview" />
            <div className="overlay">
              <div>
                <div className="overlayTitle">Long term</div>
                <div className="overlaySub">~ 1+ year</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rightSide textPanel">
          <h1>Spotify Stats</h1>
          <p>
            View your top tracks across short, medium, and long-term listening.
            Minimal layout, Spotify-like vibe.
          </p>

          <div className="ctaRow">
            <Link className="btn btnPrimary" href="/login">
              Login with Spotify
            </Link>
            <Link className="btn" href="/about">
              About
            </Link>
            <Link className="btn" href="/contact">
              Contact
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
