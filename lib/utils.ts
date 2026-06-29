import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(value: Date | string | null | undefined, locale = "hy-AM") {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function minutesAgoDate(minutes: number) {
  return new Date(Date.now() - minutes * 60 * 1000);
}

export function compactNumber(value: number | null | undefined) {
  if (typeof value !== "number") {
    return "-";
  }

  return new Intl.NumberFormat().format(value);
}
