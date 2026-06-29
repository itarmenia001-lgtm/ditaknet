import { NextResponse } from "next/server";

import { createSession, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  let locale = "hy";

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    locale = parsed.success ? parsed.data.locale : body?.locale || locale;

    if (!parsed.success) {
      return apiError(locale, "forms.errors.invalidPayload", 400);
    }

    const user = await db.user.findUnique({ where: { email: parsed.data.email } });
    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return apiError(locale, "auth.invalidLogin", 401);
    }

    if (user.accountStatus === "SUSPENDED") {
      return apiError(locale, "auth.forbidden", 403);
    }

    await createSession(user);
    return NextResponse.json({ ok: true, redirect: `/${parsed.data.locale}/account` });
  } catch (error) {
    console.error("Login failed", error);
    return apiError(locale, "forms.errors.generic", 500);
  }
}
