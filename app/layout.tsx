import type { ReactNode } from "react";

import "@/app/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="hy" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
