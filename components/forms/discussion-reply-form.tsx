"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FormError, inputClassName } from "@/components/ui/form";
import { typedZodResolver } from "@/lib/form-resolver";
import { Locale, Messages, createTranslator } from "@/lib/i18n-core";
import { discussionReplySchema } from "@/lib/validators";

type DiscussionReplyInput = {
  body: string;
  locale: Locale;
};

export function DiscussionReplyForm({
  locale,
  messages,
  discussionId
}: {
  locale: Locale;
  messages: Messages;
  discussionId: string;
}) {
  const router = useRouter();
  const t = createTranslator(messages);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<DiscussionReplyInput>({
    resolver: typedZodResolver<DiscussionReplyInput>(discussionReplySchema),
    defaultValues: { locale, body: "" }
  });

  async function onSubmit(values: DiscussionReplyInput) {
    setServerError("");
    const response = await fetch(`/api/discussions/${discussionId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      setServerError(data.message || t("forms.errors.generic"));
      return;
    }

    reset({ locale, body: "" });
    router.refresh();
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
      <FormError>{serverError}</FormError>
      <input type="hidden" {...register("locale")} />
      <Field label={t("support.reply")} error={errors.body ? t("forms.errors.invalidField") : undefined}>
        <textarea className={inputClassName} rows={3} {...register("body")} />
      </Field>
      <Button type="submit" size="sm" disabled={isSubmitting}>
        {isSubmitting ? t("forms.actions.saving") : t("support.sendReply")}
      </Button>
    </form>
  );
}
