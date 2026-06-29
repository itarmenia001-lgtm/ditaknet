"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FormError, inputClassName } from "@/components/ui/form";
import { typedZodResolver } from "@/lib/form-resolver";
import { Locale, Messages, createTranslator } from "@/lib/i18n-core";
import { DiscussionInput, discussionSchema } from "@/lib/validators";

export function DiscussionForm({ locale, messages }: { locale: Locale; messages: Messages }) {
  const router = useRouter();
  const t = createTranslator(messages);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<DiscussionInput>({
    resolver: typedZodResolver<DiscussionInput>(discussionSchema),
    defaultValues: { isPublic: true, locale }
  });

  async function onSubmit(values: DiscussionInput) {
    setServerError("");
    const response = await fetch("/api/discussions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const data = (await response.json()) as { message?: string; redirect?: string };

    if (!response.ok) {
      setServerError(data.message || t("forms.errors.generic"));
      return;
    }

    router.push(data.redirect || `/${locale}/discussions`);
    router.refresh();
  }

  const error = (name: keyof DiscussionInput) => (errors[name] ? t("forms.errors.invalidField") : undefined);

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormError>{serverError}</FormError>
      <input type="hidden" {...register("locale")} />
      <Field label={t("forms.fields.title")} error={error("title")}>
        <input className={inputClassName} {...register("title")} />
      </Field>
      <Field label={t("forms.fields.category")} error={error("category")}>
        <input className={inputClassName} {...register("category")} />
      </Field>
      <Field label={t("forms.fields.body")} error={error("body")}>
        <textarea className={inputClassName} rows={6} {...register("body")} />
      </Field>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" className="h-4 w-4" {...register("isPublic")} />
        {t("forms.fields.isPublic")}
      </label>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("forms.actions.saving") : t("community.ask")}
      </Button>
    </form>
  );
}
