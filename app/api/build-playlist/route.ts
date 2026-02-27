import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SPOTIFY_API = "https://api.spotify.com/v1";

async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("spotify_access_token")?.value ?? null;
}

function bad(msg: string, status = 400) {
  return new NextResponse(msg, { status });
}

function parseBool(v: any, fallback = false) {
  if (v === true || v === "true") return true;
  if (v === false || v === "false") return false;
  return fallback;
}

export async function POST(req: Request) {
  const token = await getAccessToken();
  if (!token) return bad("Not authenticated. Please log in again.", 401);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON body.");
  }

  const timeRange = body?.time_range ?? "short_term";
  const limit = Math.max(1, Math.min(50, Number(body?.limit ?? 10)));
  const name = String(body?.name ?? "Wrapify Playlist").slice(0, 100);
  const isPublic = parseBool(body?.public, false);

  const allowedRanges = new Set(["short_term", "medium_term", "long_term"]);
  if (!allowedRanges.has(timeRange)) {
    return bad("Invalid time_range. Use short_term, medium_term, or long_term.");
  }
  if (!Number.isFinite(limit)) return bad("Invalid limit.");

  // 1) Get top tracks
  const topRes = await fetch(
    `${SPOTIFY_API}/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  if (!topRes.ok) {
    const text = await topRes.text();
    return bad(`Spotify error (top tracks): ${text}`, topRes.status);
  }

  const topJson = await topRes.json();
  const uris: string[] = (topJson?.items ?? [])
    .map((t: any) => t?.uri)
    .filter(Boolean);

  if (!uris.length) return bad("No tracks returned by Spotify for that time period.", 400);

  // 2) Create playlist (use /me/playlists)
  const periodLabel =
    timeRange === "short_term"
      ? "Last Month"
      : timeRange === "medium_term"
        ? "Last 6 Months"
        : "Last Year";

  const description = `Built by Wrapify • Top Tracks • ${periodLabel} • ${limit} tracks`;

  console.log("Creating playlist via /me/playlists", { name, isPublic, timeRange, limit });

  const createRes = await fetch("https://api.spotify.com/v1/me/playlists", {
    method: "POST",
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
        name,
        description,
        public: isPublic,
    }),
  });

  const createText = await createRes.text();

// ALWAYS log what Spotify returned (this is what we need)
  console.log("SPOTIFY CREATE STATUS:", createRes.status);
  console.log("SPOTIFY CREATE BODY:", createText);

  if (!createRes.ok) {
    return bad(`Spotify error (create playlist): ${createText}`, createRes.status);
  }

  const created = JSON.parse(createText);

  const playlistId = created?.id;
  const playlistUrl = created?.external_urls?.spotify;

  if (!playlistId) return bad("Playlist created but missing playlist id.", 400);

  // 3) Add tracks
  const addRes = await fetch(
    `https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/items`,
    {
        method: "POST",
        headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ uris }), // still the same payload
    }
  );

    const addText = await addRes.text();

  if (!addRes.ok) {
    return bad(`Spotify error (add items): ${addText}`, addRes.status);
  }

  return NextResponse.json(
    {
      name: created?.name ?? name,
      url: playlistUrl ?? `https://open.spotify.com/playlist/${playlistId}`,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
