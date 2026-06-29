import Link from "next/link";
import { Activity, Contact, FileKey2, MessageSquareText, ShieldCheck, Ticket, UserCheck, Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { minutesAgoDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const onlineSince = minutesAgoDate(5);
  const [users, onlineUsers, pendingUsers, activeSubscribers, licenses, contacts, tickets, discussions] = await Promise.all([
    db.user.count(),
    db.userSession.count({
      where: {
        revokedAt: null,
        lastSeenAt: { gte: onlineSince }
      }
    }),
    db.user.count({ where: { accountStatus: "PENDING" } }),
    db.user.count({ where: { subscriptionStatus: "ACTIVE" } }),
    db.licenseRequest.count(),
    db.contactMessage.count(),
    db.supportTicket.count(),
    db.discussion.count()
  ]);

  const stats = [
    ["users", users, Users],
    ["sessions", onlineUsers, Activity],
    ["pendingUsers", pendingUsers, ShieldCheck],
    ["activeSubscribers", activeSubscribers, UserCheck],
    ["license-requests", licenses, FileKey2],
    ["contact-messages", contacts, Contact],
    ["tickets", tickets, Ticket],
    ["discussions", discussions, MessageSquareText]
  ] as const;

  return (
    <div>
      <h1 className="text-4xl font-bold">{t("admin.dashboard")}</h1>
      <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">{t("admin.description")}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map(([key, value, Icon]) => (
          <Link key={key} href={key === "pendingUsers" || key === "activeSubscribers" ? `/${locale}/admin/users` : `/${locale}/admin/${key}`}>
            <Card className="p-5 transition hover:border-[var(--brand)]">
              <Icon className="mb-4 h-7 w-7 text-[var(--brand)]" />
              <p className="text-3xl font-black">{value}</p>
              <p className="mt-1 text-sm font-bold text-[var(--muted)]">{t(`admin.nav.${key}`)}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
