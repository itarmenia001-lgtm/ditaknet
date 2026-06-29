import { NextResponse } from "next/server";

import { apiError, localizedMessage } from "@/lib/api";
import { db } from "@/lib/db";
import { sendContactMessageNotification } from "@/lib/email";
import { contactSchema } from "@/lib/validators";

export async function POST(request: Request) {
  let locale = "hy";

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    locale = parsed.success ? parsed.data.locale : body?.locale || locale;

    if (!parsed.success) {
      return apiError(locale, "forms.errors.invalidPayload", 400);
    }

    await db.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        telegram: parsed.data.telegram,
        companyName: parsed.data.companyName,
        topic: parsed.data.topic,
        message: parsed.data.message
      }
    });

    await sendContactMessageNotification(parsed.data.email, parsed.data.topic);

    return NextResponse.json({ ok: true, message: await localizedMessage(locale, "contact.success") });
  } catch (error) {
    console.error("Contact submit failed", error);
    return apiError(locale, "forms.errors.generic", 500);
  }
}
