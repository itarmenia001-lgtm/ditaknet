import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function ActivateInfoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main className="container-page flex min-h-[65vh] items-center justify-center py-12">
      <Card className="max-w-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[var(--accent)]" />
        <h1 className="mt-5 text-3xl font-bold">{t("license.activateInfoTitle")}</h1>
        <p className="mt-3 leading-7 text-[var(--muted)]">{t("license.activateInfoDescription")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href={`/${locale}/register`} variant="secondary">
            {t("nav.register")}
          </ButtonLink>
          <ButtonLink href={`/${locale}/support`} variant="outline">
            {t("nav.support")}
          </ButtonLink>
        </div>
      </Card>
    </main>
  );
}
