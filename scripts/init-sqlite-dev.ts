import fs from "node:fs";
import path from "node:path";

process.env.DATABASE_URL ||= "file:./dev.db";

async function main() {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  const migrationsDir = path.join(process.cwd(), "prisma", "migrations");
  const migrationFiles = fs
    .readdirSync(migrationsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(migrationsDir, entry.name, "migration.sql"))
    .filter((migrationPath) => fs.existsSync(migrationPath))
    .sort();

  let appliedStatements = 0;

  try {
    for (const migrationPath of migrationFiles) {
      const sql = fs.readFileSync(migrationPath, "utf8");
      const statements = sql
        .split(/;\s*(?:\r?\n|$)/)
        .map((statement) => statement.trim())
        .filter(Boolean);

      for (const statement of statements) {
        try {
          await prisma.$executeRawUnsafe(statement);
          appliedStatements += 1;
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);

          if (message.includes("already exists") || message.includes("duplicate column name")) {
            continue;
          }

          throw error;
        }
      }
    }

    console.info(`SQLite dev schema initialized with ${appliedStatements} new statements from ${migrationFiles.length} migrations.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
