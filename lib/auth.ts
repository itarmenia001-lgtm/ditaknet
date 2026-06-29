import "server-only";

import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "crypto";

import { db } from "@/lib/db";
import { canUseAuthenticatedSession } from "@/lib/permissions";

export const SESSION_COOKIE = "ditaknet_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  accountStatus: string;
  subscriptionStatus: string;
  purchaseStatus: string;
  preferredLanguage: string;
  interestedPackage: string | null;
  subscriptionExpiresAt: Date | null;
};

type SessionPayload = {
  userId: string;
  sessionId?: string;
  expiresAt: number;
};

type RequestMeta = {
  ipAddress: string | null;
  country: string | null;
  city: string | null;
  userAgent: string | null;
};

function getAuthSecret() {
  const secret = process.env.NEXTAUTH_SECRET;

  // Development gets an in-memory secret so local work is easy, while production
  // must provide a persistent secret or every restart would break sessions.
  if (!secret && process.env.NODE_ENV !== "production") {
    const globalForSecret = globalThis as unknown as { ditaknetDevSecret?: string };
    globalForSecret.ditaknetDevSecret ??= randomBytes(32).toString("hex");
    return globalForSecret.ditaknetDevSecret;
  }

  if (!secret || secret.length < 16) {
    throw new Error("NEXTAUTH_SECRET must be configured with at least 16 characters.");
  }

  return secret;
}

function signPayload(payload: string) {
  return createHmac("sha256", getAuthSecret()).update(payload).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function signSession(payload: SessionPayload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload);
  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as SessionPayload;

    if (!payload.userId || payload.expiresAt < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function createSession(user: { id: string }) {
  const sessionId = randomUUID();
  const meta = await getRequestMeta();
  const token = signSession({
    userId: user.id,
    sessionId,
    expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000
  });
  const cookieStore = await cookies();

  // Store both a signed cookie and a database session row so admins can revoke
  // individual browser sessions without changing the global signing secret.
  await db.$transaction([
    db.userSession.create({
      data: {
        userId: user.id,
        sessionId,
        ipAddress: meta.ipAddress,
        country: meta.country,
        city: meta.city,
        userAgent: meta.userAgent
      }
    }),
    db.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: meta.ipAddress
      }
    })
  ]);

  cookieStore.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const payload = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  if (payload?.sessionId) {
    await db.userSession
      .updateMany({
        where: { sessionId: payload.sessionId, revokedAt: null },
        data: { revokedAt: new Date() }
      })
      .catch(() => undefined);
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<{ user: SessionUser } | null> {
  const cookieStore = await cookies();
  const payload = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  if (!payload) {
    return null;
  }

  if (payload.sessionId) {
    const meta = await getRequestMeta();
    await db.userSession
      .updateMany({
        where: { sessionId: payload.sessionId, revokedAt: null },
        data: {
          lastSeenAt: new Date(),
          ipAddress: meta.ipAddress,
          country: meta.country,
          city: meta.city,
          userAgent: meta.userAgent
        }
      })
      .catch(() => undefined);

    const activeSession = await db.userSession.findUnique({
      where: { sessionId: payload.sessionId },
      select: { revokedAt: true }
    });

    if (!activeSession || activeSession.revokedAt) {
      return null;
    }
  }

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      accountStatus: true,
      subscriptionStatus: true,
      purchaseStatus: true,
      preferredLanguage: true,
      interestedPackage: true,
      subscriptionExpiresAt: true
    }
  });

  // Suspended profiles lose access immediately, including old cookies that were
  // issued before the admin changed the account status.
  if (!user || !canUseAuthenticatedSession(user)) {
    if (payload.sessionId) {
      await db.userSession
        .updateMany({
          where: { sessionId: payload.sessionId, revokedAt: null },
          data: { revokedAt: new Date() }
        })
        .catch(() => undefined);
    }
    return null;
  }

  return { user };
}

async function getRequestMeta(): Promise<RequestMeta> {
  const headerStore = await headers();
  const forwardedIp = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || null;

  return {
    ipAddress: headerStore.get("cf-connecting-ip") || forwardedIp || headerStore.get("x-real-ip"),
    country: headerStore.get("cf-ipcountry"),
    city: headerStore.get("cf-ipcity"),
    userAgent: headerStore.get("user-agent")
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}
