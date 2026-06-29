import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import { docSlugs } from "@/lib/docs";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { buildLocalizedMetadata, messageText } from "@/lib/seo";

export function generateStaticParams() {
  return docSlugs.flatMap((slug) => [
    { locale: "hy", slug },
    { locale: "en", slug },
    { locale: "ru", slug }
  ]);
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const titleKey = docSlugs.includes(slug as (typeof docSlugs)[number])
    ? `docs.items.${slug}`
    : "docs.title";

  return buildLocalizedMetadata({
    locale,
    path: `/docs/${slug}`,
    title: messageText(messages, titleKey, "DitakNet documentation"),
    description: messageText(messages, "docs.description", "Guides for installing, activating, and operating DitakNet.")
  });
}

export default async function DocPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!docSlugs.includes(slug as (typeof docSlugs)[number])) {
    notFound();
  }

  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main className="container-page py-12">
      <Link href={`/${locale}/docs`} className="text-sm font-bold text-[var(--brand)]">
        {t("common.back")}
      </Link>
      <Card className="mt-5 p-6">
        <h1 className="text-4xl font-bold">{t(`docs.items.${slug}`)}</h1>
        <p className="mt-4 leading-7 text-[var(--muted)]">{t("docs.body")}</p>
        <div className="mt-6 rounded-md bg-[#edf7f4] p-4 text-sm leading-6 text-[#145c45]">
          {t("license.description")}
        </div>
      </Card>
    </main>
  );
}
