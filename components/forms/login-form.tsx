"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FormError, inputClassName } from "@/components/ui/form";
import { typedZodResolver } from "@/lib/form-resolver";
import { Locale, Messages, createTranslator } from "@/lib/i18n-core";
import { LoginInput, loginSchema } from "@/lib/validators";

export function LoginForm({ locale, messages }: { locale: Locale; messages: Messages }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = createTranslator(messages);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({
    resolver: typedZodResolver<LoginInput>(loginSchema),
    defaultValues: { locale }
  });

  async function onSubmit(values: LoginInput) {
    setServerError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const data = (await response.json()) as { message?: string; redirect?: string };

    if (!response.ok) {
      setServerError(data.message || t("forms.errors.generic"));
      return;
    }

    router.push(searchParams.get("next") || data.redirect || `/${locale}/account`);
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormError>{serverError}</FormError>
      <input type="hidden" {...register("locale")} />
      <Field label={t("forms.fields.email")} error={errors.email ? t("forms.errors.invalidField") : undefined}>
        <input className={inputClassName} type="email" autoComplete="email" {...register("email")} />
      </Field>
      <Field label={t("forms.fields.password")} error={errors.password ? t("forms.errors.invalidField") : undefined}>
        <input className={inputClassName} type="password" autoComplete="current-password" {...register("password")} />
      </Field>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("forms.actions.saving") : t("auth.loginCta")}
      </Button>
    </form>
  );
}
