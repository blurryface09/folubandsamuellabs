import { LeaveStatus, LeaveType } from "@prisma/client";

export const leaveTypeLabels: Record<LeaveType, string> = {
  ANNUAL: "Annual",
  SICK: "Sick",
  MATERNITY: "Maternity",
  PATERNITY: "Paternity",
  UNPAID: "Unpaid",
  COMPASSIONATE: "Compassionate",
  STUDY: "Study",
  OTHER: "Other",
};

export const leaveStatusLabels: Record<LeaveStatus, string> = {
  DRAFT: "Draft",
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

/**
 * Default yearly allocations in working days. Null means uncapped (tracked
 * but not balance-checked). Org-configurable policies can replace this once
 * the settings module ships.
 */
export const leaveAllocations: Record<LeaveType, number | null> = {
  ANNUAL: 20,
  SICK: 12,
  MATERNITY: 84,
  PATERNITY: 10,
  UNPAID: null,
  COMPASSIONATE: 5,
  STUDY: 10,
  OTHER: null,
};

/** Working days (Mon-Fri) between two dates, inclusive. */
export function businessDaysBetween(start: Date, end: Date) {
  let count = 0;
  const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  const last = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());

  while (cursor.getTime() <= last) {
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) {
      count += 1;
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return count;
}

export function yearRange(year: number) {
  return {
    start: new Date(Date.UTC(year, 0, 1)),
    end: new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)),
  };
}
