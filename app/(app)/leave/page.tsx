import { LeaveStatus, LeaveType, UserRole } from "@prisma/client";
import { CalendarDays, CalendarPlus, Users } from "lucide-react";

import { cancelLeave, requestLeave, reviewLeave } from "@/app/(app)/leave/actions";
import { EmployeeToast } from "@/app/(app)/employees/employee-toast";
import { PageShell } from "@/components/app/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentMembership } from "@/lib/current-organization";
import { db } from "@/lib/db";
import {
  businessDaysBetween,
  leaveAllocations,
  leaveStatusLabels,
  leaveTypeLabels,
  yearRange,
} from "@/lib/leave";
import { hasMinimumRole } from "@/lib/roles";

type LeavePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function paramValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(value);
}

function statusClass(status: LeaveStatus) {
  switch (status) {
    case "APPROVED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "REJECTED":
      return "border-red-200 bg-red-50 text-red-700";
    case "PENDING":
      return "border-amber-200 bg-amber-50 text-amber-800";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function StatusBadge({ status }: { status: LeaveStatus }) {
  return (
    <span
      className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass(status)}`}
    >
      {leaveStatusLabels[status]}
    </span>
  );
}

export default async function LeavePage({ searchParams }: LeavePageProps) {
  const [membership, params] = await Promise.all([
    getCurrentMembership(),
    searchParams ?? Promise.resolve({}),
  ]);
  const isReviewer = hasMinimumRole(membership.role, UserRole.MANAGER);
  const now = new Date();
  const onLeaveHorizon = new Date(now.getTime() + 30 * 86400000);
  const currentYear = now.getUTCFullYear();
  const { start: yearStart, end: yearEnd } = yearRange(currentYear);

  const employee = await db.employee.findFirst({
    where: {
      organizationId: membership.organizationId,
      organizationMemberId: membership.id,
    },
    select: { id: true },
  });

  const [myRequests, myActiveThisYear, pendingRequests, recentDecisions, onLeave] =
    await Promise.all([
      employee
        ? db.leaveRequest.findMany({
            where: {
              organizationId: membership.organizationId,
              employeeId: employee.id,
            },
            orderBy: { createdAt: "desc" },
            take: 10,
          })
        : Promise.resolve([]),
      employee
        ? db.leaveRequest.findMany({
            where: {
              organizationId: membership.organizationId,
              employeeId: employee.id,
              status: { in: [LeaveStatus.PENDING, LeaveStatus.APPROVED] },
              startDate: { lte: yearEnd },
              endDate: { gte: yearStart },
            },
            select: { type: true, startDate: true, endDate: true },
          })
        : Promise.resolve([]),
      isReviewer
        ? db.leaveRequest.findMany({
            where: {
              organizationId: membership.organizationId,
              status: LeaveStatus.PENDING,
            },
            orderBy: { createdAt: "asc" },
            include: {
              employee: {
                select: { firstName: true, lastName: true, employeeNumber: true },
              },
            },
          })
        : Promise.resolve([]),
      isReviewer
        ? db.leaveRequest.findMany({
            where: {
              organizationId: membership.organizationId,
              status: { in: [LeaveStatus.APPROVED, LeaveStatus.REJECTED] },
            },
            orderBy: { reviewedAt: "desc" },
            take: 6,
            include: {
              employee: { select: { firstName: true, lastName: true } },
              reviewedByMember: {
                include: { user: { select: { name: true, email: true } } },
              },
            },
          })
        : Promise.resolve([]),
      db.leaveRequest.findMany({
        where: {
          organizationId: membership.organizationId,
          status: LeaveStatus.APPROVED,
          startDate: { lte: onLeaveHorizon },
          endDate: { gte: now },
        },
        orderBy: { startDate: "asc" },
        take: 10,
        include: {
          employee: { select: { firstName: true, lastName: true } },
        },
      }),
    ]);

  const usedByType = new Map<LeaveType, number>();
  for (const request of myActiveThisYear) {
    usedByType.set(
      request.type,
      (usedByType.get(request.type) ?? 0) +
        businessDaysBetween(request.startDate, request.endDate),
    );
  }

  const balanceTypes = (Object.keys(leaveAllocations) as LeaveType[]).filter(
    (type) => leaveAllocations[type] !== null,
  );

  return (
    <PageShell
      title="Leave"
      description="Request time off, track balances, and approve your team's leave."
    >
      <EmployeeToast
        message={paramValue(params, "toast")}
        type={paramValue(params, "toastType")}
      />
      <div className="space-y-6">
        {employee ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {balanceTypes.map((type) => {
              const allocation = leaveAllocations[type]!;
              const used = usedByType.get(type) ?? 0;
              const left = Math.max(allocation - used, 0);

              return (
                <div
                  key={type}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {leaveTypeLabels[type]}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    {left}
                    <span className="text-sm font-normal text-slate-500">
                      {" "}
                      / {allocation} days
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {used} used or pending in {currentYear}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="px-5 py-6 text-sm leading-6 text-slate-600">
              Your account is not linked to an employee record, so you cannot
              request leave. Ask your admin or HR officer to link your staff
              profile.
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
          {employee ? (
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarPlus aria-hidden className="h-4 w-4 text-slate-500" />
                  Request leave
                </CardTitle>
                <CardDescription>
                  Weekends are excluded; balances count pending requests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={requestLeave} className="space-y-4">
                  <div>
                    <label
                      className="text-sm font-medium text-slate-700"
                      htmlFor="type"
                    >
                      Leave type
                    </label>
                    <select
                      className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      defaultValue="ANNUAL"
                      id="type"
                      name="type"
                    >
                      {(Object.keys(leaveTypeLabels) as LeaveType[]).map((type) => (
                        <option key={type} value={type}>
                          {leaveTypeLabels[type]}
                          {leaveAllocations[type] !== null
                            ? ` (${leaveAllocations[type]} days/yr)`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        className="text-sm font-medium text-slate-700"
                        htmlFor="startDate"
                      >
                        First day
                      </label>
                      <input
                        className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        id="startDate"
                        name="startDate"
                        required
                        type="date"
                      />
                    </div>
                    <div>
                      <label
                        className="text-sm font-medium text-slate-700"
                        htmlFor="endDate"
                      >
                        Last day
                      </label>
                      <input
                        className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        id="endDate"
                        name="endDate"
                        required
                        type="date"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium text-slate-700"
                      htmlFor="reason"
                    >
                      Reason (optional)
                    </label>
                    <textarea
                      className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      id="reason"
                      name="reason"
                      placeholder="Context for your approver"
                      rows={3}
                    />
                  </div>
                  <Button className="w-full" type="submit">
                    Submit request
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : null}

          <div className="min-w-0 space-y-6">
            {isReviewer ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users aria-hidden className="h-4 w-4 text-slate-500" />
                    Approvals
                  </CardTitle>
                  <CardDescription>
                    {pendingRequests.length === 0
                      ? "No requests waiting on you."
                      : `${pendingRequests.length} request${pendingRequests.length === 1 ? "" : "s"} awaiting a decision.`}
                  </CardDescription>
                </CardHeader>
                {pendingRequests.length > 0 ? (
                  <CardContent className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="rounded-lg border border-slate-200 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-slate-950">
                              {request.employee.firstName} {request.employee.lastName}
                              <span className="ml-2 text-xs font-normal text-slate-500">
                                {request.employee.employeeNumber}
                              </span>
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {leaveTypeLabels[request.type]} ·{" "}
                              {formatDate(request.startDate)} –{" "}
                              {formatDate(request.endDate)} (
                              {businessDaysBetween(request.startDate, request.endDate)}{" "}
                              working days)
                            </p>
                          </div>
                          <StatusBadge status={request.status} />
                        </div>
                        {request.reason ? (
                          <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">
                            {request.reason}
                          </p>
                        ) : null}
                        <form
                          action={reviewLeave}
                          className="mt-3 flex flex-col gap-2 sm:flex-row"
                        >
                          <input name="id" type="hidden" value={request.id} />
                          <input
                            className="h-10 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                            name="note"
                            placeholder="Note (optional)"
                          />
                          <div className="flex gap-2">
                            <Button name="decision" type="submit" value="approve">
                              Approve
                            </Button>
                            <Button
                              className="border-red-200 text-red-700 hover:bg-red-50"
                              name="decision"
                              type="submit"
                              value="reject"
                              variant="secondary"
                            >
                              Reject
                            </Button>
                          </div>
                        </form>
                      </div>
                    ))}
                  </CardContent>
                ) : null}
              </Card>
            ) : null}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays aria-hidden className="h-4 w-4 text-slate-500" />
                  On leave soon
                </CardTitle>
                <CardDescription>
                  Approved leave that is active now or starts in the next 30 days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {onLeave.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Nobody is scheduled to be away.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {onLeave.map((request) => (
                      <div
                        key={request.id}
                        className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0"
                      >
                        <p className="text-sm font-medium text-slate-950">
                          {request.employee.firstName} {request.employee.lastName}
                        </p>
                        <p className="text-sm text-slate-600">
                          {leaveTypeLabels[request.type]} ·{" "}
                          {formatDate(request.startDate)} – {formatDate(request.endDate)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {employee ? (
              <Card>
                <CardHeader>
                  <CardTitle>My requests</CardTitle>
                  <CardDescription>Your latest leave requests.</CardDescription>
                </CardHeader>
                <CardContent>
                  {myRequests.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      You have not requested leave yet.
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {myRequests.map((request) => (
                        <div
                          key={request.id}
                          className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-950">
                              {leaveTypeLabels[request.type]} ·{" "}
                              {formatDate(request.startDate)} –{" "}
                              {formatDate(request.endDate)}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {businessDaysBetween(request.startDate, request.endDate)}{" "}
                              working days
                              {request.reviewerNote
                                ? ` · Reviewer: ${request.reviewerNote}`
                                : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={request.status} />
                            {request.status === "PENDING" ? (
                              <form action={cancelLeave}>
                                <input name="id" type="hidden" value={request.id} />
                                <Button
                                  className="h-8 px-3 text-xs"
                                  type="submit"
                                  variant="ghost"
                                >
                                  Cancel
                                </Button>
                              </form>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : null}

            {isReviewer && recentDecisions.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Recent decisions</CardTitle>
                  <CardDescription>The last reviewed requests.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-slate-100">
                    {recentDecisions.map((request) => (
                      <div
                        key={request.id}
                        className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0"
                      >
                        <p className="text-sm text-slate-950">
                          {request.employee.firstName} {request.employee.lastName}
                          <span className="ml-2 text-xs text-slate-500">
                            {leaveTypeLabels[request.type]} ·{" "}
                            {formatDate(request.startDate)} –{" "}
                            {formatDate(request.endDate)}
                          </span>
                        </p>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={request.status} />
                          <span className="text-xs text-slate-500">
                            by{" "}
                            {request.reviewedByMember?.user.name ??
                              request.reviewedByMember?.user.email ??
                              "—"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
