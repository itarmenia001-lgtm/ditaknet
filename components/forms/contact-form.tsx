"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FormError, FormSuccess, inputClassName } from "@/components/ui/form";
import { typedZodResolver } from "@/lib/form-resolver";
import { Locale, Messages, createTranslator } from "@/lib/i18n-core";
import { ContactInput, contactSchema, contactTopicValues } from "@/lib/validators";

export function ContactForm({ locale, messages }: { locale: Locale; messages: Messages }) {
  const t = createTranslator(messages);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactInput>({
    resolver: typedZodResolver<ContactInput>(contactSchema),
    defaultValues: { topic: "SUPPORT", locale }
  });

  async function onSubmit(values: ContactInput) {
    setServerError("");
    setSuccess("");
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      setServerError(data.message || t("forms.errors.generic"));
      return;
    }

    setSuccess(data.message || t("contact.success"));
    reset({ topic: "SUPPORT", locale });
  }

  const error = (name: keyof ContactInput) => (errors[name] ? t("forms.errors.invalidField") : undefined);

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormError>{serverError}</FormError>
      <FormSuccess>{success}</FormSuccess>
      <input type="hidden" {...register("locale")} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t("forms.fields.name")} error={error("name")}>
          <input className={inputClassName} autoComplete="name" {...register("name")} />
        </Field>
        <Field label={t("forms.fields.email")} error={error("email")}>
          <input className={inputClassName} type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label={t("forms.fields.phone")} error={error("phone")}>
          <input className={inputClassName} autoComplete="tel" {...register("phone")} />
        </Field>
        <Field label={t("forms.fields.telegram")} error={error("telegram")}>
          <input className={inputClassName} {...register("telegram")} />
        </Field>
        <Field label={t("forms.fields.companyName")} error={error("companyName")}>
          <input className={inputClassName} {...register("companyName")} />
        </Field>
        <Field label={t("forms.fields.topic")} error={error("topic")}>
          <select className={inputClassName} {...register("topic")}>
            {contactTopicValues.map((value) => (
              <option key={value} value={value}>
                {t(`forms.contactTopics.${value}`)}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label={t("forms.fields.message")} error={error("message")}>
        <textarea className={inputClassName} rows={6} {...register("message")} />
      </Field>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("forms.actions.saving") : t("contact.submit")}
      </Button>
    </form>
  );
}
