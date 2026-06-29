import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { apiError } from "@/lib/api";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/permissions";
import { adminTicketUpdateSchema } from "@/lib/validators";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  let locale = "hy";

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = adminTicketUpdateSchema.safeParse(body);
    locale = parsed.success ? parsed.data.locale : body?.locale || locale;

    if (!parsed.success) {
      return apiError(locale, "forms.errors.invalidPayload", 400);
    }

    const session = await getSession();
    if (!isAdmin(session?.user)) {
      return apiError(locale, "auth.forbidden", 403);
    }

    await db.supportTicket.update({
      where: { id },
      data: {
        status: parsed.data.status,
        priority: parsed.data.priority
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin ticket update failed", error);
    return apiError(locale, "forms.errors.generic", 500);
  }
}
