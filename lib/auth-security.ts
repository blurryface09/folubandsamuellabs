import "server-only";

import { db } from "@/lib/db";

const MAX_FAILED_LOGINS = 5;
const LOCK_MINUTES = 15;

export async function isLoginLocked(email: string) {
  const throttle = await db.loginThrottle.findUnique({
    where: { email },
    select: { lockedUntil: true },
  });

  return Boolean(throttle?.lockedUntil && throttle.lockedUntil > new Date());
}

export async function recordLoginFailure(email: string) {
  const existing = await db.loginThrottle.findUnique({ where: { email } });
  const failedCount = (existing?.failedCount ?? 0) + 1;
  const lockedUntil =
    failedCount >= MAX_FAILED_LOGINS
      ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000)
      : existing?.lockedUntil;

  await db.loginThrottle.upsert({
    where: { email },
    update: {
      failedCount,
      lockedUntil,
      lastFailedAt: new Date(),
    },
    create: {
      email,
      failedCount,
      lockedUntil,
      lastFailedAt: new Date(),
    },
  });
}

export async function recordLoginSuccess(email: string) {
  await db.loginThrottle.upsert({
    where: { email },
    update: {
      failedCount: 0,
      lockedUntil: null,
      lastSuccessAt: new Date(),
    },
    create: {
      email,
      failedCount: 0,
      lastSuccessAt: new Date(),
    },
  });
}
