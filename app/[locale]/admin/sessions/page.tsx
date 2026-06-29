import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { formatDate, minutesAgoDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSessionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const onlineSince = minutesAgoDate(5);

  const sessions = await db.userSession.findMany({
    orderBy: { lastSeenAt: "desc" },
    take: 100,
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true,
          accountStatus: true,
          subscriptionStatus: true,
          purchaseStatus: true
        }
      }
    }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">{t("admin.nav.sessions")}</h1>
      <div className="mt-6 grid gap-4">
        {sessions.length ? (
          sessions.map((session) => {
            const isOnline = !session.revokedAt && session.lastSeenAt >= onlineSince;

            return (
              <Card key={session.id} className="p-5">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold">{session.user.name}</h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">{session.user.email}</p>
                    <p className="mt-3 text-sm font-semibold">{session.ipAddress || "-"}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {[session.country, session.city].filter(Boolean).join(" / ") || "-"}
                    </p>
                    <p className="mt-2 break-words text-sm text-[var(--muted)]">{session.userAgent || "-"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:max-w-[360px] md:justify-end">
                    <Badge tone={isOnline ? "green" : "gray"}>{isOnline ? t("admin.online") : t("admin.offline")}</Badge>
                    <Badge tone={session.revokedAt ? "red" : "blue"}>
                      {session.revokedAt ? t("admin.revoked") : t("admin.activeSession")}
                    </Badge>
                    <Badge tone={session.user.role === "ADMIN" ? "blue" : "gray"}>{session.user.role}</Badge>
                    <Badge tone={session.user.accountStatus === "APPROVED" ? "green" : session.user.accountStatus === "SUSPENDED" ? "red" : "amber"}>
                      {t(`status.account.${session.user.accountStatus}`)}
                    </Badge>
                    <Badge tone={session.user.purchaseStatus === "PURCHASED" ? "green" : session.user.purchaseStatus === "REQUESTED" ? "amber" : "gray"}>
                      {t(`status.purchase.${session.user.purchaseStatus}`)}
                    </Badge>
                    <Badge tone={session.user.subscriptionStatus === "ACTIVE" ? "green" : session.user.subscriptionStatus === "TRIAL" ? "blue" : "gray"}>
                      {t(`status.subscription.${session.user.subscriptionStatus}`)}
                    </Badge>
                    <Badge>{`${t("admin.lastSeen")}: ${formatDate(session.lastSeenAt, locale)}`}</Badge>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-5 text-sm text-[var(--muted)]">{t("common.empty")}</Card>
        )}
      </div>
    </div>
  );
}
