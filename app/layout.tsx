import "./globals.css";

export const metadata = {
  title: "Spotify Stats",
  description: "View your top tracks by time range",
};

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

