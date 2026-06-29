import { LicenseStatusForm } from "@/components/admin/license-status-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminLicenseRequestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const requests = await db.licenseRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">{t("admin.nav.license-requests")}</h1>
      <div className="mt-6 grid gap-4">
        {requests.length ? (
          requests.map((item) => (
            <Card key={item.id} className="grid gap-5 p-5 lg:grid-cols-[1fr_260px]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold">{item.installationId}</h2>
                  <Badge tone="blue">{t(`status.license.${item.status}`)}</Badge>
                  <Badge tone="green">{item.currentPackage} → {item.requestedPackage}</Badge>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">{item.ownerName} · {item.email} · {formatDate(item.createdAt, locale)}</p>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6">{item.reason}</p>
                <p className="mt-3 text-xs font-semibold text-[var(--muted)]">{item.user?.name || item.user?.email || "Public request"}</p>
              </div>
              <LicenseStatusForm id={item.id} locale={locale} messages={messages} currentStatus={item.status} currentNotes={item.adminNotes} />
            </Card>
          ))
        ) : (
          <Card className="p-5 text-sm text-[var(--muted)]">{t("common.empty")}</Card>
        )}
      </div>
    </div>
  );
}
