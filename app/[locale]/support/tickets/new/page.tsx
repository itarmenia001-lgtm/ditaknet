import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { TicketForm } from "@/components/forms/ticket-form";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function NewTicketPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/login?next=/${locale}/support/tickets/new`);
  }

  return (
    <main className="container-page py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">{t("support.newTicket")}</h1>
        <p className="mt-3 leading-7 text-[var(--muted)]">{t("support.description")}</p>
        <Card className="mt-8 p-6">
          <TicketForm locale={locale} messages={messages} />
        </Card>
      </div>
    </main>
  );
}
