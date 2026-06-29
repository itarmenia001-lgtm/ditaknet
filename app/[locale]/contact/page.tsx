import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n";
import { Locale, createTranslator, normalizeLocale } from "@/lib/i18n-core";
import { localizedPageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return localizedPageMetadata(params, {
    path: "/contact",
    titleKey: "contact.title",
    descriptionKey: "contact.description",
    fallbackTitle: "Contact DitakNet",
    fallbackDescription: "Contact DitakNet for support, licensing, installation help, or partnership questions."
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale) as Locale;
  const messages = await getDictionary(locale);
  const t = createTranslator(messages);

  return (
    <main className="container-page py-12">
      <SectionHeading title={t("contact.title")} description={t("contact.description")} />
      <Card className="max-w-4xl p-6">
        <ContactForm locale={locale} messages={messages} />
      </Card>
    </main>
  );
}
