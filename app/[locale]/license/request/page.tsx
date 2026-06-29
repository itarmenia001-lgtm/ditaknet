import { LicenseRequestForm } from "@/components/forms/license-request-form";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";

export const dynamic = "force-dynamic";

export default async function LicenseRequestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const session = await getSession();

  return (
    <main className="container-page py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">{t("license.title")}</h1>
        <p className="mt-3 leading-7 text-[var(--muted)]">{t("license.description")}</p>
        <Card className="mt-8 p-6">
          <LicenseRequestForm
            locale={locale}
            messages={messages}
            defaults={{
              ownerName: session?.user.name,
              email: session?.user.email,
              currentPackage: session?.user.interestedPackage === "MEDIUM" || session?.user.interestedPackage === "PROFESSIONAL" ? session.user.interestedPackage : "FREE"
            }}
          />
        </Card>
      </div>
    </main>
  );
}
