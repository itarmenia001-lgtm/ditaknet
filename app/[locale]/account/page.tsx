import Link from "next/link";
import { redirect } from "next/navigation";
import { FileKey2, LifeBuoy, MessageCircle, PackageCheck, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/login?next=/${locale}/account`);
  }

  const [licenseRequests, tickets] = await Promise.all([
    db.licenseRequest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 4
    }),
    db.supportTicket.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 4
    })
  ]);

  return (
    <main className="container-page py-12">
      <h1 className="text-4xl font-bold">{t("account.title")}</h1>
      <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">{t("account.description")}</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <User className="h-6 w-6 text-[var(--brand)]" />
            <h2 className="text-xl font-bold">{t("account.profile")}</h2>
          </div>
          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">{t("forms.fields.fullName")}</dt>
              <dd className="font-semibold">{session.user.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">{t("forms.fields.email")}</dt>
              <dd className="font-semibold">{session.user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">{t("common.package")}</dt>
              <dd className="font-semibold">{session.user.interestedPackage || "FREE"}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <PackageCheck className="h-6 w-6 text-[var(--accent)]" />
            <h2 className="text-xl font-bold">{t("account.nextActions")}</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <ButtonLink href={`/${locale}/license/request`} variant="secondary">
              <FileKey2 className="h-4 w-4" />
              {t("account.requestLicense")}
            </ButtonLink>
            <ButtonLink href={`/${locale}/docs/getting-started`} variant="outline">
              {t("account.install")}
            </ButtonLink>
            <ButtonLink href={`/${locale}/docs/first-run-setup`} variant="outline">
              {t("account.setupGuide")}
            </ButtonLink>
            <ButtonLink href={`/${locale}/support/tickets/new`} variant="outline">
              <LifeBuoy className="h-4 w-4" />
              {t("account.contactSupport")}
            </ButtonLink>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">{t("account.licenses")}</h2>
            <Link href={`/${locale}/account/licenses`} className="text-sm font-bold text-[var(--brand)]">
              {t("common.open")}
            </Link>
          </div>
          <div className="space-y-3">
            {licenseRequests.length ? (
              licenseRequests.map((item) => (
                <div key={item.id} className="rounded-md border border-[var(--line)] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{item.installationId}</p>
                    <Badge tone="blue">{t(`status.license.${item.status}`)}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted)]">{formatDate(item.createdAt, locale)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--muted)]">{t("common.empty")}</p>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">{t("account.tickets")}</h2>
            <Link href={`/${locale}/support/tickets`} className="text-sm font-bold text-[var(--brand)]">
              {t("common.open")}
            </Link>
          </div>
          <div className="space-y-3">
            {tickets.length ? (
              tickets.map((ticket) => (
                <Link key={ticket.id} href={`/${locale}/support/tickets/${ticket.id}`} className="block rounded-md border border-[var(--line)] p-3 hover:border-[var(--brand)]">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{ticket.title}</p>
                    <Badge tone={ticket.status === "CLOSED" ? "gray" : "green"}>{t(`status.ticket.${ticket.status}`)}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted)]">{formatDate(ticket.updatedAt, locale)}</p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-[var(--muted)]">{t("common.empty")}</p>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-[var(--brand)]" />
          <div>
            <h2 className="text-xl font-bold">{t("account.messages")}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{t("contact.description")}</p>
          </div>
        </div>
      </Card>
    </main>
  );
}
