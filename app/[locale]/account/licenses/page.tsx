import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountLicensesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/login?next=/${locale}/account/licenses`);
  }

  const requests = await db.licenseRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="container-page py-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl font-bold">{t("license.myLicenses")}</h1>
          <p className="mt-2 text-[var(--muted)]">{t("license.activateInfoDescription")}</p>
        </div>
        <ButtonLink href={`/${locale}/license/request`} variant="secondary">
          {t("account.requestLicense")}
        </ButtonLink>
      </div>
      <div className="mt-8 grid gap-4">
        {requests.length ? (
          requests.map((item) => (
            <Card key={item.id} className="p-5">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-bold">{item.installationId}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{item.currentPackage} → {item.requestedPackage}</p>
                </div>
                <Badge tone="blue">{t(`status.license.${item.status}`)}</Badge>
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{item.reason}</p>
              <p className="mt-3 text-xs font-semibold text-[var(--muted)]">{formatDate(item.createdAt, locale)}</p>
            </Card>
          ))
        ) : (
          <Card className="p-5 text-sm text-[var(--muted)]">{t("common.empty")}</Card>
        )}
      </div>
    </main>
  );
}
