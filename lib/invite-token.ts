import { createHash, randomBytes } from "crypto";

export function createInviteToken() {
  return randomBytes(32).toString("base64url");
}

export function hashInviteToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function inviteExpiryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
}

export function inviteStatus(invite?: {
  acceptedAt: Date | null;
  revokedAt: Date | null;
  expiresAt: Date;
} | null) {
  if (!invite) {
    return "Not invited";
  }

  if (invite.acceptedAt) {
    return "Accepted";
  }

  if (invite.revokedAt) {
    return "Revoked";
  }

  if (invite.expiresAt < new Date()) {
    return "Expired";
  }

  return "Pending";
}
