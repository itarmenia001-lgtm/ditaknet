import { UserAccessForm } from "@/components/admin/user-access-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { formatDate, minutesAgoDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const onlineSince = minutesAgoDate(5);

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      companyName: true,
      preferredLanguage: true,
      interestedPackage: true,
      accountStatus: true,
      subscriptionStatus: true,
      purchaseStatus: true,
      subscriptionExpiresAt: true,
      lastLoginAt: true,
      lastLoginIp: true,
      createdAt: true,
      sessions: {
        where: { revokedAt: null },
        orderBy: { lastSeenAt: "desc" },
        take: 1,
        select: {
          ipAddress: true,
          country: true,
          city: true,
          userAgent: true,
          lastSeenAt: true
        }
      }
    }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">{t("admin.nav.users")}</h1>
      <div className="mt-6 grid gap-4">
        {users.length ? (
          users.map((user) => {
            const latestSession = user.sessions[0];
            const isOnline = latestSession ? latestSession.lastSeenAt >= onlineSince : false;

            return (
              <Card key={user.id} className="grid gap-5 p-5 lg:grid-cols-[1fr_280px]">
                <div className="min-w-0">
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <h2 className="text-xl font-bold">{user.name}</h2>
                      <p className="mt-1 text-sm text-[var(--muted)]">{user.email}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {user.companyName || "-"} / {user.preferredLanguage}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={user.role === "ADMIN" ? "blue" : "gray"}>{user.role}</Badge>
                      <Badge tone={user.accountStatus === "APPROVED" ? "green" : user.accountStatus === "SUSPENDED" ? "red" : "amber"}>
                        {t(`status.account.${user.accountStatus}`)}
                      </Badge>
                      <Badge tone={user.purchaseStatus === "PURCHASED" ? "green" : user.purchaseStatus === "REQUESTED" ? "amber" : "gray"}>
                        {t(`status.purchase.${user.purchaseStatus}`)}
                      </Badge>
                      <Badge tone={user.subscriptionStatus === "ACTIVE" ? "green" : user.subscriptionStatus === "TRIAL" ? "blue" : "gray"}>
                        {t(`status.subscription.${user.subscriptionStatus}`)}
                      </Badge>
                      <Badge tone={isOnline ? "green" : "gray"}>{isOnline ? t("admin.online") : t("admin.offline")}</Badge>
                      <Badge>{formatDate(user.createdAt, locale)}</Badge>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
                    <div className="rounded-md border border-[var(--line)] p-3">
                      <p className="text-xs font-bold uppercase text-[var(--muted)]">{t("admin.connection")}</p>
                      <p className="mt-2 font-semibold">{latestSession?.ipAddress || user.lastLoginIp || "-"}</p>
                      <p className="mt-1 text-[var(--muted)]">
                        {[latestSession?.country, latestSession?.city].filter(Boolean).join(" / ") || "-"}
                      </p>
                      <p className="mt-1 text-[var(--muted)]">
                        {latestSession?.lastSeenAt ? `${t("admin.lastSeen")}: ${formatDate(latestSession.lastSeenAt, locale)}` : "-"}
                      </p>
                      <p className="mt-1 text-[var(--muted)]">
                        {user.lastLoginAt ? `${t("admin.lastLogin")}: ${formatDate(user.lastLoginAt, locale)}` : "-"}
                      </p>
                    </div>
                    <div className="rounded-md border border-[var(--line)] p-3">
                      <p className="text-xs font-bold uppercase text-[var(--muted)]">{t("admin.access")}</p>
                      <p className="mt-2 font-semibold">{user.interestedPackage || "FREE"}</p>
                      <p className="mt-1 text-[var(--muted)]">
                        {user.subscriptionExpiresAt
                          ? `${t("admin.subscriptionExpiresAt")}: ${formatDate(user.subscriptionExpiresAt, locale)}`
                          : t("admin.noExpiry")}
                      </p>
                      <p className="mt-1 break-words text-[var(--muted)]">{latestSession?.userAgent || "-"}</p>
                    </div>
                  </div>
                </div>

                <UserAccessForm id={user.id} locale={locale} messages={messages} defaults={user} />
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
