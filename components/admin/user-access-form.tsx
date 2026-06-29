"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { inputClassName } from "@/components/ui/form";
import { Locale, Messages, createTranslator } from "@/lib/i18n-core";
import {
  accountStatusValues,
  packageValues,
  purchaseStatusValues,
  roleValues,
  subscriptionStatusValues
} from "@/lib/validators";

type UserAccessDefaults = {
  role: string;
  accountStatus: string;
  subscriptionStatus: string;
  purchaseStatus: string;
  interestedPackage: string | null;
  subscriptionExpiresAt: Date | null;
};

export function UserAccessForm({
  id,
  locale,
  messages,
  defaults
}: {
  id: string;
  locale: Locale;
  messages: Messages;
  defaults: UserAccessDefaults;
}) {
  const t = createTranslator(messages);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setSaving(true);
    setError(null);

    const response = await fetch(`/api/admin/users/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: formData.get("role"),
        accountStatus: formData.get("accountStatus"),
        subscriptionStatus: formData.get("subscriptionStatus"),
        purchaseStatus: formData.get("purchaseStatus"),
        interestedPackage: formData.get("interestedPackage"),
        subscriptionExpiresAt: formData.get("subscriptionExpiresAt") || undefined,
        locale
      })
    });

    setSaving(false);

    if (!response.ok) {
      setError(t("forms.errors.generic"));
      return;
    }

    router.refresh();
  }

  const expiresAt = defaults.subscriptionExpiresAt?.toISOString().slice(0, 10) || "";

  return (
    <form action={submit} className="grid gap-2">
      <label className="grid gap-1 text-xs font-semibold text-[var(--muted)]">
        {t("admin.role")}
        <select name="role" className={inputClassName} defaultValue={defaults.role}>
          {roleValues.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-semibold text-[var(--muted)]">
        {t("admin.approval")}
        <select name="accountStatus" className={inputClassName} defaultValue={defaults.accountStatus}>
          {accountStatusValues.map((status) => (
            <option key={status} value={status}>
              {t(`status.account.${status}`)}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-semibold text-[var(--muted)]">
        {t("admin.subscription")}
        <select name="subscriptionStatus" className={inputClassName} defaultValue={defaults.subscriptionStatus}>
          {subscriptionStatusValues.map((status) => (
            <option key={status} value={status}>
              {t(`status.subscription.${status}`)}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-semibold text-[var(--muted)]">
        {t("admin.purchase")}
        <select name="purchaseStatus" className={inputClassName} defaultValue={defaults.purchaseStatus}>
          {purchaseStatusValues.map((status) => (
            <option key={status} value={status}>
              {t(`status.purchase.${status}`)}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-semibold text-[var(--muted)]">
        {t("common.package")}
        <select name="interestedPackage" className={inputClassName} defaultValue={defaults.interestedPackage || "FREE"}>
          {packageValues.map((packageName) => (
            <option key={packageName} value={packageName}>
              {packageName}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-semibold text-[var(--muted)]">
        {t("admin.subscriptionExpiresAt")}
        <input name="subscriptionExpiresAt" className={inputClassName} type="date" defaultValue={expiresAt} />
      </label>
      {error ? <p className="text-xs font-semibold text-[var(--danger)]">{error}</p> : null}
      <Button type="submit" size="sm" disabled={saving}>
        {saving ? t("forms.actions.saving") : t("forms.actions.save")}
      </Button>
    </form>
  );
}
