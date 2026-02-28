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

export default function LandingClient({ hasToken }: { hasToken: boolean }) {
  // `active` tracks which preview is currently open in the modal.
  // `null` means the modal is closed.
  const [active, setActive] = useState<Preview | null>(null);

  // Go to the previous preview (wraps around).
  const goPrev = () => {
    setActive((cur) => {
      if (!cur) return cur;
      const i = previews.findIndex((p) => p.src === cur.src);
      if (i < 0) return cur;
      return previews[(i - 1 + previews.length) % previews.length];
    });
  };

  // Go to the next preview (wraps around).
  const goNext = () => {
    setActive((cur) => {
      if (!cur) return cur;
      const i = previews.findIndex((p) => p.src === cur.src);
      if (i < 0) return cur;
      return previews[(i + 1) % previews.length];
    });
  };

  // Close the modal when the user presses Escape.
  // This effect only attaches the event listener while a modal is open.
  useEffect(() => {
    // If no modal is open, do nothing and skip the listener.
    if (!active) return;

    // Keyboard handler:
    // - Escape closes
    // - ArrowLeft / ArrowRight navigate
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // JSX: the landing page plus a conditional modal (lightbox).
  return (
    <main className="landing">
      <section className="landingInner">
        {/* Left column: stacked preview cards */}
        <div className="vStack" aria-label="Time range previews">
          {previews.map((p) => (
            <div
              key={p.src}
              className="vCard"
              // These attributes make the div behave like an accessible button.
              role="button"
              tabIndex={0}
              // Click opens the modal for this preview.
              onClick={() => setActive(p)}
              // Keyboard support: Enter or Space also open the modal.
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setActive(p);
              }}
            >
              {/* The preview image itself */}
              <img className="vImg" src={p.src} alt={p.alt} />

              {/* Hover overlay (text appears on hover via CSS) */}
              <div className="overlay">
                <div>
                  <div className="overlayTitle">{p.title}</div>
                  <div className="overlaySub">{p.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right column: heading, description, and call-to-action buttons */}
        <div className="rightSide textPanel">
          <h1 className="pageTitle">Spotify Stats</h1>
          <p className="pageLead">
            View your top tracks across short, medium, and long-term listening.
            Minimal layout, Spotify-like vibe.
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
            <Link className="btn" href="/about">
              About
            </Link>
            <Link className="btn" href="/contact">
              Contact
            </Link>
            <Link className="btn" href="/privacy">
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>

      {/* Modal / lightbox: only rendered when `active` is set */}
      {active && (
        <div
          className="modalBackdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} preview`}
          onClick={() => setActive(null)}
        >
          <div
            className="modalCard"
            // Stop the click from bubbling to the backdrop when clicking inside the modal.
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modalClose"
              onClick={() => setActive(null)}
              aria-label="Close preview"
            >
              X
            </button>

            <button
              className="modalNav modalNavLeft"
              onClick={goPrev}
              aria-label="Previous preview"
              type="button"
            >
              {"<"}
            </button>

            <button
              className="modalNav modalNavRight"
              onClick={goNext}
              aria-label="Next preview"
              type="button"
            >
              {">"}
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