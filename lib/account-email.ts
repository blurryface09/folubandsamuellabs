import "server-only";

import { db } from "@/lib/db";
import { appOrigin } from "@/lib/app-url";
import { createSecureToken, hashToken, tokenExpiryDate } from "@/lib/auth-tokens";
import { sendVerificationEmail } from "@/lib/email";

export async function createAndSendVerificationEmail({
  userId,
  email,
  name,
}: {
  userId: string;
  email: string;
  name?: string | null;
}) {
  const token = createSecureToken();
  const expiresAt = tokenExpiryDate(24);

  await db.emailVerificationToken.updateMany({
    where: {
      userId,
      usedAt: null,
    },
    data: {
      usedAt: new Date(),
    },
  });
  await db.emailVerificationToken.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
    },
  });

  return sendVerificationEmail({
    to: email,
    name: name ?? email,
    verificationLink: `${await appOrigin()}/verify-email/${token}`,
    expiresAt,
  });
}
