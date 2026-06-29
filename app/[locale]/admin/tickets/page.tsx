import Link from "next/link";

import { TicketStatusForm } from "@/components/admin/ticket-status-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminTicketsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const tickets = await db.supportTicket.findMany({
    orderBy: { updatedAt: "desc" },
    include: { user: { select: { name: true, email: true } } }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">{t("admin.nav.tickets")}</h1>
      <div className="mt-6 grid gap-4">
        {tickets.length ? (
          tickets.map((ticket) => (
            <Card key={ticket.id} className="grid gap-5 p-5 lg:grid-cols-[1fr_220px]">
              <div>
                <Link href={`/${locale}/support/tickets/${ticket.id}`} className="text-xl font-bold hover:text-[var(--brand)]">
                  {ticket.title}
                </Link>
                <p className="mt-1 text-sm text-[var(--muted)]">{ticket.user.name} · {ticket.user.email} · {formatDate(ticket.updatedAt, locale)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="blue">{ticket.category}</Badge>
                  <Badge tone={ticket.priority === "HIGH" ? "amber" : "gray"}>{t(`forms.priorities.${ticket.priority}`)}</Badge>
                  <Badge tone={ticket.status === "CLOSED" ? "gray" : "green"}>{t(`status.ticket.${ticket.status}`)}</Badge>
                </div>
              </div>
              <TicketStatusForm id={ticket.id} locale={locale} messages={messages} currentStatus={ticket.status} currentPriority={ticket.priority} />
            </Card>
          ))
        ) : (
          <Card className="p-5 text-sm text-[var(--muted)]">{t("common.empty")}</Card>
        )}
      </div>
    </div>
  );
}
