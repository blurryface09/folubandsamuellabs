import { EmployeeStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { deactivateDepartment } from "@/app/(app)/departments/actions";
import { DepartmentToast } from "@/app/(app)/departments/department-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentOrganization } from "@/lib/current-organization";
import { db } from "@/lib/db";

type DepartmentDetailsPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function paramValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value: Date | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(value);
}

const activeEmployeeStatuses: EmployeeStatus[] = [
  EmployeeStatus.ACTIVE,
  EmployeeStatus.ON_LEAVE,
];

export default async function DepartmentDetailsPage({
  params,
  searchParams,
}: DepartmentDetailsPageProps) {
  const { id } = await params;
  const queryParams = (await searchParams) ?? {};
  const organization = await getCurrentOrganization();
  const department = await db.department.findFirst({
    where: {
      id,
      organizationId: organization.id,
    },
    include: {
      manager: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeNumber: true,
          workEmail: true,
        },
      },
      employees: {
        orderBy: [{ status: "asc" }, { lastName: "asc" }, { firstName: "asc" }],
        select: {
          id: true,
          employeeNumber: true,
          firstName: true,
          lastName: true,
          workEmail: true,
          jobTitle: true,
          status: true,
          employmentType: true,
        },
      },
    },
  });

  if (!department) {
    notFound();
  }

  const activeEmployees = department.employees.filter((employee) =>
    activeEmployeeStatuses.includes(employee.status),
  );

  return (
    <section className="space-y-6">
      <DepartmentToast
        message={paramValue(queryParams, "toast")}
        type={paramValue(queryParams, "toastType")}
      />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Department profile
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
            {department.name}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {department.code ?? "No code"} ·{" "}
            {department.isActive ? "Active" : "Inactive"}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            href="/departments"
          >
            Back
          </Link>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800"
            href={`/departments/${department.id}/edit`}
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Department details</CardTitle>
            <CardDescription>
              Tenant-scoped department information for {organization.name}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                ["Code", department.code ?? "Not set"],
                ["Status", department.isActive ? "Active" : "Inactive"],
                ["Created", formatDate(department.createdAt)],
                ["Deactivated", formatDate(department.deletedAt)],
              ].map(([label, value]) => (
                <div className="rounded-md border border-slate-200 p-4" key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {label}
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-slate-950">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 rounded-md border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {department.description ?? "No description yet."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manager</CardTitle>
            <CardDescription>
              Assign or change the manager from the edit page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-md border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Current manager
              </p>
              <p className="mt-2 text-sm font-medium text-slate-950">
                {department.manager
                  ? `${department.manager.firstName} ${department.manager.lastName}`
                  : "Unassigned"}
              </p>
              {department.manager?.workEmail ? (
                <p className="mt-1 text-xs text-slate-500">
                  {department.manager.workEmail}
                </p>
              ) : null}
            </div>
            <form action={deactivateDepartment}>
              <input name="id" type="hidden" value={department.id} />
              <Button
                className="w-full border-red-200 text-red-700 hover:bg-red-50"
                disabled={!department.isActive}
                type="submit"
                variant="secondary"
              >
                {department.isActive ? "Deactivate department" : "Department inactive"}
              </Button>
              {activeEmployees.length > 0 ? (
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Move {activeEmployees.length} active employee
                  {activeEmployees.length === 1 ? "" : "s"} before deactivation.
                </p>
              ) : null}
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employees in this department</CardTitle>
          <CardDescription>
            {department.employees.length} employee
            {department.employees.length === 1 ? "" : "s"} currently linked.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {department.employees.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-300 px-6 py-10 text-center">
              <h2 className="text-base font-semibold text-slate-950">
                No employees assigned
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Assign employees to this department from their employee profile.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border border-slate-200">
              <div className="divide-y divide-slate-200">
                {department.employees.map((employee) => (
                  <Link
                    className="grid gap-2 px-4 py-4 transition-colors hover:bg-slate-50 md:grid-cols-[1fr_1fr_auto]"
                    href={`/employees/${employee.id}`}
                    key={employee.id}
                  >
                    <div>
                      <p className="font-medium text-slate-950">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {employee.employeeNumber}
                        {employee.workEmail ? ` · ${employee.workEmail}` : ""}
                      </p>
                    </div>
                    <p className="text-sm text-slate-600">
                      {employee.jobTitle ?? "No job title"}
                    </p>
                    <span className="text-sm font-medium text-slate-700 md:justify-self-end">
                      {employee.status.replaceAll("_", " ")}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
