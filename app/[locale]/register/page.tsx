import type { Metadata } from "next";

import { BrandLogo } from "@/components/brand/brand-logo";
import { RegisterForm } from "@/components/forms/register-form";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main className="auth-page">
      <div className="container-page auth-page-grid py-12">
        <section className="auth-brand-panel fade-in-up">
          <BrandLogo brandName={t("common.brandName")} size="lg" showName={false} />
          <h1 className="auth-brand-title">{t("common.brandName")}</h1>
          <p className="auth-brand-tagline">{t("auth.registerDescription")}</p>
        </section>
        <Card className="auth-card fade-in-up fade-in-up--delay">
          <h2 className="text-3xl font-bold">{t("auth.registerTitle")}</h2>
          <RegisterForm locale={locale} messages={messages} />
        </Card>
      </div>
    </main>
  );
}
