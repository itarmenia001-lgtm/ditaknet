import Link from "next/link";
import { LogIn, LogOut, Menu, UserPlus } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { ButtonLink } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { Locale, Messages, createTranslator } from "@/lib/i18n-core";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

const publicNav = ["features", "pricing", "docs", "support", "about"] as const;

export async function SiteHeader({ locale, messages }: { locale: Locale; messages: Messages }) {
  const t = createTranslator(messages);
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <BrandLogo brandName={t("common.brandName")} href={`/${locale}`} size="sm" />

        <nav className="hidden items-center gap-1 lg:flex">
          {publicNav.map((item) => (
            <Link key={item} href={`/${locale}/${item}`} className="rounded-md px-3 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-[#eef6f8] hover:text-[var(--foreground)]">
              {t(`nav.${item}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher currentLocale={locale} />
          {session ? (
            <>
              {session.user.role === "ADMIN" ? (
                <ButtonLink href={`/${locale}/admin`} variant="ghost" size="sm" className="hidden md:inline-flex">
                  {t("nav.admin")}
                </ButtonLink>
              ) : null}
              <ButtonLink href={`/${locale}/account`} variant="outline" size="sm" className="hidden md:inline-flex">
                {t("nav.account")}
              </ButtonLink>
              <ButtonLink href={`/${locale}/logout`} variant="ghost" size="sm" aria-label={t("nav.logout")}>
                <LogOut className="h-4 w-4" />
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink href={`/${locale}/login`} variant="ghost" size="sm" className="hidden md:inline-flex">
                <LogIn className="h-4 w-4" />
                {t("nav.login")}
              </ButtonLink>
              <ButtonLink href={`/${locale}/register`} variant="secondary" size="sm" className="hidden md:inline-flex">
                <UserPlus className="h-4 w-4" />
                {t("nav.register")}
              </ButtonLink>
            </>
          )}
          <ButtonLink href={`/${locale}/support`} variant="ghost" size="sm" className="lg:hidden" aria-label={t("nav.menu")}>
            <Menu className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
