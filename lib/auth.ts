import "server-only";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

import { db } from "@/lib/db";

export const SESSION_COOKIE = "ditaknet_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  preferredLanguage: string;
  interestedPackage: string | null;
};

type SessionPayload = {
  userId: string;
  expiresAt: number;
};

function getAuthSecret() {
  const secret = process.env.NEXTAUTH_SECRET;

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
  const token = signSession({
    userId: user.id,
    expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000
  });
  const cookieStore = await cookies();

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
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<{ user: SessionUser } | null> {
  const cookieStore = await cookies();
  const payload = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  if (!payload) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      preferredLanguage: true,
      interestedPackage: true
    }
  });

  return user ? { user } : null;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}
