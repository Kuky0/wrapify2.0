"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const active = useMemo(() => {
    if (activeIndex === null) return null;
      return previews[activeIndex];
  }, [activeIndex]);

  const goPrev = () => {
    setActiveIndex((i) =>
      i === null ? i : (i - 1 + previews.length) % previews.length);
  };

  const goNext = () => {
    setActiveIndex((i) => (i === null ? i : (i + 1) % previews.length));
  };

  // Keyboard controls while modal is open
  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <main className="landing">
      <section className="landingInner">
        <div className="vStack" aria-label="Time range previews">
          {previews.map((p, idx) => (
            <div
              key={p.src}
              className="vCard"
              role="button"
              tabIndex={0}
              onClick={() => setActiveIndex(idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setActiveIndex(idx);
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
            <Link className="btn btn" href="/about">
              About
            </Link>
            <Link className="btn btn" href="/privacy">
              Privacy Policy  
            </Link>
            <Link className="btn btn" href="/contact">
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
          onClick={() => setActiveIndex(null)}
        >
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <button
              className="modalClose"
              onClick={() => setActiveIndex(null)}
              aria-label="Close preview"
              type="button"
            >
              X
            </button>

            <button
              className="modalNav modalNavLeft"
              onClick={goPrev}
              aria-label="Previous image"
              type="button"
            >
              ←
            </button>

            <button
              className="modalNav modalNavRight"
              onClick={goNext}
              aria-label="Next image"
              type="button"
            >
              →
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
