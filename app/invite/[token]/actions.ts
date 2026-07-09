"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashInviteToken } from "@/lib/invite-token";
import { hashPassword } from "@/lib/password";

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
  const fieldErrors: Record<string, string> = {};

  if (!token) {
    return { ok: false, message: "Invite token is missing." };
  }

  if (!password || password.length < 8) {
    fieldErrors.password = "Use at least 8 characters.";
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
    invite.revokedAt ||
    invite.acceptedAt ||
    invite.expiresAt < new Date() ||
    invite.organization.status !== "ACTIVE"
  ) {
    return {
      ok: false,
      message: "This invite is invalid or has expired.",
    };
  }

  const email = invite.email.toLowerCase();

  await db.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email },
      update: {
        name: `${invite.employee.firstName} ${invite.employee.lastName}`,
        passwordHash: hashPassword(password!),
        emailVerified: new Date(),
      },
      create: {
        email,
        name: `${invite.employee.firstName} ${invite.employee.lastName}`,
        passwordHash: hashPassword(password!),
        emailVerified: new Date(),
      },
    });

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
  });

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
