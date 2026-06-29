import "server-only";

import { Locale, Messages, normalizeLocale } from "@/lib/i18n-core";

const dictionaries: Record<Locale, () => Promise<Messages>> = {
  hy: () => import("@/messages/hy.json").then((module) => module.default),
  en: () => import("@/messages/en.json").then((module) => module.default),
  ru: () => import("@/messages/ru.json").then((module) => module.default)
};

export async function getDictionary(locale: string | undefined) {
  return dictionaries[normalizeLocale(locale)]();
}
