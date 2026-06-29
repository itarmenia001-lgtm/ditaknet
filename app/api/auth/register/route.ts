import { NextResponse } from "next/server";

import { createSession, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendRegistrationEmail } from "@/lib/email";
import { apiError } from "@/lib/api";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  let locale = "hy";

  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    locale = parsed.success ? parsed.data.locale : body?.locale || locale;

    if (!parsed.success) {
      return apiError(locale, "forms.errors.invalidPayload", 400);
    }

    const existingUser = await db.user.findUnique({ where: { email: parsed.data.email } });
    if (existingUser) {
      return apiError(locale, "auth.emailExists", 409);
    }

    const user = await db.user.create({
      data: {
        name: parsed.data.fullName,
        email: parsed.data.email,
        passwordHash: await hashPassword(parsed.data.password),
        companyName: parsed.data.companyName,
        phone: parsed.data.phone,
        telegram: parsed.data.telegram,
        country: parsed.data.country,
        preferredLanguage: parsed.data.preferredLanguage,
        interestedPackage: parsed.data.interestedPackage,
        useCase: parsed.data.useCase
      }
    });

    await createSession(user);
    await sendRegistrationEmail(user.email, user.name);

    return NextResponse.json({ ok: true, redirect: `/${parsed.data.locale}/account` });
  } catch (error) {
    console.error("Registration failed", error);
    return apiError(locale, "forms.errors.generic", 500);
  }
}
