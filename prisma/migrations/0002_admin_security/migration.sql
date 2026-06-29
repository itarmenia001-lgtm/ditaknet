ALTER TABLE "User" ADD COLUMN "accountStatus" TEXT NOT NULL DEFAULT 'PENDING';
ALTER TABLE "User" ADD COLUMN "subscriptionStatus" TEXT NOT NULL DEFAULT 'NONE';
ALTER TABLE "User" ADD COLUMN "purchaseStatus" TEXT NOT NULL DEFAULT 'NOT_PURCHASED';
ALTER TABLE "User" ADD COLUMN "approvedAt" DATETIME;
ALTER TABLE "User" ADD COLUMN "subscriptionExpiresAt" DATETIME;
ALTER TABLE "User" ADD COLUMN "lastLoginAt" DATETIME;
ALTER TABLE "User" ADD COLUMN "lastLoginIp" TEXT;

CREATE TABLE IF NOT EXISTS "UserSession" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "ipAddress" TEXT,
  "country" TEXT,
  "city" TEXT,
  "userAgent" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" DATETIME,
  CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "UserSession_sessionId_key" ON "UserSession"("sessionId");
CREATE INDEX IF NOT EXISTS "UserSession_userId_idx" ON "UserSession"("userId");
CREATE INDEX IF NOT EXISTS "UserSession_lastSeenAt_idx" ON "UserSession"("lastSeenAt");
