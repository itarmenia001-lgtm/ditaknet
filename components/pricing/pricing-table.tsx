import { CheckCircle2 } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Messages, createTranslator } from "@/lib/i18n-core";
import { cn } from "@/lib/utils";

const plans = ["free", "medium", "professional"] as const;

export function PricingTable({ locale, messages, compact = false }: { locale: string; messages: Messages; compact?: boolean }) {
  const t = createTranslator(messages);

  return (
    <div className={cn("grid gap-5", compact ? "md:grid-cols-3" : "lg:grid-cols-3")}>
      {plans.map((plan) => (
        <Card key={plan} className={cn("flex flex-col p-5", plan === "medium" && "border-[var(--accent)] shadow-[var(--shadow)]")}>
          <div className="mb-4">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--accent)]">{t(`pricing.plans.${plan}.label`)}</p>
            <h3 className="mt-1 text-2xl font-bold">{t(`pricing.plans.${plan}.name`)}</h3>
            <p className="mt-2 min-h-12 text-sm leading-6 text-[var(--muted)]">{t(`pricing.plans.${plan}.description`)}</p>
          </div>
          <ul className="flex-1 space-y-3">
            {[0, 1, 2, 3, 4, 5, 6].map((index) => (
              <li key={index} className="flex gap-2 text-sm leading-6">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--accent)]" />
                <span>{t(`pricing.plans.${plan}.features.${index}`)}</span>
              </li>
            ))}
          </ul>
          <ButtonLink
            href={plan === "free" ? `/${locale}/register` : `/${locale}/license/request`}
            variant={plan === "medium" ? "secondary" : "outline"}
            className="mt-5 w-full"
          >
            {t(`pricing.plans.${plan}.cta`)}
          </ButtonLink>
        </Card>
      ))}
    </div>
  );
}
