"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Locale, localeNames, locales } from "@/lib/i18n-core";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center rounded-md border border-[var(--line)] bg-white p-1">
      {locales.map((locale) => {
        const segments = pathname.split("/");
        if (segments[1]) {
          segments[1] = locale;
        }
        const href = segments.join("/") || `/${locale}`;

        return (
          <Link
            key={locale}
            href={href}
            className={cn(
              "rounded px-2 py-1 text-xs font-bold transition",
              currentLocale === locale ? "bg-[var(--brand)] text-white" : "text-[var(--muted)] hover:bg-[#edf7f4]"
            )}
          >
            {localeNames[locale]}
          </Link>
        );
      })}
    </div>
  );
}
