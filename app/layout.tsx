import type { ReactNode } from "react";

import "@/app/globals.css";

import { normalizeLocale } from "@/lib/i18n-core";

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode;
  params?: Promise<{ locale?: string }>;
}) {
  const resolvedParams = params ? await params : undefined;
  const lang = normalizeLocale(resolvedParams?.locale);

  return (
    <html lang={lang} data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
