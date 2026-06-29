import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      companyName: true,
      preferredLanguage: true,
      interestedPackage: true,
      createdAt: true
    }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">{t("admin.nav.users")}</h1>
      <div className="mt-6 grid gap-4">
        {users.length ? (
          users.map((user) => (
            <Card key={user.id} className="p-5">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{user.email}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{user.companyName || "-"} · {user.preferredLanguage}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={user.role === "ADMIN" ? "blue" : "gray"}>{user.role}</Badge>
                  <Badge tone="green">{user.interestedPackage || "FREE"}</Badge>
                  <Badge>{formatDate(user.createdAt, locale)}</Badge>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-5 text-sm text-[var(--muted)]">{t("common.empty")}</Card>
        )}
      </div>
    </div>
  );
}
