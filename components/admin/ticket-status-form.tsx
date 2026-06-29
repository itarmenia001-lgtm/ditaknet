"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { inputClassName } from "@/components/ui/form";
import { Locale, Messages, createTranslator } from "@/lib/i18n-core";
import { ticketPriorityValues, ticketStatusValues } from "@/lib/validators";

export function TicketStatusForm({
  id,
  locale,
  messages,
  currentStatus,
  currentPriority
}: {
  id: string;
  locale: Locale;
  messages: Messages;
  currentStatus: string;
  currentPriority: string;
}) {
  const t = createTranslator(messages);
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function submit(formData: FormData) {
    setSaving(true);
    await fetch(`/api/admin/tickets/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: formData.get("status"),
        priority: formData.get("priority"),
        locale
      })
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <form action={submit} className="grid gap-2">
      <select name="status" className={inputClassName} defaultValue={currentStatus}>
        {ticketStatusValues.map((status) => (
          <option key={status} value={status}>
            {t(`status.ticket.${status}`)}
          </option>
        ))}
      </select>
      <select name="priority" className={inputClassName} defaultValue={currentPriority}>
        {ticketPriorityValues.map((priority) => (
          <option key={priority} value={priority}>
            {t(`forms.priorities.${priority}`)}
          </option>
        ))}
      </select>
      <Button type="submit" size="sm" disabled={saving}>
        {saving ? t("forms.actions.saving") : t("forms.actions.save")}
      </Button>
    </form>
  );
}
