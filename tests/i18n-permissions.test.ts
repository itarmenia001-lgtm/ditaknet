import { describe, expect, it } from "vitest";

import en from "@/messages/en.json";
import hy from "@/messages/hy.json";
import ru from "@/messages/ru.json";
import { createTranslator, locales } from "@/lib/i18n-core";
import {
  canAccessAdmin,
  canAccessOwnedResource,
  canUseAuthenticatedSession
} from "@/lib/permissions";

describe("i18n", () => {
  it("has all locale files and core navigation keys", () => {
    expect(locales).toEqual(["hy", "en", "ru"]);
    for (const messages of [hy, en, ru]) {
      const t = createTranslator(messages);
      expect(t("nav.pricing")).not.toBe("nav.pricing");
      expect(t("auth.loginTitle")).not.toBe("auth.loginTitle");
      expect(t("license.title")).not.toBe("license.title");
    }
  });
});

describe("permissions", () => {
  it("blocks normal users from admin access", () => {
    expect(canAccessAdmin({ id: "1", role: "USER" })).toBe(false);
    expect(canAccessAdmin({ id: "1", role: "ADMIN" })).toBe(true);
  });

  it("allows owners and admins to access owned resources", () => {
    expect(canAccessOwnedResource({ id: "u1", role: "USER" }, "u1")).toBe(true);
    expect(canAccessOwnedResource({ id: "u2", role: "USER" }, "u1")).toBe(false);
    expect(canAccessOwnedResource({ id: "admin", role: "ADMIN" }, "u1")).toBe(true);
  });

  it("blocks suspended profiles from authenticated sessions", () => {
    expect(canUseAuthenticatedSession({ accountStatus: "APPROVED" })).toBe(true);
    expect(canUseAuthenticatedSession({ accountStatus: "PENDING" })).toBe(true);
    expect(canUseAuthenticatedSession({ accountStatus: "SUSPENDED" })).toBe(false);
  });
});
