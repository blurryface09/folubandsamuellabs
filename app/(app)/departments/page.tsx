import { Prisma } from "@prisma/client";
import Link from "next/link";

import { DepartmentToast } from "@/app/(app)/departments/department-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentOrganization } from "@/lib/current-organization";
import { db } from "@/lib/db";

type DepartmentsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function paramValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function DepartmentsPage({
  searchParams,
}: DepartmentsPageProps) {
  const params = (await searchParams) ?? {};
  const organization = await getCurrentOrganization();
  const query = paramValue(params, "q")?.trim() ?? "";
  const toast = paramValue(params, "toast");
  const toastType = paramValue(params, "toastType");

  const where: Prisma.DepartmentWhereInput = {
    organizationId: organization.id,
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { code: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const departments = await db.department.findMany({
    where,
    include: {
      manager: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeNumber: true,
        },
      },
      _count: {
        select: {
          employees: true,
        },
      },
    },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
  });
  const totalDepartments = await db.department.count({
    where: { organizationId: organization.id },
  });

  return (
    <section className="space-y-6">
      <DepartmentToast message={toast} type={toastType} />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {organization.name}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
            Departments
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Create teams, assign managers, and keep department structure ready
            for staff onboarding.
          </p>
        </div>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          href="/departments/new"
        >
          Add department
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find departments</CardTitle>
          <CardDescription>
            Search by department name or code within the current organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3 sm:flex-row" method="get">
            <input
              className="h-10 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              defaultValue={query}
              name="q"
              placeholder="Search name or code"
            />
            <button
              className="h-10 rounded-md bg-slate-950 px-4 text-sm font-medium text-white"
              type="submit"
            >
              Search
            </button>
            {query ? (
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-700"
                href="/departments"
              >
                Reset
              </Link>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department directory</CardTitle>
          <CardDescription>
            {departments.length} shown of {totalDepartments} department
            {totalDepartments === 1 ? "" : "s"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {departments.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-300 px-6 py-12 text-center">
              <h2 className="text-base font-semibold text-slate-950">
                {query ? "No departments match this search" : "No departments yet"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {query
                  ? "Try a different name or code."
                  : "Create the first department before onboarding more staff."}
              </p>
              <Link
                className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white"
                href="/departments/new"
              >
                Add department
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {departments.map((department) => (
                <Link
                  className="grid gap-4 rounded-md border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50 md:grid-cols-[1fr_1fr_auto]"
                  href={`/departments/${department.id}`}
                  key={department.id}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-950">{department.name}</p>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                          department.isActive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      >
                        {department.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {department.code ?? "No code"}
                    </p>
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>
                      Manager:{" "}
                      {department.manager
                        ? `${department.manager.firstName} ${department.manager.lastName}`
                        : "Unassigned"}
                    </p>
                    <p className="mt-1 text-slate-500">
                      {department._count.employees} employee
                      {department._count.employees === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 md:justify-self-end">
                    View
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
