import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schwarzes Brett",
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
