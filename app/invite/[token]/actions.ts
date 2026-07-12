"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn } from "@/lib/auth";
import { createAndSendVerificationEmail } from "@/lib/account-email";
import { db } from "@/lib/db";
import { hashInviteToken } from "@/lib/invite-token";
import { hashPassword, validatePasswordStrength } from "@/lib/password";
import { isSingleUseTokenUsable } from "@/lib/token-policy";

type AcceptInviteState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

function cleanString(value: FormDataEntryValue | null) {
  const nextValue = typeof value === "string" ? value.trim() : "";
  return nextValue.length > 0 ? nextValue : null;
}

export async function acceptInviteAction(
  _previousState: AcceptInviteState,
  formData: FormData,
): Promise<AcceptInviteState> {
  const token = cleanString(formData.get("token"));
  const password = cleanString(formData.get("password"));
  const confirmPassword = cleanString(formData.get("confirmPassword"));
  const fieldErrors: Record<string, string> = {};

  if (!token) {
    return { ok: false, message: "Invite token is missing." };
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
    return {
      ok: false,
      fieldErrors,
      message: "Check the highlighted fields.",
    };
  }

  const tokenHash = hashInviteToken(token);
  const invite = await db.employeeInvite.findUnique({
    where: { tokenHash },
    include: {
      employee: true,
      organization: true,
    },
  });

  if (
    !invite ||
    !isSingleUseTokenUsable({
      expiresAt: invite.expiresAt,
      usedAt: invite.acceptedAt,
      revokedAt: invite.revokedAt,
    }) ||
    invite.organization.status !== "ACTIVE"
  ) {
    return {
      ok: false,
      message: "This invite is invalid or has expired.",
    };
  }

  const email = invite.email.toLowerCase();
  let activatedUser:
    | { id: string; email: string; name: string | null }
    | undefined;

  await db.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email },
      update: {
        name: `${invite.employee.firstName} ${invite.employee.lastName}`,
        passwordHash: hashPassword(password!),
      },
      create: {
        email,
        name: `${invite.employee.firstName} ${invite.employee.lastName}`,
        passwordHash: hashPassword(password!),
      },
    });
    activatedUser = { id: user.id, email: user.email, name: user.name };

    const member = await tx.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: invite.organizationId,
          userId: user.id,
        },
      },
      update: {
        role: "EMPLOYEE",
        title: invite.employee.jobTitle,
        joinedAt: new Date(),
      },
      create: {
        organizationId: invite.organizationId,
        userId: user.id,
        role: "EMPLOYEE",
        title: invite.employee.jobTitle,
        invitedAt: invite.createdAt,
        joinedAt: new Date(),
      },
    });

    await tx.employee.update({
      where: {
        id_organizationId: {
          id: invite.employeeId,
          organizationId: invite.organizationId,
        },
      },
      data: {
        organizationMemberId: member.id,
      },
    });

    await tx.employeeInvite.update({
      where: { id: invite.id },
      data: {
        acceptedAt: new Date(),
      },
    });

    await tx.auditLog.create({
      data: {
        organizationId: invite.organizationId,
        actorUserId: user.id,
        actorMemberId: member.id,
        action: "invite.accepted",
        entityType: "EmployeeInvite",
        entityId: invite.id,
        metadata: { employeeId: invite.employeeId },
      },
    });
  });

  if (activatedUser) {
    try {
      await createAndSendVerificationEmail({
        userId: activatedUser.id,
        email: activatedUser.email,
        name: activatedUser.name,
      });
    } catch {
      // Account activation already succeeded. Verification can be resent.
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/my-profile",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?registered=1");
    }

    throw error;
  }

  return { ok: true };
}
