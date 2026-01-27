"use client";

// This page uses React hooks (`useState`, `useEffect`), which require a Client Component
// in the Next.js App Router. The directive above tells Next.js to render this on the client.
import { useEffect, useState } from "react";
// `Link` provides client-side navigation between routes (no full page refresh).
import Link from "next/link";

// A small TypeScript type that describes the shape of each preview card / modal item.
// This gives us autocomplete and prevents typos (e.g., missing `alt` text).
type Preview = {
  src: string;   // image path in /public
  alt: string;   // accessible alt text for the image
  title: string; // label shown in the overlay and modal
  sub: string;   // secondary text (time range)
};

// Static data for the three time-range previews shown on the left.
// Because this is constant, it's defined outside the component so it isn't re-created on every render.
const previews: Preview[] = [
  { src: "/minutes.png", alt: "Short term preview", title: "Short term", sub: "~ 4 weeks" },
  { src: "/top artists.png", alt: "Medium term preview", title: "Medium term", sub: "~ 6 months" },
  { src: "/top albums.png", alt: "Long term preview", title: "Long term", sub: "~ 1+ year" },
];

// The default export makes this route's page component.
export default function HomePage() {
  // `active` tracks which preview is currently open in the modal.
  // `null` means the modal is closed.
  const [active, setActive] = useState<Preview | null>(null);

  // Close the modal when the user presses Escape.
  // This effect only attaches the event listener while a modal is open.
  useEffect(() => {
    // If no modal is open, do nothing and skip the listener.
    if (!active) return;

    // Keyboard handler: if Escape is pressed, close the modal.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };

    // Register the handler on mount / when `active` becomes truthy...
    window.addEventListener("keydown", onKeyDown);
    // ...and clean it up when the modal closes or the component unmounts.
    return () => window.removeEventListener("keydown", onKeyDown);
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
          {/* Use shared typography helpers so other routes can match easily. */}
          <h1 className="pageTitle">Spotify Stats</h1>
          <p className="pageLead">
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
          // Clicking the dimmed backdrop closes the modal.
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
              âœ•
            </button>

            {/* Full-size preview image */}
            <img className="modalImg" src={active.src} alt={active.alt} />

            {/* Caption area under the image */}
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
