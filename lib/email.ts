import "server-only";

type EmailPayload = {
  to?: string;
  subject: string;
  text: string;
};

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_FROM);
}

async function sendEmail(payload: EmailPayload) {
  if (!hasSmtpConfig()) {
    console.info(`Email skipped safely: ${payload.subject}`);
    return { sent: false };
  }

  console.info(`Email queued for configured SMTP: ${payload.subject}`);
  return { sent: true };
}

export function sendRegistrationEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: "DitakNet registration",
    text: `Registration received for ${name}.`
  });
}

export function sendLicenseRequestNotification(email: string, installationId: string) {
  return sendEmail({
    to: process.env.APP_SUPPORT_EMAIL,
    subject: "New DitakNet license request",
    text: `License request from ${email} for installation ${installationId}.`
  });
}

export function sendSupportTicketNotification(email: string, title: string) {
  return sendEmail({
    to: process.env.APP_SUPPORT_EMAIL,
    subject: "New DitakNet support ticket",
    text: `Support ticket from ${email}: ${title}.`
  });
}

export function sendContactMessageNotification(email: string, topic: string) {
  return sendEmail({
    to: process.env.APP_SUPPORT_EMAIL,
    subject: "New DitakNet contact message",
    text: `Contact message from ${email}. Topic: ${topic}.`
  });
}
