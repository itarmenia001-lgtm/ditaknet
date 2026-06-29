import Link from "next/link";
import { BookOpen, HelpCircle, KeyRound, LifeBuoy, MessageSquarePlus, Wrench } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";

const supportLinks = [
  ["docs", "docs", BookOpen],
  ["newTicket", "support/tickets/new", MessageSquarePlus],
  ["tickets", "support/tickets", LifeBuoy],
  ["license", "license/request", KeyRound],
  ["troubleshooting", "faq", Wrench],
  ["helpCenter", "contact", HelpCircle]
] as const;

export const dynamic = "force-dynamic";

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const session = await getSession();

  return (
    <main className="container-page py-12">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-bold">{t("support.title")}</h1>
          <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">{t("support.description")}</p>
        </div>
        {session ? (
          <ButtonLink href={`/${locale}/support/tickets/new`} variant="secondary">
            {t("support.newTicket")}
          </ButtonLink>
        ) : (
          <ButtonLink href={`/${locale}/login?next=/${locale}/support/tickets/new`} variant="secondary">
            {t("nav.login")}
          </ButtonLink>
        )}
      </div>
      {!session ? <p className="mt-4 rounded-md bg-[#fff8e7] p-4 text-sm font-semibold text-[#7a5200]">{t("support.needLogin")}</p> : null}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {supportLinks.map(([key, href, Icon]) => (
          <Link key={key} href={`/${locale}/${href}`}>
            <Card className="h-full p-5 transition hover:border-[var(--brand)]">
              <Icon className="mb-4 h-7 w-7 text-[var(--brand)]" />
              <h2 className="text-lg font-bold">{t(`support.${key}`)}</h2>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
