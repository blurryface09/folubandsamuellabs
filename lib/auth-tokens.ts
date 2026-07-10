import "server-only";

import { randomBytes, createHash } from "crypto";

export function createSecureToken() {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function tokenExpiryDate(hours: number) {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + hours);
  return expiresAt;
}
