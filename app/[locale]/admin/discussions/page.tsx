import { DiscussionReplyForm } from "@/components/forms/discussion-reply-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDiscussionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const discussions = await db.discussion.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { name: true } } }
      }
    }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">{t("admin.nav.discussions")}</h1>
      <div className="mt-6 grid gap-4">
        {discussions.length ? (
          discussions.map((discussion) => (
            <Card key={discussion.id} className="p-5">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-bold">{discussion.title}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{discussion.user.name} · {discussion.user.email} · {formatDate(discussion.updatedAt, locale)}</p>
                </div>
                <div className="flex gap-2">
                  <Badge tone={discussion.isPublic ? "green" : "gray"}>{discussion.isPublic ? t("common.yes") : t("common.no")}</Badge>
                  <Badge tone={discussion.status === "ANSWERED" ? "green" : "gray"}>{t(`status.discussion.${discussion.status}`)}</Badge>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6">{discussion.body}</p>
              {discussion.replies.length ? (
                <div className="mt-4 space-y-2 border-t border-[var(--line)] pt-4">
                  {discussion.replies.map((reply) => (
                    <div key={reply.id} className="rounded-md bg-[#f3f8fa] p-3 text-sm">
                      <p className="font-bold">{reply.user.name}</p>
                      <p className="mt-1 whitespace-pre-wrap leading-6">{reply.body}</p>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="mt-4 border-t border-[var(--line)] pt-4">
                <DiscussionReplyForm locale={locale} messages={messages} discussionId={discussion.id} />
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-5 text-sm text-[var(--muted)]">{t("common.empty")}</Card>
        )}
      </div>
    </div>
  );
}
