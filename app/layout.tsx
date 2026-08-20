import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simple Mongo App",
  description: "Minimalbeispiel: Next.js + MongoDB + Docker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
