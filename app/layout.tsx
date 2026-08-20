import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simple Bulletin Board",
  description: "Minimalbeispiel: Next.js + MongoDB + Docker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fuzzy+Bubbles&family=Single+Day&family=Permanent+Marker&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
