import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Spotify Stats</h1>
      <p>Log in to view your top tracks (short, medium, long term).</p>

      <Link href="/login">Login</Link>
    </main>
  );
}
