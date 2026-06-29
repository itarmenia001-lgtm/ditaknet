import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { apiError } from "@/lib/api";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/permissions";
import { discussionReplySchema } from "@/lib/validators";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  let locale = "hy";

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = discussionReplySchema.safeParse(body);
    locale = parsed.success ? parsed.data.locale : body?.locale || locale;

    if (!parsed.success) {
      return apiError(locale, "forms.errors.invalidPayload", 400);
    }

    const session = await getSession();
    if (!session) {
      return apiError(locale, "auth.loginRequired", 401);
    }

    const discussion = await db.discussion.findUnique({ where: { id } });
    if (!discussion || (!discussion.isPublic && discussion.userId !== session.user.id && !isAdmin(session.user))) {
      return apiError(locale, "auth.forbidden", 403);
    }

    await db.discussionReply.create({
      data: {
        discussionId: id,
        userId: session.user.id,
        body: parsed.data.body,
        isAdminAnswer: isAdmin(session.user)
      }
    });

    if (isAdmin(session.user)) {
      await db.discussion.update({ where: { id }, data: { status: "ANSWERED" } });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Discussion reply failed", error);
    return apiError(locale, "forms.errors.generic", 500);
  }
}
