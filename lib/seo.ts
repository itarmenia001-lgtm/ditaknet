import type { Metadata } from "next";

import { getDictionary } from "@/lib/i18n";
import { defaultLocale, Locale, locales, Messages, getNestedMessage, normalizeLocale } from "@/lib/i18n-core";

export const publicSeoPaths = [
  "/",
  "/features",
  "/pricing",
  "/docs",
  "/support",
  "/about",
  "/faq",
  "/blog",
  "/contact",
  "/discussions",
  "/license/request"
] as const;

const ogLocales: Record<Locale, string> = {
  hy: "hy_AM",
  en: "en_US",
  ru: "ru_RU"
};

export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.PUBLIC_DOMAIN ? `https://${process.env.PUBLIC_DOMAIN}` : "https://ditaknet.com");
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}

export function localizedPath(locale: Locale, path: string) {
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalizedPath}`;
}

export function absoluteUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function messageText(messages: Messages, key: string, fallback: string) {
  const value = getNestedMessage(messages, key);
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function alternateLanguages(path: string) {
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, absoluteUrl(localizedPath(locale, path))])
  ) as Record<Locale, string>;

  return {
    ...languages,
    "x-default": absoluteUrl(localizedPath(defaultLocale, path))
  };
}

export function buildLocalizedMetadata({
  locale,
  path,
  title,
  description,
  noIndex = false
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  noIndex?: boolean;
}): Metadata {
  const canonicalPath = localizedPath(locale, path);
  const canonicalUrl = absoluteUrl(canonicalPath);
  const imageUrl = absoluteUrl("/images/logo.png");

  // Keep canonical, Open Graph, and hreflang generation in one place so each
  // translated page points search engines to the same language-aware URL set.
  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages(path)
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "DitakNet",
      locale: ogLocales[locale],
      alternateLocale: locales.filter((item) => item !== locale).map((item) => ogLocales[item]),
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 512,
          height: 512,
          alt: "DitakNet"
        }
      ]
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [imageUrl]
    },
    robots: noIndex
      ? {
          index: false,
          follow: false
        }
      : {
          index: true,
          follow: true
        }
  };
}

export async function localizedPageMetadata(
  params: Promise<{ locale: string }>,
  {
    path,
    titleKey,
    descriptionKey,
    fallbackTitle,
    fallbackDescription,
    noIndex = false
  }: {
    path: string;
    titleKey: string;
    descriptionKey: string;
    fallbackTitle: string;
    fallbackDescription: string;
    noIndex?: boolean;
  }
) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);

  return buildLocalizedMetadata({
    locale,
    path,
    title: messageText(messages, titleKey, fallbackTitle),
    description: messageText(messages, descriptionKey, fallbackDescription),
    noIndex
  });
}
