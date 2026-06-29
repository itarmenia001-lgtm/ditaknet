import type { Metadata } from "next";
import Link from "next/link";
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
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function TicketsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/login?next=/${locale}/support/tickets`);
  }

  const tickets = await db.supportTicket.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <main className="container-page py-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl font-bold">{t("support.tickets")}</h1>
          <p className="mt-2 text-[var(--muted)]">{t("support.description")}</p>
        </div>
        <ButtonLink href={`/${locale}/support/tickets/new`} variant="secondary">
          {t("support.newTicket")}
        </ButtonLink>
      </div>
      <div className="mt-8 grid gap-4">
        {tickets.length ? (
          tickets.map((ticket) => (
            <Link key={ticket.id} href={`/${locale}/support/tickets/${ticket.id}`}>
              <Card className="p-5 transition hover:border-[var(--brand)]">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-xl font-bold">{ticket.title}</h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">{ticket.category} · {formatDate(ticket.updatedAt, locale)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge tone={ticket.priority === "HIGH" ? "amber" : "gray"}>{t(`forms.priorities.${ticket.priority}`)}</Badge>
                    <Badge tone={ticket.status === "CLOSED" ? "gray" : "green"}>{t(`status.ticket.${ticket.status}`)}</Badge>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <Card className="p-5 text-sm text-[var(--muted)]">{t("common.empty")}</Card>
        )}
      </div>
    </main>
  );
}
