import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "DitakNet Admin";

  if (!email || !password) {
    console.info("ADMIN_EMAIL or ADMIN_PASSWORD is empty. Skipping admin seed.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: "ADMIN",
      accountStatus: "APPROVED",
      subscriptionStatus: "ACTIVE",
      purchaseStatus: "PURCHASED",
      approvedAt: new Date()
    },
    create: {
      name,
      email,
      passwordHash,
      role: "ADMIN",
      accountStatus: "APPROVED",
      subscriptionStatus: "ACTIVE",
      purchaseStatus: "PURCHASED",
      approvedAt: new Date(),
      preferredLanguage: "hy",
      interestedPackage: "PROFESSIONAL",
      useCase: "PROFESSIONAL_IT_MONITORING"
    }
  });

  console.info(`Admin user ready: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
