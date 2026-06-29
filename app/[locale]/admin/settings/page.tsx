import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { getSiteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const site = getSiteConfig();

  return (
    <div>
      <h1 className="text-3xl font-bold">{t("admin.nav.settings")}</h1>
      <Card className="mt-6 p-5">
        <p className="leading-7 text-[var(--muted)]">{t("admin.settingsText")}</p>
        <dl className="mt-5 grid gap-3 text-sm">
          {Object.entries(site).map(([key, value]) => (
            <div key={key} className="flex justify-between gap-4 border-b border-[var(--line)] pb-2">
              <dt className="font-bold">{key}</dt>
              <dd className="text-[var(--muted)]">{value || "-"}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
