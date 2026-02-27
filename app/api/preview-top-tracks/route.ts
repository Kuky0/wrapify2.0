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

export async function GET(req: Request) {
  const token = await getAccessToken();
  if (!token) return bad("Not authenticated. Please log in again.", 401);

  const url = new URL(req.url);
  const timeRange = url.searchParams.get("time_range") ?? "short_term";
  const limitStr = url.searchParams.get("limit") ?? "10";

  const allowedRanges = new Set(["short_term", "medium_term", "long_term"]);
  if (!allowedRanges.has(timeRange)) {
    return bad("Invalid time_range. Use short_term, medium_term, or long_term.");
  }

  const limit = Math.max(1, Math.min(50, Number(limitStr)));
  if (!Number.isFinite(limit)) return bad("Invalid limit.");

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

  const json = await topRes.json();

  const tracks = (json.items ?? []).map((t: any) => {
    const imageUrl =
      t?.album?.images?.[2]?.url ||
      t?.album?.images?.[1]?.url ||
      t?.album?.images?.[0]?.url ||
      null;

    return {
      id: t.id,
      name: t.name,
      artists: (t.artists ?? []).map((a: any) => a.name).join(", "),
      album: t?.album?.name ?? "",
      imageUrl,
      uri: t?.external_urls?.spotify ?? t?.uri ?? "#",
      spotifyUri: t?.uri ?? null,
    };
  });

  return NextResponse.json(
    { timeRange, limit, tracks },
    { headers: { "Cache-Control": "no-store" } }
  );
}
