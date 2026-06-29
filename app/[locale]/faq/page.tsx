import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return localizedPageMetadata(params, {
    path: "/faq",
    titleKey: "faq.title",
    descriptionKey: "home.faqPreview.description",
    fallbackTitle: "DitakNet FAQ",
    fallbackDescription: "Common answers about DitakNet installation, activation, scanning, and monitoring."
  });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main className="container-page py-12">
      <h1 className="text-4xl font-bold">{t("faq.title")}</h1>
      <div className="mt-8 grid gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <Card key={index} className="p-5">
            <h2 className="text-lg font-bold">{t(`faq.items.${index}.q`)}</h2>
            <p className="mt-2 leading-7 text-[var(--muted)]">{t(`faq.items.${index}.a`)}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
