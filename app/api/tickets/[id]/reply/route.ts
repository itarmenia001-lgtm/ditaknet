import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { apiError } from "@/lib/api";
import { db } from "@/lib/db";
import { canAccessOwnedResource, isAdmin } from "@/lib/permissions";
import { ticketReplySchema } from "@/lib/validators";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  let locale = "hy";

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = ticketReplySchema.safeParse(body);
    locale = parsed.success ? parsed.data.locale : body?.locale || locale;

    if (!parsed.success) {
      return apiError(locale, "forms.errors.invalidPayload", 400);
    }

    const session = await getSession();
    if (!session) {
      return apiError(locale, "auth.loginRequired", 401);
    }

    const ticket = await db.supportTicket.findUnique({ where: { id } });
    if (!ticket || !canAccessOwnedResource(session.user, ticket.userId)) {
      return apiError(locale, "auth.forbidden", 403);
    }

    await db.supportMessage.create({
      data: {
        ticketId: id,
        userId: isAdmin(session.user) ? undefined : session.user.id,
        adminId: isAdmin(session.user) ? session.user.id : undefined,
        message: parsed.data.message
      }
    });

    if (isAdmin(session.user) && ticket.status === "OPEN") {
      await db.supportTicket.update({ where: { id }, data: { status: "ANSWERED" } });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Ticket reply failed", error);
    return apiError(locale, "forms.errors.generic", 500);
  }
}
