"use client";

import { useEffect, useMemo, useState } from "react";

type TimePeriodUI = "Last Month" | "Last 6 Months" | "Last Year";
type LengthUI = "Top 10" | "Top 50";

type Track = {
  id: string;
  name: string;
  artists: string;
  album: string;
  imageUrl: string | null;
  uri: string;
};

type PreviewResponse = {
  timeRange: "short_term" | "medium_term" | "long_term";
  limit: number;
  tracks: Track[];
};

function mapPeriodToTimeRange(p: TimePeriodUI): PreviewResponse["timeRange"] {
  switch (p) {
    case "Last Month":
      return "short_term";
    case "Last 6 Months":
      return "medium_term";
    default:
      return "long_term";
  }
}

export default function DashboardClient() {
  const [timePeriod, setTimePeriod] = useState<TimePeriodUI>("Last Month");
  const [length, setLength] = useState<LengthUI>("Top 10");
  const [playlistName, setPlaylistName] = useState("Wrapify • Top Tracks");
  const [isPublic, setIsPublic] = useState(false);

  const limit = useMemo(() => (length === "Top 10" ? 10 : 50), [length]);
  const timeRange = useMemo(() => mapPeriodToTimeRange(timePeriod), [timePeriod]);

  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [buildLoading, setBuildLoading] = useState(false);
  const [buildError, setBuildError] = useState<string | null>(null);
  const [buildSuccess, setBuildSuccess] = useState<{ url: string; name: string } | null>(
    null
  );

  async function fetchPreview(signal?: AbortSignal) {
    setPreviewLoading(true);
    setPreviewError(null);
    setBuildSuccess(null);

    try {
      const res = await fetch(
        `/api/preview-top-tracks?time_range=${timeRange}&limit=${limit}`,
        { method: "GET", signal, cache: "no-store" }
      );

      if (!res.ok) throw new Error((await res.text()) || "Failed to load preview");

      const data = (await res.json()) as PreviewResponse;
      setPreview(data);

      // auto-name unless user customized
      setPlaylistName((prev) => {
        const looksAuto =
          prev.startsWith("Wrapify •") ||
          prev.trim().length === 0 ||
          prev === "Wrapify • Top Tracks";
        if (!looksAuto) return prev;

        const periodLabel =
          timeRange === "short_term"
            ? "Last Month"
            : timeRange === "medium_term"
              ? "Last 6 Months"
              : "Last Year";
        const countLabel = limit === 10 ? "Top 10" : "Top 50";
        return `Wrapify • ${periodLabel} • ${countLabel}`;
      });
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setPreviewError(e?.message ?? "Failed to load preview");
      setPreview(null);
    } finally {
      setPreviewLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetchPreview(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange, limit]);

  async function buildPlaylist() {
    setBuildLoading(true);
    setBuildError(null);
    setBuildSuccess(null);

    try {
      const res = await fetch(`/api/build-playlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          time_range: timeRange,
          limit,
          name: playlistName,
          public: isPublic,
        }),
      });

      if (!res.ok) throw new Error((await res.text()) || "Failed to build playlist");

      const data = (await res.json()) as { url: string; name: string };
      setBuildSuccess(data);
    } catch (e: any) {
      setBuildError(e?.message ?? "Failed to build playlist");
    } finally {
      setBuildLoading(false);
    }
  }

  return (
    <div className="studio">
      <div className="studioBg" aria-hidden="true" />

      <header className="studioHeader">
        <div>
          <h1 className="studioTitle">Build a playlist</h1>
          <p className="studioSub">
            Turn your top tracks into a playlist you can save on Spotify.
          </p>
        </div>

        <div className="studioRight">
          <nav className="studioNav" aria-label="Site">
            <a className="navBtn" href="/">Home</a>
            <a className="navBtn" href="/about">About</a>
            <a className="navBtn" href="/contact">Contact</a>
            <a className="navBtn" href="/privacy">Privacy</a>
            <a className="navBtn navBtnDanger" href="/logout">Log out</a>
          </nav>

          <div className="studioBadge" title="Top Tracks • Spotify">
            <span className="dot" aria-hidden="true" />
            Top Tracks Builder
          </div>
        </div>
      </header>

      <div className="studioGrid">
        {/* Left: settings */}
        <section className="panel">
          <h2 className="panelTitle">Settings</h2>

          <div className="group">
            <div className="labelRow">
              <label className="label" htmlFor="playlistName">
                Playlist name
              </label>
              <span className="hint">Shown in Spotify</span>
            </div>
            <input
              id="playlistName"
              className="input"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Wrapify • Last Month • Top 10"
              maxLength={100}
            />
          </div>

          <div className="group">
            <div className="labelRow">
              <span className="label">Time period</span>
              <span className="hint">Spotify time range</span>
            </div>
            <div className="chips">
              {(["Last Month", "Last 6 Months", "Last Year"] as TimePeriodUI[]).map(
                (opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={opt === timePeriod ? "chip chipOn" : "chip"}
                    onClick={() => setTimePeriod(opt)}
                  >
                    {opt}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="group">
            <div className="labelRow">
              <span className="label">Length</span>
              <span className="hint">Tracks to add</span>
            </div>
            <div className="chips">
              {(["Top 10", "Top 50"] as LengthUI[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={opt === length ? "chip chipOn" : "chip"}
                  onClick={() => setLength(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="group">
            <div className="labelRow">
              <span className="label">Visibility</span>
              <span className="hint">{isPublic ? "Public" : "Private"}</span>
            </div>
            <button
              type="button"
              className={isPublic ? "toggle toggleOn" : "toggle"}
              onClick={() => setIsPublic((v) => !v)}
              aria-pressed={isPublic}
            >
              <span className="toggleKnob" aria-hidden="true" />
              <span className="toggleText">{isPublic ? "Public" : "Private"}</span>
            </button>
          </div>

          <div className="actions">
            <button
              type="button"
              className="btnPrimary"
              onClick={buildPlaylist}
              disabled={buildLoading || previewLoading}
            >
              {buildLoading ? "Building…" : "Build playlist"}
            </button>

            <button
              type="button"
              className="btnGhost"
              onClick={() => fetchPreview()}
              disabled={previewLoading}
            >
              {previewLoading ? "Refreshing…" : "Preview"}
            </button>
          </div>

          {buildSuccess ? (
            <div className="notice ok">
              <div className="noticeTitle">Success</div>
              <div className="noticeBody">
                Created <strong>{buildSuccess.name}</strong>.{" "}
                <a
                  className="link"
                  href={buildSuccess.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Spotify
                </a>
              </div>
            </div>
          ) : null}

          {buildError ? (
            <div className="notice bad">
              <div className="noticeTitle">Couldn’t build playlist</div>
              <div className="noticeBody">{buildError}</div>
            </div>
          ) : null}
        </section>

        {/* Right: preview */}
        <section className="panel panelWide">
          <div className="previewTop">
            <div>
              <h2 className="panelTitle">Preview</h2>
              <p className="panelSub">
                {preview
                  ? `${preview.tracks.length} tracks • ${timePeriod}`
                  : "Pick settings to load tracks"}
              </p>
            </div>

            <div className="miniStat">
              <div className="miniStatNum">{limit}</div>
              <div className="miniStatLabel">tracks</div>
            </div>
          </div>

          {previewLoading ? (
            <div className="skeletonList" aria-label="Loading preview">
              {Array.from({ length: Math.min(limit, 10) }).map((_, i) => (
                <div key={i} className="skeletonRow">
                  <div className="skeletonArt" />
                  <div className="skeletonText">
                    <div className="skeletonLine" />
                    <div className="skeletonLine short" />
                  </div>
                </div>
              ))}
            </div>
          ) : previewError ? (
            <div className="notice bad">
              <div className="noticeTitle">Couldn’t load preview</div>
              <div className="noticeBody">{previewError}</div>
            </div>
          ) : preview?.tracks?.length ? (
            <ol className="trackList">
              {preview.tracks.map((t, idx) => (
                <li key={t.id} className="track">
                  <div className="trackIdx">{idx + 1}</div>
                  <div className="trackArt">
                    {t.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.imageUrl} alt="" />
                    ) : (
                      <div className="trackArtFallback" />
                    )}
                  </div>
                  <div className="trackMeta">
                    <div className="trackName">{t.name}</div>
                    <div className="trackSub">
                      <span className="artist">{t.artists}</span>
                      <span className="sep">•</span>
                      <span className="album">{t.album}</span>
                    </div>
                  </div>
                  <a
                    className="trackLink"
                    href={t.uri}
                    target="_blank"
                    rel="noreferrer"
                    title="Open in Spotify"
                  >
                    ↗
                  </a>
                </li>
              ))}
            </ol>
          ) : (
            <div className="empty">
              <div className="emptyTitle">No tracks yet</div>
              <div className="emptyBody">
                Choose a time period and length to preview your top tracks.
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
