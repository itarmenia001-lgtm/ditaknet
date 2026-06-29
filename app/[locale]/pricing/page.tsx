import { SectionHeading } from "@/components/marketing/section-heading";
import { PricingTable } from "@/components/pricing/pricing-table";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main className="container-page py-12">
      <SectionHeading title={t("pricing.title")} description={t("pricing.description")} />
      <PricingTable locale={locale} messages={messages} />
    </main>
  );
}
