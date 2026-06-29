import type { Metadata } from "next";
import { Newspaper } from "lucide-react";

import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return localizedPageMetadata(params, {
    path: "/blog",
    titleKey: "blog.title",
    descriptionKey: "blog.description",
    fallbackTitle: "DitakNet news",
    fallbackDescription: "Product updates, release notes, and implementation articles."
  });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main className="container-page py-12">
      <h1 className="text-4xl font-bold">{t("blog.title")}</h1>
      <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">{t("blog.description")}</p>
      <Card className="mt-8 p-6">
        <Newspaper className="mb-4 h-8 w-8 text-[var(--brand)]" />
        <h2 className="text-2xl font-bold">{t("blog.placeholderTitle")}</h2>
        <p className="mt-2 leading-7 text-[var(--muted)]">{t("blog.placeholderText")}</p>
      </Card>
    </main>
  );
}
