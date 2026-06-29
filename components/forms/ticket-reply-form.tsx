"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FormError, inputClassName } from "@/components/ui/form";
import { typedZodResolver } from "@/lib/form-resolver";
import { Locale, Messages, createTranslator } from "@/lib/i18n-core";
import { TicketReplyInput, ticketReplySchema } from "@/lib/validators";

export function TicketReplyForm({ locale, messages, ticketId }: { locale: Locale; messages: Messages; ticketId: string }) {
  const router = useRouter();
  const t = createTranslator(messages);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TicketReplyInput>({
    resolver: typedZodResolver<TicketReplyInput>(ticketReplySchema),
    defaultValues: { locale }
  });

  async function onSubmit(values: TicketReplyInput) {
    setServerError("");
    const response = await fetch(`/api/tickets/${ticketId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      setServerError(data.message || t("forms.errors.generic"));
      return;
    }

    reset({ locale, message: "" });
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormError>{serverError}</FormError>
      <input type="hidden" {...register("locale")} />
      <Field label={t("support.reply")} error={errors.message ? t("forms.errors.invalidField") : undefined}>
        <textarea className={inputClassName} rows={4} {...register("message")} />
      </Field>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("forms.actions.saving") : t("support.sendReply")}
      </Button>
    </form>
  );
}
