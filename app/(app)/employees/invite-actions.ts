"use server";

import { UserRole } from "@prisma/client";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentMembership } from "@/lib/current-organization";
import { writeAuditLog } from "@/lib/audit";
import { db } from "@/lib/db";
import { sendInviteEmail } from "@/lib/email";
import { createInviteToken, hashInviteToken, inviteExpiryDate } from "@/lib/invite-token";
import { hasMinimumRole } from "@/lib/roles";

function cleanString(value: FormDataEntryValue | null) {
  const nextValue = typeof value === "string" ? value.trim() : "";
  return nextValue.length > 0 ? nextValue : null;
}

async function appOrigin() {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }

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
      firstName: true,
      lastName: true,
      workEmail: true,
      organizationMemberId: true,
      organization: {
        select: {
          name: true,
        },
      },
      invites: {
        where: {
          acceptedAt: null,
        },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { id: true },
      },
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
  const expiresAt = inviteExpiryDate();
  let inviteId = "";

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

    const invite = await tx.employeeInvite.create({
      data: {
        organizationId: membership.organizationId,
        employeeId: employee.id,
        invitedByMemberId: membership.id,
        email: employee.workEmail!,
        tokenHash,
        expiresAt,
      },
      select: { id: true },
    });
    inviteId = invite.id;
  });

  const inviteLink = `${await appOrigin()}/invite/${token}`;
  const emailResult = await sendInviteEmail({
    to: employee.workEmail,
    companyName: employee.organization.name,
    employeeName: `${employee.firstName} ${employee.lastName}`,
    inviteLink,
    expiresAt,
  });

  await db.employeeInvite.update({
    where: { id: inviteId },
    data: emailResult.ok
      ? {
          deliveryStatus: "SENT",
          deliveryProvider: emailResult.provider,
          deliveryError: null,
          sentAt: new Date(),
        }
      : {
          deliveryStatus: "FAILED",
          deliveryProvider: emailResult.provider,
          deliveryError: emailResult.error.slice(0, 500),
        },
  });
  await writeAuditLog({
    organizationId: membership.organizationId,
    actorUserId: membership.userId,
    actorMemberId: membership.id,
    action: employee.invites[0] ? "invite.resent" : "invite.sent",
    entityType: "EmployeeInvite",
    entityId: inviteId,
    metadata: {
      employeeId: employee.id,
      email: employee.workEmail,
      deliveryStatus: emailResult.ok ? "SENT" : "FAILED",
      deliveryProvider: emailResult.provider,
    },
  });

  revalidatePath("/employees");
  revalidatePath(`/employees/${employee.id}`);

  if (emailResult.ok) {
    redirect(`/employees/${employee.id}?toast=Invite%20email%20sent`);
  }

  redirect(
    `/employees/${employee.id}?toast=${encodeURIComponent(
      `Invite created but email failed: ${emailResult.error}`,
    )}&toastType=error&invite=${encodeURIComponent(inviteLink)}`,
  );
}
