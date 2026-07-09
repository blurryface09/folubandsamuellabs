"use server";

import { UserRole } from "@prisma/client";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentMembership } from "@/lib/current-organization";
import { db } from "@/lib/db";
import { createInviteToken, hashInviteToken, inviteExpiryDate } from "@/lib/invite-token";
import { hasMinimumRole } from "@/lib/roles";

function cleanString(value: FormDataEntryValue | null) {
  const nextValue = typeof value === "string" ? value.trim() : "";
  return nextValue.length > 0 ? nextValue : null;
}

async function appOrigin() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";

  return `${protocol}://${host}`;
}

export async function inviteEmployee(formData: FormData) {
  const membership = await getCurrentMembership();

  if (!hasMinimumRole(membership.role, UserRole.HR_MANAGER)) {
    redirect("/dashboard?error=AccessDenied");
  }

  const employeeId = cleanString(formData.get("employeeId"));

  if (!employeeId) {
    redirect("/employees?toast=Missing%20employee%20id");
  }

  const employee = await db.employee.findFirst({
    where: {
      id: employeeId!,
      organizationId: membership.organizationId,
    },
    select: {
      id: true,
      workEmail: true,
      organizationMemberId: true,
    },
  });

  if (!employee) {
    redirect("/employees?toast=Employee%20not%20found");
  }

  if (employee.organizationMemberId) {
    redirect(`/employees/${employee.id}?toast=Employee%20already%20has%20an%20account`);
  }

  if (!employee.workEmail) {
    redirect(`/employees/${employee.id}?toast=Add%20a%20work%20email%20before%20inviting`);
  }

  const token = createInviteToken();
  const tokenHash = hashInviteToken(token);

  await db.$transaction(async (tx) => {
    await tx.employeeInvite.updateMany({
      where: {
        organizationId: membership.organizationId,
        employeeId: employee.id,
        acceptedAt: null,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    await tx.employeeInvite.create({
      data: {
        organizationId: membership.organizationId,
        employeeId: employee.id,
        invitedByMemberId: membership.id,
        email: employee.workEmail!,
        tokenHash,
        expiresAt: inviteExpiryDate(),
      },
    });
  });

  const inviteLink = `${await appOrigin()}/invite/${token}`;
  revalidatePath("/employees");
  revalidatePath(`/employees/${employee.id}`);
  redirect(
    `/employees/${employee.id}?toast=Invite%20created&invite=${encodeURIComponent(inviteLink)}`,
  );
}
