"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FormError, inputClassName } from "@/components/ui/form";
import { typedZodResolver } from "@/lib/form-resolver";
import { Locale, Messages, createTranslator } from "@/lib/i18n-core";
import { RegisterInput, packageValues, registerSchema, useCaseValues } from "@/lib/validators";

export function RegisterForm({ locale, messages }: { locale: Locale; messages: Messages }) {
  const router = useRouter();
  const t = createTranslator(messages);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterInput>({
    resolver: typedZodResolver<RegisterInput>(registerSchema),
    defaultValues: {
      preferredLanguage: locale,
      interestedPackage: "FREE",
      useCase: "BUSINESS_NETWORK",
      locale
    }
  });

  async function onSubmit(values: RegisterInput) {
    setServerError("");
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const data = (await response.json()) as { message?: string; redirect?: string };

    if (!response.ok) {
      setServerError(data.message || t("forms.errors.generic"));
      return;
    }

    router.push(data.redirect || `/${locale}/account`);
    router.refresh();
  }

  const error = (name: keyof RegisterInput) => (errors[name] ? t("forms.errors.invalidField") : undefined);

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormError>{serverError}</FormError>
      <input type="hidden" {...register("locale")} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t("forms.fields.fullName")} error={error("fullName")}>
          <input className={inputClassName} autoComplete="name" {...register("fullName")} />
        </Field>
        <Field label={t("forms.fields.email")} error={error("email")}>
          <input className={inputClassName} type="email" autoComplete="email" {...register("email")} />
        </Field>
      </div>
      <Field label={t("forms.fields.password")} error={error("password")} hint={t("forms.hints.password")}>
        <input className={inputClassName} type="password" autoComplete="new-password" {...register("password")} />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t("forms.fields.companyName")} error={error("companyName")}>
          <input className={inputClassName} {...register("companyName")} />
        </Field>
        <Field label={t("forms.fields.phone")} error={error("phone")}>
          <input className={inputClassName} autoComplete="tel" {...register("phone")} />
        </Field>
        <Field label={t("forms.fields.telegram")} error={error("telegram")}>
          <input className={inputClassName} {...register("telegram")} />
        </Field>
        <Field label={t("forms.fields.country")} error={error("country")}>
          <input className={inputClassName} autoComplete="country-name" {...register("country")} />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label={t("forms.fields.preferredLanguage")} error={error("preferredLanguage")}>
          <select className={inputClassName} {...register("preferredLanguage")}>
            <option value="hy">{t("language.hy")}</option>
            <option value="en">{t("language.en")}</option>
            <option value="ru">{t("language.ru")}</option>
          </select>
        </Field>
        <Field label={t("forms.fields.interestedPackage")} error={error("interestedPackage")}>
          <select className={inputClassName} {...register("interestedPackage")}>
            {packageValues.map((value) => (
              <option key={value} value={value}>
                {t(`forms.packages.${value}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("forms.fields.useCase")} error={error("useCase")}>
          <select className={inputClassName} {...register("useCase")}>
            {useCaseValues.map((value) => (
              <option key={value} value={value}>
                {t(`forms.useCases.${value}`)}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("forms.actions.saving") : t("auth.registerCta")}
      </Button>
    </form>
  );
}
