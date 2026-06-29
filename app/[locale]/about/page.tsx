import type { Metadata } from "next";
import { Building2, Compass, Crosshair, Users } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const blocks = [
  ["what", Building2],
  ["who", Users],
  ["why", Crosshair],
  ["vision", Compass]
] as const;

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return localizedPageMetadata(params, {
    path: "/about",
    titleKey: "about.title",
    descriptionKey: "about.description",
    fallbackTitle: "About DitakNet",
    fallbackDescription: "Learn who DitakNet is for and why it helps reduce physical IT visits."
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main className="container-page py-12">
      <SectionHeading title={t("about.title")} description={t("about.description")} />
      <div className="grid gap-4 md:grid-cols-2">
        {blocks.map(([key, Icon]) => (
          <Card key={key} className="p-6">
            <Icon className="mb-4 h-7 w-7 text-[var(--accent)]" />
            <p className="text-base leading-7 text-[var(--foreground)]">{t(`about.${key}`)}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
