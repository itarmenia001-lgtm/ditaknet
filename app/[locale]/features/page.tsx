import { Bell, Camera, ChartNoAxesCombined, Container, Languages, Map, Network, Radar, Route, Server, Settings, ShieldCheck } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";

const items = [
  ["network", Network],
  ["discovery", Radar],
  ["camera", Camera],
  ["server", Server],
  ["checks", ShieldCheck],
  ["telegram", Bell],
  ["reports", ChartNoAxesCombined],
  ["agent", Route],
  ["topology", Map],
  ["maintenance", Settings],
  ["languages", Languages],
  ["docker", Container]
] as const;

export default async function FeaturesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main className="container-page py-12">
      <SectionHeading title={t("features.title")} description={t("features.description")} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(([key, Icon]) => (
          <Card key={key} className="p-5">
            <Icon className="mb-4 h-7 w-7 text-[var(--brand)]" />
            <h2 className="text-lg font-bold">{t(`features.items.${key}`)}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{t("features.description")}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
