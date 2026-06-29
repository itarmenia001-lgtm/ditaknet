import { NextResponse } from "next/server";

import { apiError } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/permissions";
import { adminUserUpdateSchema } from "@/lib/validators";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  let locale = "hy";

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = adminUserUpdateSchema.safeParse(body);
    locale = parsed.success ? parsed.data.locale : body?.locale || locale;

    if (!parsed.success) {
      return apiError(locale, "forms.errors.invalidPayload", 400);
    }

    const session = await getSession();
    if (!isAdmin(session?.user)) {
      return apiError(locale, "auth.forbidden", 403);
    }

    const existingUser = await db.user.findUnique({
      where: { id },
      select: { id: true, accountStatus: true, approvedAt: true }
    });

    if (!existingUser) {
      return apiError(locale, "forms.errors.invalidPayload", 404);
    }

    await db.user.update({
      where: { id },
      data: {
        role: parsed.data.role,
        accountStatus: parsed.data.accountStatus,
        subscriptionStatus: parsed.data.subscriptionStatus,
        purchaseStatus: parsed.data.purchaseStatus,
        interestedPackage: parsed.data.interestedPackage,
        subscriptionExpiresAt: parsed.data.subscriptionExpiresAt || null,
        approvedAt:
          parsed.data.accountStatus === "APPROVED" && !existingUser.approvedAt
            ? new Date()
            : existingUser.approvedAt
      }
    });

    if (parsed.data.accountStatus === "SUSPENDED") {
      await db.userSession.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() }
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin user update failed", error);
    return apiError(locale, "forms.errors.generic", 500);
  }
}
