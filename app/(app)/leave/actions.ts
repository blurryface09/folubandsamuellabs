"use server";

import { LeaveStatus, LeaveType, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { writeAuditLog } from "@/lib/audit";
import { getCurrentMembership, requireRole } from "@/lib/current-organization";
import { db } from "@/lib/db";
import { businessDaysBetween, leaveAllocations, yearRange } from "@/lib/leave";

const leaveTypes = new Set(Object.values(LeaveType));

function cleanString(value: FormDataEntryValue | null) {
  const nextValue = typeof value === "string" ? value.trim() : "";
  return nextValue.length > 0 ? nextValue : null;
}

function parseDate(value: FormDataEntryValue | null) {
  const text = cleanString(value);

  if (!text) {
    return null;
  }

  const date = new Date(`${text}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function toastRedirect(message: string, type: "error" | "success" = "success"): never {
  const params = new URLSearchParams({ toast: message });

  if (type === "error") {
    params.set("toastType", "error");
  }

  redirect(`/leave?${params.toString()}`);
}

export async function requestLeave(formData: FormData) {
  const membership = await getCurrentMembership();
  const employee = await db.employee.findFirst({
    where: {
      organizationId: membership.organizationId,
      organizationMemberId: membership.id,
    },
    select: { id: true, firstName: true, lastName: true },
  });

  if (!employee) {
    toastRedirect(
      "Your account is not linked to an employee record, so leave cannot be requested.",
      "error",
    );
  }

  const type = cleanString(formData.get("type"));
  const startDate = parseDate(formData.get("startDate"));
  const endDate = parseDate(formData.get("endDate"));
  const reason = cleanString(formData.get("reason"));

  if (!type || !leaveTypes.has(type as LeaveType)) {
    toastRedirect("Choose a leave type.", "error");
  }

  if (!startDate || !endDate) {
    toastRedirect("Choose a start and end date.", "error");
  }

  if (endDate!.getTime() < startDate!.getTime()) {
    toastRedirect("The end date cannot be before the start date.", "error");
  }

  const requestedDays = businessDaysBetween(startDate!, endDate!);

  if (requestedDays === 0) {
    toastRedirect("The selected range contains no working days.", "error");
  }

  const allocation = leaveAllocations[type as LeaveType];

  if (allocation !== null) {
    const { start, end } = yearRange(startDate!.getUTCFullYear());
    const existing = await db.leaveRequest.findMany({
      where: {
        organizationId: membership.organizationId,
        employeeId: employee!.id,
        type: type as LeaveType,
        status: { in: [LeaveStatus.PENDING, LeaveStatus.APPROVED] },
        startDate: { lte: end },
        endDate: { gte: start },
      },
      select: { startDate: true, endDate: true },
    });
    const used = existing.reduce(
      (total, request) => total + businessDaysBetween(request.startDate, request.endDate),
      0,
    );

    if (used + requestedDays > allocation) {
      toastRedirect(
        `Not enough balance: ${Math.max(allocation - used, 0)} of ${allocation} days left for this type (pending requests count).`,
        "error",
      );
    }
  }

  const request = await db.leaveRequest.create({
    data: {
      organizationId: membership.organizationId,
      employeeId: employee!.id,
      type: type as LeaveType,
      startDate: startDate!,
      endDate: endDate!,
      reason,
      status: LeaveStatus.PENDING,
    },
  });

  await writeAuditLog({
    organizationId: membership.organizationId,
    actorUserId: membership.userId,
    actorMemberId: membership.id,
    action: "leave.requested",
    entityType: "LeaveRequest",
    entityId: request.id,
    metadata: { type: type!, days: requestedDays },
  });

  revalidatePath("/leave");
  revalidatePath("/dashboard");
  toastRedirect(`Leave request submitted (${requestedDays} working day${requestedDays === 1 ? "" : "s"}).`);
}

export async function cancelLeave(formData: FormData) {
  const membership = await getCurrentMembership();
  const requestId = cleanString(formData.get("id"));

  if (!requestId) {
    toastRedirect("Missing request id.", "error");
  }

  const request = await db.leaveRequest.findFirst({
    where: {
      id: requestId!,
      organizationId: membership.organizationId,
      employee: { organizationMemberId: membership.id },
    },
  });

  if (!request) {
    toastRedirect("Leave request not found.", "error");
  }

  if (request!.status !== LeaveStatus.PENDING) {
    toastRedirect("Only pending requests can be cancelled.", "error");
  }

  await db.leaveRequest.update({
    where: { id: request!.id },
    data: { status: LeaveStatus.CANCELLED },
  });

  await writeAuditLog({
    organizationId: membership.organizationId,
    actorUserId: membership.userId,
    actorMemberId: membership.id,
    action: "leave.cancelled",
    entityType: "LeaveRequest",
    entityId: request!.id,
  });

  revalidatePath("/leave");
  revalidatePath("/dashboard");
  toastRedirect("Leave request cancelled.");
}

export async function reviewLeave(formData: FormData) {
  const reviewer = await requireRole(UserRole.MANAGER);
  const requestId = cleanString(formData.get("id"));
  const decision = cleanString(formData.get("decision"));
  const note = cleanString(formData.get("note"));

  if (!requestId || (decision !== "approve" && decision !== "reject")) {
    toastRedirect("Invalid review action.", "error");
  }

  const request = await db.leaveRequest.findFirst({
    where: {
      id: requestId!,
      organizationId: reviewer.organizationId,
    },
    include: {
      employee: {
        select: {
          firstName: true,
          lastName: true,
          organizationMemberId: true,
        },
      },
    },
  });

  if (!request) {
    toastRedirect("Leave request not found.", "error");
  }

  if (request!.status !== LeaveStatus.PENDING) {
    toastRedirect("This request has already been reviewed.", "error");
  }

  if (request!.employee.organizationMemberId === reviewer.id) {
    toastRedirect("You cannot review your own leave request.", "error");
  }

  const status = decision === "approve" ? LeaveStatus.APPROVED : LeaveStatus.REJECTED;

  await db.leaveRequest.update({
    where: { id: request!.id },
    data: {
      status,
      reviewedByMemberId: reviewer.id,
      reviewedAt: new Date(),
      reviewerNote: note,
    },
  });

  await writeAuditLog({
    organizationId: reviewer.organizationId,
    actorUserId: reviewer.userId,
    actorMemberId: reviewer.id,
    action: decision === "approve" ? "leave.approved" : "leave.rejected",
    entityType: "LeaveRequest",
    entityId: request!.id,
    metadata: {
      employee: `${request!.employee.firstName} ${request!.employee.lastName}`,
      type: request!.type,
    },
  });

  revalidatePath("/leave");
  revalidatePath("/dashboard");
  toastRedirect(decision === "approve" ? "Leave approved." : "Leave rejected.");
}
