import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { apiError } from "@/lib/api";
import { db } from "@/lib/db";
import { discussionSchema } from "@/lib/validators";

export async function POST(request: Request) {
  let locale = "hy";

  try {
    const body = await request.json();
    const parsed = discussionSchema.safeParse(body);
    locale = parsed.success ? parsed.data.locale : body?.locale || locale;

    if (!parsed.success) {
      return apiError(locale, "forms.errors.invalidPayload", 400);
    }

    const session = await getSession();
    if (!session) {
      return apiError(locale, "auth.loginRequired", 401);
    }

    const discussion = await db.discussion.create({
      data: {
        userId: session.user.id,
        title: parsed.data.title,
        body: parsed.data.body,
        category: parsed.data.category,
        isPublic: parsed.data.isPublic
      }
    });

    return NextResponse.json({ ok: true, redirect: `/${parsed.data.locale}/discussions#${discussion.id}` });
  } catch (error) {
    console.error("Discussion create failed", error);
    return apiError(locale, "forms.errors.generic", 500);
  }
}
