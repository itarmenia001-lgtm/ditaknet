export const locales = ["hy", "en", "ru"] as const;
export type Locale = (typeof locales)[number];

export type Messages = Record<string, unknown>;

export const localeNames: Record<Locale, string> = {
  hy: "Հայ",
  en: "EN",
  ru: "RU"
};

export const defaultLocale: Locale =
  process.env.NEXT_PUBLIC_DEFAULT_LOCALE === "en" ||
  process.env.NEXT_PUBLIC_DEFAULT_LOCALE === "ru"
    ? process.env.NEXT_PUBLIC_DEFAULT_LOCALE
    : "hy";

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function normalizeLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function getNestedMessage(messages: Messages, key: string): unknown {
  return key.split(".").reduce<unknown>((current, part) => {
    if (current && typeof current === "object" && part in current) {
      return (current as Record<string, unknown>)[part];
    }

    return undefined;
  }, messages);
}

export function createTranslator(messages: Messages) {
  return (key: string, values?: Record<string, string | number>) => {
    const value = getNestedMessage(messages, key);
    let text = typeof value === "string" ? value : key;

    if (values) {
      for (const [name, replacement] of Object.entries(values)) {
        text = text.replaceAll(`{${name}}`, String(replacement));
      }
    }

    return text;
  };
}

export function getMessageList(messages: Messages, key: string): string[] {
  const value = getNestedMessage(messages, key);
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
