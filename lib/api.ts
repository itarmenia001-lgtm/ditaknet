import { NextResponse } from "next/server";

import { createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { getDictionary } from "@/lib/i18n";

export async function localizedMessage(locale: string | undefined, key: string) {
  const messages = await getDictionary(locale);
  return createTranslator(messages)(key);
}

export async function apiError(locale: string | undefined, key: string, status = 400) {
  return NextResponse.json({ message: await localizedMessage(normalizeLocale(locale), key) }, { status });
}
