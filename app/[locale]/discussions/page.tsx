import type { Metadata } from "next";
import { MessageSquareText } from "lucide-react";

import { DiscussionReplyForm } from "@/components/forms/discussion-reply-form";
import { DiscussionForm } from "@/components/forms/discussion-form";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return localizedPageMetadata(params, {
    path: "/discussions",
    titleKey: "community.title",
    descriptionKey: "community.description",
    fallbackTitle: "DitakNet community discussions",
    fallbackDescription: "Ask public product questions about DitakNet."
  });
}

export default async function DiscussionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const session = await getSession();

  const discussions = await db.discussion.findMany({
    where: session ? { OR: [{ isPublic: true }, { userId: session.user.id }] } : { isPublic: true },
    orderBy: { updatedAt: "desc" },
    include: {
      user: { select: { name: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { name: true } } }
      }
    }
  });

  return (
    <main className="container-page py-12">
      <h1 className="text-4xl font-bold">{t("community.title")}</h1>
      <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">{t("community.description")}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <MessageSquareText className="h-6 w-6 text-[var(--brand)]" />
            <h2 className="text-xl font-bold">{t("community.ask")}</h2>
          </div>
          {session ? (
            <DiscussionForm locale={locale} messages={messages} />
          ) : (
            <div className="space-y-4">
              <p className="text-sm leading-6 text-[var(--muted)]">{t("auth.loginRequired")}</p>
              <ButtonLink href={`/${locale}/login?next=/${locale}/discussions`} variant="secondary">
                {t("nav.login")}
              </ButtonLink>
            </div>
          )}
        </Card>

        <div className="grid gap-4">
          {discussions.length ? (
            discussions.map((discussion) => (
              <Card key={discussion.id} id={discussion.id} className="p-5">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-xl font-bold">{discussion.title}</h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">{discussion.user.name} · {formatDate(discussion.createdAt, locale)}</p>
                  </div>
                  <Badge tone={discussion.status === "ANSWERED" ? "green" : "gray"}>{t(`status.discussion.${discussion.status}`)}</Badge>
                </div>
                <p className="mt-4 whitespace-pre-wrap leading-7">{discussion.body}</p>
                {discussion.replies.length ? (
                  <div className="mt-4 space-y-3 border-t border-[var(--line)] pt-4">
                    {discussion.replies.map((reply) => (
                      <div key={reply.id} className="rounded-md bg-[#f3f8fa] p-3 text-sm">
                        <p className="font-bold">{reply.user.name}</p>
                        <p className="mt-1 whitespace-pre-wrap leading-6">{reply.body}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {session ? (
                  <div className="mt-4 border-t border-[var(--line)] pt-4">
                    <DiscussionReplyForm locale={locale} messages={messages} discussionId={discussion.id} />
                  </div>
                ) : null}
              </Card>
            ))
          ) : (
            <Card className="p-5 text-sm text-[var(--muted)]">{t("common.empty")}</Card>
          )}
        </div>
      </div>
    </main>
  );
}
