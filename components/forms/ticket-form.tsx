"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FormError, inputClassName } from "@/components/ui/form";
import { typedZodResolver } from "@/lib/form-resolver";
import { Locale, Messages, createTranslator } from "@/lib/i18n-core";
import { TicketInput, ticketCategoryValues, ticketPriorityValues, ticketSchema } from "@/lib/validators";

export function TicketForm({ locale, messages }: { locale: Locale; messages: Messages }) {
  const router = useRouter();
  const t = createTranslator(messages);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<TicketInput>({
    resolver: typedZodResolver<TicketInput>(ticketSchema),
    defaultValues: { category: "INSTALLATION", priority: "NORMAL", locale }
  });

  async function onSubmit(values: TicketInput) {
    setServerError("");
    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const data = (await response.json()) as { message?: string; redirect?: string };

    if (!response.ok) {
      setServerError(data.message || t("forms.errors.generic"));
      return;
    }

    router.push(data.redirect || `/${locale}/support/tickets`);
    router.refresh();
  }

  const error = (name: keyof TicketInput) => (errors[name] ? t("forms.errors.invalidField") : undefined);

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormError>{serverError}</FormError>
      <input type="hidden" {...register("locale")} />
      <Field label={t("forms.fields.title")} error={error("title")}>
        <input className={inputClassName} {...register("title")} />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t("forms.fields.category")} error={error("category")}>
          <select className={inputClassName} {...register("category")}>
            {ticketCategoryValues.map((value) => (
              <option key={value} value={value}>
                {t(`forms.ticketCategories.${value}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("forms.fields.priority")} error={error("priority")}>
          <select className={inputClassName} {...register("priority")}>
            {ticketPriorityValues.map((value) => (
              <option key={value} value={value}>
                {t(`forms.priorities.${value}`)}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label={t("forms.fields.message")} error={error("message")}>
        <textarea className={inputClassName} rows={7} {...register("message")} />
      </Field>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("forms.actions.saving") : t("support.createTicket")}
      </Button>
    </form>
  );
}
