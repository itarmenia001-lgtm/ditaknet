import "server-only";

export function getSiteConfig() {
  return {
    name: process.env.APP_NAME || "DitakNet",
    supportEmail: process.env.APP_SUPPORT_EMAIL || "support@example.com",
    supportPhone: process.env.APP_SUPPORT_PHONE || "",
    supportTelegram: process.env.APP_SUPPORT_TELEGRAM || "",
    supportUrl: process.env.APP_SUPPORT_URL || "",
    documentationUrl: process.env.APP_DOCUMENTATION_URL || ""
  };
}
