import type { Metadata } from "next";
import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { LoginForm } from "@/components/forms/login-form";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const session = await getSession();

  return (
    <main className="auth-page">
      <div className="auth-page-glow auth-page-glow--left" aria-hidden="true" />
      <div className="auth-page-glow auth-page-glow--right" aria-hidden="true" />
      <div className="container-page auth-page-grid py-12">
        <section className="auth-brand-panel fade-in-up">
          <BrandLogo brandName={t("common.brandName")} size="lg" showName={false} />
          <h1 className="auth-brand-title">{t("common.brandName")}</h1>
          <p className="auth-brand-tagline">{t("home.hero.subtitle")}</p>
        </section>

        <Card className="auth-card fade-in-up fade-in-up--delay">
          <h2 className="text-3xl font-bold">{t("auth.loginTitle")}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{t("auth.loginDescription")}</p>
          {session ? (
            <Link href={`/${locale}/account`} className="mt-6 inline-flex font-bold text-[var(--brand)]">
              {t("nav.account")}
            </Link>
          ) : (
            <div className="mt-6">
              <LoginForm locale={locale} messages={messages} />
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
