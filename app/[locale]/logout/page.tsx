import { redirect } from "next/navigation";

import { destroySession } from "@/lib/auth";
import { normalizeLocale } from "@/lib/i18n-core";

export const dynamic = "force-dynamic";

export default async function LogoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await destroySession();
  redirect(`/${normalizeLocale(locale)}`);
}
