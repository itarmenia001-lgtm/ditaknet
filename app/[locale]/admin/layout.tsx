import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { getSession } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { Locale, normalizeLocale } from "@/lib/i18n-core";
import { isAdmin } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/login?next=/${locale}/admin`);
  }

  if (!isAdmin(session.user)) {
    redirect(`/${locale}/account`);
  }

  const messages = await getDictionary(locale);
  return <AdminShell locale={locale} messages={messages}>{children}</AdminShell>;
}
