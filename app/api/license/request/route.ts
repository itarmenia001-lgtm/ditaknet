import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { apiError } from "@/lib/api";
import { db } from "@/lib/db";
import { sendLicenseRequestNotification } from "@/lib/email";
import { licenseRequestSchema } from "@/lib/validators";

export async function POST(request: Request) {
  let locale = "hy";

  try {
    const body = await request.json();
    const parsed = licenseRequestSchema.safeParse(body);
    locale = parsed.success ? parsed.data.locale : body?.locale || locale;

    if (!parsed.success) {
      return apiError(locale, "forms.errors.invalidPayload", 400);
    }

    const session = await getSession();
    const licenseRequest = await db.licenseRequest.create({
      data: {
        userId: session?.user.id,
        installationId: parsed.data.installationId,
        currentPackage: parsed.data.currentPackage,
        requestedPackage: parsed.data.requestedPackage,
        ownerName: parsed.data.ownerName,
        companyName: parsed.data.companyName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        telegram: parsed.data.telegram,
        currentDevices: parsed.data.currentDevices,
        currentNetworks: parsed.data.currentNetworks,
        reason: parsed.data.reason
      }
    });

    if (session?.user.id) {
      await db.user.update({
        where: { id: session.user.id },
        data: {
          purchaseStatus: "REQUESTED",
          interestedPackage: parsed.data.requestedPackage
        }
      });
    }

    await sendLicenseRequestNotification(parsed.data.email, parsed.data.installationId);

    return NextResponse.json({
      ok: true,
      id: licenseRequest.id,
      redirect: session ? `/${parsed.data.locale}/account/licenses` : `/${parsed.data.locale}/license/activate-info?request=${licenseRequest.id}`
    });
  } catch (error) {
    console.error("License request failed", error);
    return apiError(locale, "forms.errors.generic", 500);
  }
}
