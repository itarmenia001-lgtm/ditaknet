import { describe, expect, it } from "vitest";

import { contactSchema, licenseRequestSchema, registerSchema, ticketSchema } from "@/lib/validators";

describe("form validators", () => {
  it("accepts a valid registration payload", () => {
    const result = registerSchema.safeParse({
      fullName: "Local Admin",
      email: "admin@example.com",
      password: "strong-password",
      preferredLanguage: "hy",
      interestedPackage: "FREE",
      useCase: "BUSINESS_NETWORK",
      locale: "hy"
    });

    expect(result.success).toBe(true);
  });

  it("rejects short passwords", () => {
    const result = registerSchema.safeParse({
      fullName: "Local Admin",
      email: "admin@example.com",
      password: "short",
      preferredLanguage: "hy",
      interestedPackage: "FREE",
      useCase: "BUSINESS_NETWORK",
      locale: "hy"
    });

    expect(result.success).toBe(false);
  });

  it("validates contact, license, and ticket forms", () => {
    expect(
      contactSchema.safeParse({
        name: "Support User",
        email: "user@example.com",
        topic: "SUPPORT",
        message: "Please help with installation.",
        locale: "en"
      }).success
    ).toBe(true);

    expect(
      licenseRequestSchema.safeParse({
        installationId: "LW-123456",
        currentPackage: "FREE",
        requestedPackage: "MEDIUM",
        ownerName: "Support User",
        email: "user@example.com",
        reason: "Need to monitor more devices.",
        locale: "en"
      }).success
    ).toBe(true);

    expect(
      ticketSchema.safeParse({
        title: "Docker install issue",
        category: "DOCKER",
        priority: "NORMAL",
        message: "The container starts but discovery is not running.",
        locale: "en"
      }).success
    ).toBe(true);
  });
});
