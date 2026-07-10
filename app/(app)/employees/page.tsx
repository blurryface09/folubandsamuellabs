import { EmployeeStatus, EmploymentType, Prisma, UserRole } from "@prisma/client";
import Link from "next/link";

import { inviteEmployee } from "@/app/(app)/employees/invite-actions";
import { EmployeeToast } from "@/app/(app)/employees/employee-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentOrganization, requireRole } from "@/lib/current-organization";
import { db } from "@/lib/db";
import { inviteStatus } from "@/lib/invite-token";

const statusLabels: Record<EmployeeStatus, string> = {
  ACTIVE: "Active",
  ON_LEAVE: "On leave",
  SUSPENDED: "Suspended",
  TERMINATED: "Terminated",
};

const employmentTypeLabels: Record<EmploymentType, string> = {
  FULL_TIME: "Full time",
  PART_TIME: "Part time",
  CONTRACT: "Contract",
  INTERN: "Intern",
  TEMPORARY: "Temporary",
};

type EmployeesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function paramValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function statusClass(status: EmployeeStatus) {
  if (status === "ACTIVE") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "SUSPENDED" || status === "TERMINATED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

export default async function EmployeesPage({ searchParams }: EmployeesPageProps) {
  await requireRole(UserRole.HR_MANAGER);
  const params = (await searchParams) ?? {};
  const organization = await getCurrentOrganization();
  const query = paramValue(params, "q")?.trim() ?? "";
  const departmentId = paramValue(params, "departmentId") ?? "";
  const status = paramValue(params, "status") ?? "";
  const employmentType = paramValue(params, "employmentType") ?? "";
  const toast = paramValue(params, "toast");
  const toastType = paramValue(params, "toastType");

  const where: Prisma.EmployeeWhereInput = {
    organizationId: organization.id,
    ...(query
      ? {
          OR: [
            { firstName: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
            { workEmail: { contains: query, mode: "insensitive" } },
            { phone: { contains: query, mode: "insensitive" } },
            { employeeNumber: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(departmentId ? { departmentId } : {}),
    ...(status && status in EmployeeStatus
      ? { status: status as EmployeeStatus }
      : {}),
    ...(employmentType && employmentType in EmploymentType
      ? { employmentType: employmentType as EmploymentType }
      : {}),
  };

  const [employees, departments, totalEmployees] = await Promise.all([
    db.employee.findMany({
      where,
      include: {
        invites: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            acceptedAt: true,
            revokedAt: true,
            expiresAt: true,
            deliveryStatus: true,
          },
        },
        organizationMember: {
          select: { id: true },
        },
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: [{ status: "asc" }, { lastName: "asc" }, { firstName: "asc" }],
    }),
    db.department.findMany({
      where: { organizationId: organization.id },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        code: true,
      },
    }),
    db.employee.count({
      where: { organizationId: organization.id },
    }),
  ]);

  const hasFilters = Boolean(query || departmentId || status || employmentType);

  return (
    <section className="space-y-6">
      <EmployeeToast message={toast} type={toastType} />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {organization.name}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
            Employees
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Onboard staff, keep profiles current, and manage employee status
            without exposing records across tenants.
          </p>
        </div>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          href="/employees/new"
        >
          Add employee
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find staff</CardTitle>
          <CardDescription>
            Search by name, email, phone, or employee code. Filters stay scoped
            to the current organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))_auto]" method="get">
            <input
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              defaultValue={query}
              name="q"
              placeholder="Search staff"
            />
            <select
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              defaultValue={departmentId}
              name="departmentId"
            >
              <option value="">All departments</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            <select
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              defaultValue={status}
              name="status"
            >
              <option value="">All statuses</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              defaultValue={employmentType}
              name="employmentType"
            >
              <option value="">All types</option>
              {Object.entries(employmentTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                className="h-10 rounded-md bg-slate-950 px-4 text-sm font-medium text-white"
                type="submit"
              >
                Apply
              </button>
              {hasFilters ? (
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-700"
                  href="/employees"
                >
                  Reset
                </Link>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Staff directory</CardTitle>
            <CardDescription>
              {employees.length} shown of {totalEmployees} employee
              {totalEmployees === 1 ? "" : "s"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-300 px-6 py-12 text-center">
              <h2 className="text-base font-semibold text-slate-950">
                {hasFilters ? "No employees match this view" : "No employees yet"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {hasFilters
                  ? "Adjust the search or filters to find staff in this organization."
                  : "Add your first staff member to start using the HR workspace."}
              </p>
              <Link
                className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white"
                href="/employees/new"
              >
                Add employee
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border border-slate-200">
              <div className="grid grid-cols-[1.3fr_1fr_0.8fr_0.8fr_0.8fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 max-lg:hidden">
                <span>Name</span>
                <span>Department</span>
                <span>Type</span>
                <span>Status</span>
                <span>Invite</span>
                <span className="text-right">Action</span>
              </div>
              <div className="divide-y divide-slate-200">
                {employees.map((employee) => (
                  <div
                    className="grid gap-3 px-4 py-4 lg:grid-cols-[1.3fr_1fr_0.8fr_0.8fr_0.8fr_auto] lg:items-center"
                    key={employee.id}
                  >
                    <div className="min-w-0">
                      <Link
                        className="font-medium text-slate-950 hover:underline"
                        href={`/employees/${employee.id}`}
                      >
                        {employee.firstName} {employee.lastName}
                      </Link>
                      <p className="mt-1 text-xs text-slate-500">
                        {employee.employeeNumber}
                        {employee.workEmail ? ` · ${employee.workEmail}` : ""}
                      </p>
                    </div>
                    <p className="text-sm text-slate-600">
                      {employee.department?.name ?? "No department"}
                    </p>
                    <p className="text-sm text-slate-600">
                      {employmentTypeLabels[employee.employmentType]}
                    </p>
                    <span
                      className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass(employee.status)}`}
                    >
                      {statusLabels[employee.status]}
                    </span>
                    <p className="text-sm text-slate-600">
                      {employee.organizationMember
                        ? "Active"
                        : employee.invites[0]?.deliveryStatus === "FAILED"
                          ? "Email failed"
                          : inviteStatus(employee.invites[0])}
                    </p>
                    <div className="flex gap-2 lg:justify-self-end">
                      {!employee.organizationMember ? (
                        <form action={inviteEmployee}>
                          <input name="employeeId" type="hidden" value={employee.id} />
                          <button
                            className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            type="submit"
                          >
                            {employee.invites[0] ? "Resend" : "Invite"}
                          </button>
                        </form>
                      ) : null}
                      <Link
                        className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        href={`/employees/${employee.id}`}
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
