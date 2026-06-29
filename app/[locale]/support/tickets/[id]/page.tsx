import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { TicketReplyForm } from "@/components/forms/ticket-reply-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { canAccessOwnedResource, isAdmin } from "@/lib/permissions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function TicketDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: rawLocale, id } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/login?next=/${locale}/support/tickets/${id}`);
  }

  const ticket = await db.supportTicket.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { name: true } },
          admin: { select: { name: true } }
        }
      }
    }
  });

  if (!ticket || !canAccessOwnedResource(session.user, ticket.userId)) {
    redirect(`/${locale}/support/tickets`);
  }

  return (
    <main className="container-page py-12">
      <Card className="p-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--accent)]">{t("support.ticketDetail")}</p>
            <h1 className="mt-2 text-4xl font-bold">{ticket.title}</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">{ticket.category} · {formatDate(ticket.createdAt, locale)}</p>
          </div>
          <div className="flex gap-2">
            <Badge tone={ticket.priority === "HIGH" ? "amber" : "gray"}>{t(`forms.priorities.${ticket.priority}`)}</Badge>
            <Badge tone={ticket.status === "CLOSED" ? "gray" : "green"}>{t(`status.ticket.${ticket.status}`)}</Badge>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-4">
        {ticket.messages.map((message) => (
          <Card key={message.id} className="p-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="font-bold">{message.adminId ? message.admin?.name || t("admin.title") : message.user?.name || session.user.name}</p>
              <Badge tone={message.adminId ? "blue" : "gray"}>{message.adminId ? t("admin.title") : t("nav.account")}</Badge>
            </div>
            <p className="whitespace-pre-wrap leading-7 text-[var(--foreground)]">{message.message}</p>
            <p className="mt-3 text-xs font-semibold text-[var(--muted)]">{formatDate(message.createdAt, locale)}</p>
          </Card>
        ))}
      </div>

      {ticket.status !== "CLOSED" || isAdmin(session.user) ? (
        <Card className="mt-6 p-5">
          <TicketReplyForm locale={locale} messages={messages} ticketId={ticket.id} />
        </Card>
      ) : null}
    </main>
  );
}
