import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getDictionary } from "@/lib/i18n";
import { Locale, locales, normalizeLocale } from "@/lib/i18n-core";
import { buildLocalizedMetadata, messageText } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);

  return {
    ...buildLocalizedMetadata({
      locale,
      path: "/",
      title: messageText(messages, "home.metaTitle", "DitakNet"),
      description: messageText(
        messages,
        "home.metaDescription",
        "DitakNet public website and customer portal"
      )
    }),
    icons: {
      icon: "/favicon.png",
      apple: "/images/logo.png"
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);

  return (
    <>
      <SiteHeader locale={locale} messages={messages} />
      {children}
      <SiteFooter locale={locale} messages={messages} />
    </>
  );
}
