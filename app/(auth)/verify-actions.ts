"use server";

import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { createAndSendVerificationEmail } from "@/lib/account-email";
import { hashToken } from "@/lib/auth-tokens";
import { db } from "@/lib/db";
import { isSingleUseTokenUsable } from "@/lib/token-policy";

export async function verifyEmailToken(token: string) {
  const verificationToken = await db.emailVerificationToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: {
      user: {
        include: {
          memberships: {
            orderBy: { createdAt: "asc" },
            take: 1,
            select: { id: true, organizationId: true },
          },
        },
      },
    },
  });

  if (!verificationToken || !isSingleUseTokenUsable(verificationToken)) {
    return { ok: false, message: "This verification link is invalid or expired." };
  }

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date() },
    });
    await tx.emailVerificationToken.updateMany({
      where: { userId: verificationToken.userId, usedAt: null },
      data: { usedAt: new Date() },
    });
  });

  const membership = verificationToken.user.memberships[0];

  if (membership) {
    await db.auditLog.create({
      data: {
        organizationId: membership.organizationId,
        actorUserId: verificationToken.user.id,
        actorMemberId: membership.id,
        action: "auth.email_verified",
        entityType: "User",
        entityId: verificationToken.user.id,
      },
    });
  }

  return { ok: true, message: "Email verified. You can continue." };
}

export async function resendVerificationAction() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
    },
  });

  if (!user) {
    redirect("/login?error=SessionExpired");
  }

  if (!user.emailVerified) {
    await createAndSendVerificationEmail({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
  }

  redirect("/dashboard?toast=Verification%20email%20sent");
}
