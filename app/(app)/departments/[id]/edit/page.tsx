import { notFound } from "next/navigation";

import { updateDepartment } from "@/app/(app)/departments/actions";
import { DepartmentForm } from "@/app/(app)/departments/department-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentOrganization, requireRole } from "@/lib/current-organization";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

type EditDepartmentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditDepartmentPage({
  params,
}: EditDepartmentPageProps) {
  await requireRole(UserRole.HR_MANAGER);
  const { id } = await params;
  const organization = await getCurrentOrganization();
  const department = await db.department.findFirst({
    where: {
      id,
      organizationId: organization.id,
    },
  });
  const managers = await db.employee.findMany({
    where: {
      organizationId: organization.id,
      status: {
        in: ["ACTIVE", "ON_LEAVE"],
      },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      employeeNumber: true,
      status: true,
    },
  });

  if (!department) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Department profile
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
          Edit {department.name}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Update department structure inside {organization.name}.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Department details</CardTitle>
          <CardDescription>
            Manager assignments are limited to employees in this organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DepartmentForm
            action={updateDepartment}
            cancelHref={`/departments/${department.id}`}
            department={department}
            managers={managers}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </section>
  );
}
