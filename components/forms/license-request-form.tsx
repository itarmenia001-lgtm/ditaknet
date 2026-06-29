"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FormError, inputClassName } from "@/components/ui/form";
import { typedZodResolver } from "@/lib/form-resolver";
import { Locale, Messages, createTranslator } from "@/lib/i18n-core";
import { LicenseRequestInput, currentPackageValues, licenseRequestSchema } from "@/lib/validators";

export function LicenseRequestForm({
  locale,
  messages,
  defaults
}: {
  locale: Locale;
  messages: Messages;
  defaults?: Partial<LicenseRequestInput>;
}) {
  const router = useRouter();
  const t = createTranslator(messages);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LicenseRequestInput>({
    resolver: typedZodResolver<LicenseRequestInput>(licenseRequestSchema),
    defaultValues: {
      currentPackage: "FREE",
      requestedPackage: "MEDIUM",
      locale,
      ...defaults
    }
  });

  async function onSubmit(values: LicenseRequestInput) {
    setServerError("");
    const response = await fetch("/api/license/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const data = (await response.json()) as { message?: string; redirect?: string };

    if (!response.ok) {
      setServerError(data.message || t("forms.errors.generic"));
      return;
    }

    router.push(data.redirect || `/${locale}/account/licenses`);
    router.refresh();
  }

  const error = (name: keyof LicenseRequestInput) => (errors[name] ? t("forms.errors.invalidField") : undefined);

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormError>{serverError}</FormError>
      <input type="hidden" {...register("locale")} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t("forms.fields.installationId")} error={error("installationId")}>
          <input className={inputClassName} {...register("installationId")} />
        </Field>
        <Field label={t("forms.fields.ownerName")} error={error("ownerName")}>
          <input className={inputClassName} {...register("ownerName")} />
        </Field>
        <Field label={t("forms.fields.currentPackage")} error={error("currentPackage")}>
          <select className={inputClassName} {...register("currentPackage")}>
            {currentPackageValues.map((value) => (
              <option key={value} value={value}>
                {t(`forms.packages.${value}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("forms.fields.requestedPackage")} error={error("requestedPackage")}>
          <select className={inputClassName} {...register("requestedPackage")}>
            <option value="MEDIUM">{t("forms.packages.MEDIUM")}</option>
            <option value="PROFESSIONAL">{t("forms.packages.PROFESSIONAL")}</option>
          </select>
        </Field>
        <Field label={t("forms.fields.email")} error={error("email")}>
          <input className={inputClassName} type="email" {...register("email")} />
        </Field>
        <Field label={t("forms.fields.phone")} error={error("phone")}>
          <input className={inputClassName} {...register("phone")} />
        </Field>
        <Field label={t("forms.fields.telegram")} error={error("telegram")}>
          <input className={inputClassName} {...register("telegram")} />
        </Field>
        <Field label={t("forms.fields.companyName")} error={error("companyName")}>
          <input className={inputClassName} {...register("companyName")} />
        </Field>
        <Field label={t("forms.fields.currentDevices")} error={error("currentDevices")}>
          <input className={inputClassName} type="number" min={0} {...register("currentDevices", { valueAsNumber: true })} />
        </Field>
        <Field label={t("forms.fields.currentNetworks")} error={error("currentNetworks")}>
          <input className={inputClassName} type="number" min={0} {...register("currentNetworks", { valueAsNumber: true })} />
        </Field>
      </div>
      <Field label={t("forms.fields.reason")} error={error("reason")}>
        <textarea className={inputClassName} rows={6} {...register("reason")} />
      </Field>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("forms.actions.saving") : t("license.submit")}
      </Button>
    </form>
  );
}
