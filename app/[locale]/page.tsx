import type { Metadata } from "next";
import { ArrowRight, Bell, Camera, CheckCircle2, Container, Network, Radar, Server } from "lucide-react";

import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { HeroShowcase } from "@/components/marketing/hero-showcase";
import { SectionHeading } from "@/components/marketing/section-heading";
import { PricingTable } from "@/components/pricing/pricing-table";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

const featureIcons = [Radar, Camera, Server, Bell, Container, Network] as const;

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return localizedPageMetadata(params, {
    path: "/",
    titleKey: "home.metaTitle",
    descriptionKey: "home.metaDescription",
    fallbackTitle: "DitakNet",
    fallbackDescription: "DitakNet local network visibility, monitoring, and support portal."
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main>
      <section className="surface-grid border-b border-[var(--line)] bg-[#f7fbfc] py-14 md:py-20">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div className="fade-in-up">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--accent)]">{t("home.hero.eyebrow")}</p>
            <h1 className="text-5xl font-black leading-tight text-[var(--foreground)] md:text-7xl">{t("common.brandName")}</h1>
            <p className="mt-4 text-2xl font-bold leading-9 text-[var(--brand-dark)] md:text-3xl">{t("home.hero.title")}</p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">{t("home.hero.subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`/${locale}/register`} variant="secondary" size="lg">
                {t("home.hero.getStarted")}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href={`/${locale}/license/request`} variant="primary" size="lg">
                {t("home.hero.requestLicense")}
              </ButtonLink>
              <ButtonLink href={`/${locale}/pricing`} variant="outline" size="lg">
                {t("home.hero.viewPricing")}
              </ButtonLink>
              <ButtonLink href={`/${locale}/contact`} variant="ghost" size="lg">
                {t("home.hero.contactSupport")}
              </ButtonLink>
            </div>
            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              {[
                ["100+", t("home.metrics.devices")],
                ["300+", t("home.metrics.checks")],
                ["24/7", t("home.metrics.alerts")]
              ].map(([value, label]) => (
                <div key={label} className="metric-card-animate rounded-md border border-[var(--line)] bg-white p-3">
                  <p className="text-2xl font-black text-[var(--brand)]">{value}</p>
                  <p className="text-xs font-semibold text-[var(--muted)]">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="dashboard-preview-animate space-y-5">
            <HeroShowcase title={t("home.dashboard.title")} subtitle={t("home.hero.imageAlt")} />
            <DashboardPreview
              brandName={t("common.brandName")}
              labels={{
                title: t("home.dashboard.title"),
                healthy: t("home.dashboard.healthy"),
                warnings: t("home.dashboard.warnings"),
                offline: t("home.dashboard.offline"),
                discovery: t("home.dashboard.discovery"),
                topology: t("home.dashboard.topology"),
                alerts: t("home.dashboard.alerts")
              }}
            />
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page">
          <SectionHeading title={t("home.explain.title")} description={t("home.explain.description")} />
          <div className="grid gap-4 md:grid-cols-3">
            {["ready", "discovery", "telegram"].map((key) => (
              <Card key={key} className="p-5">
                <CheckCircle2 className="mb-4 h-7 w-7 text-[var(--accent)]" />
                <h3 className="text-xl font-bold">{t(`home.${key}.title`)}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{t(`home.${key}.description`)}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-page">
          <SectionHeading eyebrow={t("home.features.eyebrow")} title={t("home.features.title")} description={t("home.features.description")} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const Icon = featureIcons[index];
              return (
                <Card key={index} className="p-5">
                  <Icon className="mb-4 h-7 w-7 text-[var(--brand)]" />
                  <h3 className="text-lg font-bold">{t(`home.features.${index}.title`)}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{t(`home.features.${index}.description`)}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page">
          <SectionHeading title={t("pricing.title")} description={t("pricing.description")} />
          <PricingTable locale={locale} messages={messages} compact />
        </div>
      </section>

      <section className="bg-[#10202d] py-12 text-white">
        <div className="container-page flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold">{t("home.faqPreview.title")}</h2>
            <p className="mt-2 max-w-2xl text-[#b6cad5]">{t("home.faqPreview.description")}</p>
          </div>
          <ButtonLink href={`/${locale}/faq`} variant="secondary">
            {t("nav.faq")}
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
