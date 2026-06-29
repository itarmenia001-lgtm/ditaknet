import Link from "next/link";
import type { ReactNode } from "react";

import { Locale, Messages, createTranslator } from "@/lib/i18n-core";

const adminNav = ["users", "license-requests", "contact-messages", "tickets", "discussions", "settings"] as const;

export function AdminShell({ locale, messages, children }: { locale: Locale; messages: Messages; children: ReactNode }) {
  const t = createTranslator(messages);

  return (
    <div className="container-page grid gap-6 py-8 lg:grid-cols-[240px_1fr]">
      <aside className="rounded-lg border border-[var(--line)] bg-white p-3">
        <p className="px-3 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[var(--muted)]">{t("admin.title")}</p>
        <nav className="mt-2 grid gap-1">
          {adminNav.map((item) => (
            <Link key={item} href={`/${locale}/admin/${item}`} className="rounded-md px-3 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[#eef6f8]">
              {t(`admin.nav.${item}`)}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
