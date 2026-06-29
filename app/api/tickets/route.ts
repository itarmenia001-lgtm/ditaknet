import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { apiError } from "@/lib/api";
import { db } from "@/lib/db";
import { sendSupportTicketNotification } from "@/lib/email";
import { ticketSchema } from "@/lib/validators";

export async function POST(request: Request) {
  let locale = "hy";

  try {
    const body = await request.json();
    const parsed = ticketSchema.safeParse(body);
    locale = parsed.success ? parsed.data.locale : body?.locale || locale;

    if (!parsed.success) {
      return apiError(locale, "forms.errors.invalidPayload", 400);
    }

    const session = await getSession();
    if (!session) {
      return apiError(locale, "auth.loginRequired", 401);
    }

    const ticket = await db.supportTicket.create({
      data: {
        userId: session.user.id,
        title: parsed.data.title,
        category: parsed.data.category,
        priority: parsed.data.priority,
        messages: {
          create: {
            userId: session.user.id,
            message: parsed.data.message
          }
        }
      }
    });

    await sendSupportTicketNotification(session.user.email, parsed.data.title);

    return NextResponse.json({ ok: true, redirect: `/${parsed.data.locale}/support/tickets/${ticket.id}` });
  } catch (error) {
    console.error("Ticket create failed", error);
    return apiError(locale, "forms.errors.generic", 500);
  }
}
