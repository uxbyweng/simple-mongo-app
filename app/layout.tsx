import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulletin Board",
  description: "Post a note. Wipe it clean. A chalkboard built with Next.js, MongoDB & Docker.",
  openGraph: {
    title: "Bulletin Board",
    description: "Post a note. Wipe it clean. A chalkboard built with Next.js, MongoDB & Docker.",
    url: "https://simple-bulletin-board.onrender.com",
    siteName: "Bulletin Board",
    images: [
      {
        url: "https://simple-bulletin-board.onrender.com/og-image-bulletin-board.png",
        width: 1200,
        height: 630,
        alt: "Bulletin Board – Post a note. Wipe it clean.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulletin Board",
    description: "Post a note. Wipe it clean. A chalkboard built with Next.js, MongoDB & Docker.",
    images: ["https://simple-bulletin-board.onrender.com/og-image-bulletin-board.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <meta property="og:image" content="https://simple-bulletin-board.onrender.com/og-image-bulletin-board.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Bulletin Board – Post a note. Wipe it clean." />
        <link
          href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Fuzzy+Bubbles:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          body { margin: 0; background: #3a2a1c; }
          input::placeholder, textarea::placeholder { color: rgba(240,238,228,.32); }
          input:focus, textarea:focus { outline: none; }
          @keyframes chalkIn {
            from { opacity: 0; transform: translateY(10px) rotate(0deg); }
            to { opacity: 1; }
          }
          @keyframes dustOut {
            to { opacity: 0; filter: blur(6px); transform: scale(.96) translateY(4px); }
          }
          .chalk-erase:hover { opacity: .9 !important; }
          .chalk-wipe:hover { color: rgba(243,240,230,.8) !important; }
          @media (max-width: 600px) {
            .form-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
