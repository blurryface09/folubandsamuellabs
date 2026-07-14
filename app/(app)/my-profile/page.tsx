import Link from "next/link";
import type { UserRole } from "@prisma/client";
import { BadgeCheck, MailWarning, Plus, UserRoundSearch } from "lucide-react";

import { EmployeeDocumentList } from "@/app/(app)/employees/document-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentMembership } from "@/lib/current-organization";
import { db } from "@/lib/db";
import { canManageWorkspace } from "@/lib/roles";

const roleLabels: Record<UserRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  HR_MANAGER: "HR Manager",
  MANAGER: "Manager",
  EMPLOYEE: "Employee",
};

function display(value?: string | null) {
  return value && value.trim().length > 0 ? value : "Not set";
}

function formatDate(value: Date | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(value);
}

function initialsOf(name?: string | null) {
  return (
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "FS"
  );
}

function DetailGrid({ items }: { items: [string, React.ReactNode][] }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4" key={label}>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </dt>
          <dd className="mt-2 text-sm font-medium text-slate-950">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function MyProfilePage() {
  const membership = await getCurrentMembership();
  const employee = await db.employee.findFirst({
    where: {
      organizationId: membership.organizationId,
      organizationMemberId: membership.id,
    },
    include: {
      department: {
        select: {
          name: true,
          code: true,
        },
      },
      documents: {
        orderBy: { createdAt: "desc" },
        include: {
          uploadedByMember: {
            include: {
              user: {
                select: {
                  email: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const isManager = canManageWorkspace(membership.role);

  const accountItems: [string, React.ReactNode][] = [
    ["Full name", display(membership.user.name)],
    [
      "Email",
      <span className="inline-flex flex-wrap items-center gap-1.5" key="email">
        {membership.user.email}
        {membership.user.emailVerified ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
            <BadgeCheck aria-hidden className="h-3 w-3" />
            Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
            <MailWarning aria-hidden className="h-3 w-3" />
            Unverified
          </span>
        )}
      </span>,
    ],
    ["Workspace role", roleLabels[membership.role]],
    ["Organization", membership.organization.name],
    ["Member since", formatDate(membership.joinedAt ?? membership.createdAt)],
  ];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {membership.organization.name}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          My profile
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          {employee
            ? "Your employee record and account information."
            : "Your account information in this workspace."}
        </p>
      </div>

      {!employee ? (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div
                aria-hidden
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-950 text-base font-semibold text-white"
              >
                {initialsOf(membership.user.name)}
              </div>
              <div>
                <CardTitle className="text-lg">
                  {display(membership.user.name)}
                </CardTitle>
                <CardDescription className="mt-1">
                  {roleLabels[membership.role]} · {membership.organization.name}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <DetailGrid items={accountItems} />
            </CardContent>
          </Card>

          {isManager ? (
            <Card>
              <CardHeader>
                <CardTitle>No employee record linked</CardTitle>
                <CardDescription>
                  Admin accounts are not staff records by default, so there is no
                  employee profile to show here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-slate-600">
                  If you are also on the payroll, create an employee record for
                  yourself and link it to your account. Otherwise, everything
                  above is all this page needs to show.
                </p>
                <Link
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                  href="/employees/new"
                >
                  <Plus aria-hidden className="h-4 w-4" />
                  Create your employee record
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center px-6 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                  <UserRoundSearch aria-hidden className="h-5 w-5 text-slate-500" />
                </div>
                <h2 className="mt-4 text-base font-semibold text-slate-950">
                  No employee profile linked yet
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  Your account is active, but it has not been connected to a staff
                  record. Ask your company admin or HR officer to link your
                  employee profile.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div
                aria-hidden
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-950 text-base font-semibold text-white"
              >
                {initialsOf(`${employee.firstName} ${employee.lastName}`)}
              </div>
              <div>
                <CardTitle className="text-lg">
                  {employee.firstName} {employee.lastName}
                </CardTitle>
                <CardDescription className="mt-1">
                  {employee.jobTitle ? `${employee.jobTitle} · ` : ""}
                  {employee.employeeNumber}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <DetailGrid
                items={[
                  ["Work email", display(employee.workEmail)],
                  ["Phone", display(employee.phone)],
                  ["Job title", display(employee.jobTitle)],
                  [
                    "Department",
                    employee.department
                      ? `${employee.department.name}${employee.department.code ? ` (${employee.department.code})` : ""}`
                      : "No department",
                  ],
                  ["Employment type", employee.employmentType.replaceAll("_", " ")],
                  ["Status", employee.status.replaceAll("_", " ")],
                  ["Hire date", formatDate(employee.hireDate)],
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My documents</CardTitle>
              <CardDescription>
                Files shared with your employee profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeDocumentList documents={employee.documents} />
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
