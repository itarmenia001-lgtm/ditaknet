import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { docSlugs } from "@/lib/docs";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return localizedPageMetadata(params, {
    path: "/docs",
    titleKey: "docs.title",
    descriptionKey: "docs.description",
    fallbackTitle: "DitakNet documentation",
    fallbackDescription: "Guides for installing, activating, and operating DitakNet."
  });
}

export default async function DocsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main className="container-page py-12">
      <h1 className="text-4xl font-bold">{t("docs.title")}</h1>
      <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">{t("docs.description")}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {docSlugs.map((slug) => (
          <Link key={slug} href={`/${locale}/docs/${slug}`}>
            <Card className="flex items-center justify-between gap-4 p-5 transition hover:border-[var(--brand)]">
              <span className="flex items-center gap-3 font-bold">
                <BookOpen className="h-5 w-5 text-[var(--brand)]" />
                {t(`docs.items.${slug}`)}
              </span>
              <ChevronRight className="h-5 w-5 text-[var(--muted)]" />
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
