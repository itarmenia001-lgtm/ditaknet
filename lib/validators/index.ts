import { z } from "zod";

import { defaultLocale, locales } from "@/lib/i18n-core";

const optionalText = (max = 180) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value;
      }

      const trimmed = value.trim();
      return trimmed.length ? trimmed : undefined;
    },
    z.string().max(max).optional()
  );

const requiredText = (min = 2, max = 240) =>
  z.string().trim().min(min).max(max).transform((value) => value.replace(/[\u0000-\u001F\u007F]/g, ""));

const optionalInt = z.preprocess(
  (value) => {
    if (value === "" || value === null || Number.isNaN(value)) {
      return undefined;
    }

    return value;
  },
  z.coerce.number().int().nonnegative().max(1000000).optional()
);

export const packageValues = ["FREE", "MEDIUM", "PROFESSIONAL"] as const;
export const currentPackageValues = ["FREE", "MEDIUM", "PROFESSIONAL"] as const;
export const useCaseValues = [
  "HOME_SMALL_OFFICE",
  "CCTV_CAMERA_SYSTEM",
  "SERVERS_AND_WEBSITES",
  "BUSINESS_NETWORK",
  "PROFESSIONAL_IT_MONITORING"
] as const;
export const contactTopicValues = ["SUPPORT", "LICENSE", "INSTALLATION_HELP", "PARTNERSHIP", "OTHER"] as const;
export const ticketCategoryValues = [
  "INSTALLATION",
  "DISCOVERY",
  "LICENSE",
  "TRUENAS",
  "DOCKER",
  "TELEGRAM",
  "CAMERA_NVR",
  "SERVER_MONITORING",
  "BUG",
  "OTHER"
] as const;
export const ticketPriorityValues = ["NORMAL", "HIGH"] as const;
export const ticketStatusValues = ["OPEN", "ANSWERED", "CLOSED"] as const;
export const licenseStatusValues = ["NEW", "IN_REVIEW", "APPROVED", "REJECTED", "COMPLETED"] as const;
export const discussionStatusValues = ["OPEN", "ANSWERED", "CLOSED"] as const;
export const roleValues = ["USER", "ADMIN"] as const;
export const accountStatusValues = ["PENDING", "APPROVED", "SUSPENDED"] as const;
export const subscriptionStatusValues = ["NONE", "TRIAL", "ACTIVE", "EXPIRED", "CANCELED"] as const;
export const purchaseStatusValues = ["NOT_PURCHASED", "REQUESTED", "PURCHASED"] as const;

export const registerSchema = z.object({
  fullName: requiredText(2, 100),
  email: z.string().trim().email().max(160).toLowerCase(),
  password: z.string().min(8).max(128),
  companyName: optionalText(140),
  phone: optionalText(60),
  telegram: optionalText(80),
  country: optionalText(80),
  preferredLanguage: z.enum(locales).default(defaultLocale),
  interestedPackage: z.enum(packageValues),
  useCase: z.enum(useCaseValues),
  locale: z.enum(locales).default(defaultLocale)
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(160).toLowerCase(),
  password: z.string().min(1).max(128),
  locale: z.enum(locales).default(defaultLocale)
});

export const contactSchema = z.object({
  name: requiredText(2, 100),
  email: z.string().trim().email().max(160).toLowerCase(),
  phone: optionalText(60),
  telegram: optionalText(80),
  companyName: optionalText(140),
  topic: z.enum(contactTopicValues),
  message: requiredText(10, 3000),
  locale: z.enum(locales).default(defaultLocale)
});

export const licenseRequestSchema = z.object({
  installationId: requiredText(4, 120),
  currentPackage: z.enum(currentPackageValues),
  requestedPackage: z.enum(["MEDIUM", "PROFESSIONAL"]),
  ownerName: requiredText(2, 120),
  companyName: optionalText(140),
  email: z.string().trim().email().max(160).toLowerCase(),
  phone: optionalText(60),
  telegram: optionalText(80),
  currentDevices: optionalInt,
  currentNetworks: optionalInt,
  reason: requiredText(10, 3000),
  locale: z.enum(locales).default(defaultLocale)
});

export const ticketSchema = z.object({
  title: requiredText(4, 160),
  category: z.enum(ticketCategoryValues),
  priority: z.enum(ticketPriorityValues).default("NORMAL"),
  message: requiredText(10, 4000),
  locale: z.enum(locales).default(defaultLocale)
});

export const ticketReplySchema = z.object({
  message: requiredText(2, 4000),
  locale: z.enum(locales).default(defaultLocale)
});

export const discussionSchema = z.object({
  title: requiredText(4, 160),
  body: requiredText(10, 4000),
  category: optionalText(80),
  isPublic: z.coerce.boolean().default(true),
  locale: z.enum(locales).default(defaultLocale)
});

export const discussionReplySchema = z.object({
  body: requiredText(2, 4000),
  locale: z.enum(locales).default(defaultLocale)
});

export const adminLicenseUpdateSchema = z.object({
  status: z.enum(licenseStatusValues),
  adminNotes: optionalText(2000),
  locale: z.enum(locales).default(defaultLocale)
});

export const adminTicketUpdateSchema = z.object({
  status: z.enum(ticketStatusValues),
  priority: z.enum(ticketPriorityValues),
  locale: z.enum(locales).default(defaultLocale)
});

export const adminUserUpdateSchema = z.object({
  role: z.enum(roleValues),
  accountStatus: z.enum(accountStatusValues),
  subscriptionStatus: z.enum(subscriptionStatusValues),
  purchaseStatus: z.enum(purchaseStatusValues),
  interestedPackage: z.enum(packageValues),
  subscriptionExpiresAt: z
    .preprocess(
      (value) => {
        if (typeof value !== "string" || !value.trim()) {
          return undefined;
        }

        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? value : date;
      },
      z.date().optional()
    )
    .optional(),
  locale: z.enum(locales).default(defaultLocale)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type LicenseRequestInput = z.infer<typeof licenseRequestSchema>;
export type TicketInput = z.infer<typeof ticketSchema>;
export type TicketReplyInput = z.infer<typeof ticketReplySchema>;
export type DiscussionInput = z.infer<typeof discussionSchema>;
