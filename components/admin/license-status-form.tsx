"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { inputClassName } from "@/components/ui/form";
import { Locale, Messages, createTranslator } from "@/lib/i18n-core";
import { licenseStatusValues } from "@/lib/validators";

export function LicenseStatusForm({
  id,
  locale,
  messages,
  currentStatus,
  currentNotes
}: {
  id: string;
  locale: Locale;
  messages: Messages;
  currentStatus: string;
  currentNotes?: string | null;
}) {
  const t = createTranslator(messages);
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function submit(formData: FormData) {
    setSaving(true);
    await fetch(`/api/admin/license-requests/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: formData.get("status"),
        adminNotes: formData.get("adminNotes"),
        locale
      })
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <form action={submit} className="grid gap-2">
      <select name="status" className={inputClassName} defaultValue={currentStatus}>
        {licenseStatusValues.map((status) => (
          <option key={status} value={status}>
            {t(`status.license.${status}`)}
          </option>
        ))}
      </select>
      <textarea name="adminNotes" className={inputClassName} rows={2} defaultValue={currentNotes || ""} placeholder={t("admin.notes")} />
      <Button type="submit" size="sm" disabled={saving}>
        {saving ? t("forms.actions.saving") : t("forms.actions.save")}
      </Button>
    </form>
  );
}
