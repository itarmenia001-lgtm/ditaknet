import fs from "node:fs";
import path from "node:path";

process.env.DATABASE_URL ||= "file:./dev.db";

async function main() {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  const migrationPath = path.join(process.cwd(), "prisma", "migrations", "0001_init", "migration.sql");
  const sql = fs.readFileSync(migrationPath, "utf8");

  const statements = sql
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);

  try {
    for (const statement of statements) {
      await prisma.$executeRawUnsafe(statement);
    }

    console.info(`SQLite dev schema initialized with ${statements.length} statements.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
