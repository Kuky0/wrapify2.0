// Import global CSS once at the root layout so all routes share the same base styles.
import "./globals.css";

export const metadata = {
  title: "Spotify Stats",
  description: "View your top tracks by time range",
};

// RootLayout wraps every page in the App Router.
// `children` represents the route-specific UI that gets inserted into this shell.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
