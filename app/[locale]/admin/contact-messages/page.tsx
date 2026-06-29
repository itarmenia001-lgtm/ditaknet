import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminContactMessagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const messagesList = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">{t("admin.nav.contact-messages")}</h1>
      <div className="mt-6 grid gap-4">
        {messagesList.length ? (
          messagesList.map((message) => (
            <Card key={message.id} className="p-5">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-bold">{message.name}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{message.email} · {message.companyName || "-"}</p>
                </div>
                <div className="flex gap-2">
                  <Badge tone="blue">{message.topic}</Badge>
                  <Badge>{message.status}</Badge>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6">{message.message}</p>
              <p className="mt-3 text-xs font-semibold text-[var(--muted)]">{formatDate(message.createdAt, locale)}</p>
            </Card>
          ))
        ) : (
          <Card className="p-5 text-sm text-[var(--muted)]">{t("common.empty")}</Card>
        )}
      </div>
    </div>
  );
}
