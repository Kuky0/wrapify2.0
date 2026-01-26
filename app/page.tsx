"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Preview = {
  src: string;
  alt: string;
  title: string;
  sub: string;
};

const previews: Preview[] = [
  { src: "/minutes.png", alt: "Short term preview", title: "Short term", sub: "~ 4 weeks" },
  { src: "/top artists.png", alt: "Medium term preview", title: "Medium term", sub: "~ 6 months" },
  { src: "/top albums.png", alt: "Long term preview", title: "Long term", sub: "~ 1+ year" },
];

export default function HomePage() {
  const [active, setActive] = useState<Preview | null>(null);

  // Close on Escape
  useEffect(() => {
    if (!active) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  return (
    <main className="landing">
      <section className="landingInner">
        <div className="vStack" aria-label="Time range previews">
          {previews.map((p) => (
            <div
              key={p.src}
              className="vCard"
              role="button"
              tabIndex={0}
              onClick={() => setActive(p)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setActive(p);
              }}
            >
              <img className="vImg" src={p.src} alt={p.alt} />
              <div className="overlay">
                <div>
                  <div className="overlayTitle">{p.title}</div>
                  <div className="overlaySub">{p.sub}</div>
                </div>
              </div>
            </div>
          ))}
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

      {/* Modal / lightbox */}
      {active && (
        <div
          className="modalBackdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} preview`}
          onClick={() => setActive(null)}
        >
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <button className="modalClose" onClick={() => setActive(null)} aria-label="Close preview">
              ✕
            </button>
            <img className="modalImg" src={active.src} alt={active.alt} />
            <div className="modalCaption">
              <div className="modalTitle">{active.title}</div>
              <div className="modalSub">{active.sub}</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
