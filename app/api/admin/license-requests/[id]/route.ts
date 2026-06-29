import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { apiError } from "@/lib/api";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/permissions";
import { adminLicenseUpdateSchema } from "@/lib/validators";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  let locale = "hy";

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = adminLicenseUpdateSchema.safeParse(body);
    locale = parsed.success ? parsed.data.locale : body?.locale || locale;

    if (!parsed.success) {
      return apiError(locale, "forms.errors.invalidPayload", 400);
    }

    const session = await getSession();
    if (!isAdmin(session?.user)) {
      return apiError(locale, "auth.forbidden", 403);
    }

    await db.licenseRequest.update({
      where: { id },
      data: {
        status: parsed.data.status,
        adminNotes: parsed.data.adminNotes
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin license update failed", error);
    return apiError(locale, "forms.errors.generic", 500);
  }
}
