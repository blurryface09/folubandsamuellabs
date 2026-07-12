"use server";

import { redirect } from "next/navigation";

import { appOrigin } from "@/lib/app-url";
import { createSecureToken, hashToken, tokenExpiryDate } from "@/lib/auth-tokens";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { hashPassword, validatePasswordStrength } from "@/lib/password";
import { isSingleUseTokenUsable } from "@/lib/token-policy";

type PasswordActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

function cleanString(value: FormDataEntryValue | null) {
  const nextValue = typeof value === "string" ? value.trim() : "";
  return nextValue.length > 0 ? nextValue : null;
}

export async function requestPasswordResetAction(
  _previousState: PasswordActionState,
  formData: FormData,
): Promise<PasswordActionState> {
  const email = cleanString(formData.get("email"))?.toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      ok: false,
      fieldErrors: { email: "Enter a valid email address." },
      message: "Check the highlighted fields.",
    };
  }

  const user = await db.user.findUnique({
    where: { email },
    include: {
      memberships: {
        orderBy: { createdAt: "asc" },
        take: 1,
        select: { id: true, organizationId: true },
      },
    },
  });

  if (user) {
    const token = createSecureToken();
    const expiresAt = tokenExpiryDate(1);

    await db.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });
    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(token),
        expiresAt,
      },
    });
    await sendPasswordResetEmail({
      to: user.email,
      name: user.name ?? user.email,
      resetLink: `${await appOrigin()}/reset-password/${token}`,
      expiresAt,
    });

    const membership = user.memberships[0];

    if (membership) {
      await db.auditLog.create({
        data: {
          organizationId: membership.organizationId,
          actorUserId: user.id,
          actorMemberId: membership.id,
          action: "auth.password_reset_requested",
          entityType: "User",
          entityId: user.id,
        },
      });
    }
  }

  return {
    ok: true,
    message: "If an account exists for that email, a reset link has been sent.",
  };
}

export async function resetPasswordAction(
  _previousState: PasswordActionState,
  formData: FormData,
): Promise<PasswordActionState> {
  const token = cleanString(formData.get("token"));
  const password = cleanString(formData.get("password"));
  const confirmPassword = cleanString(formData.get("confirmPassword"));
  const fieldErrors: Record<string, string> = {};

  if (!token) {
    return { ok: false, message: "Reset token is missing." };
  }

  const passwordError = validatePasswordStrength(password);

  if (passwordError) {
    fieldErrors.password = passwordError;
  }

  if (!confirmPassword) {
    fieldErrors.confirmPassword = "Confirm your password.";
  } else if (password && confirmPassword !== password) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors, message: "Check the highlighted fields." };
  }

  const resetToken = await db.passwordResetToken.findUnique({
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

  if (!resetToken || !isSingleUseTokenUsable(resetToken)) {
    return { ok: false, message: "This reset link is invalid or expired." };
  }

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash: hashPassword(password!) },
    });
    await tx.passwordResetToken.updateMany({
      where: { userId: resetToken.userId, usedAt: null },
      data: { usedAt: new Date() },
    });
  });

  const membership = resetToken.user.memberships[0];

  if (membership) {
    await db.auditLog.create({
      data: {
        organizationId: membership.organizationId,
        actorUserId: resetToken.user.id,
        actorMemberId: membership.id,
        action: "auth.password_reset_completed",
        entityType: "User",
        entityId: resetToken.user.id,
      },
    });
  }

  redirect("/login?reset=1");
}
