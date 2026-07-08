import { createDepartment } from "@/app/(app)/departments/actions";
import { DepartmentForm } from "@/app/(app)/departments/department-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentOrganization, requireRole } from "@/lib/current-organization";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export default async function NewDepartmentPage() {
  await requireRole(UserRole.HR_MANAGER);
  const organization = await getCurrentOrganization();
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

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Department setup
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
          Add department
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Create a tenant-scoped department for {organization.name}.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Department details</CardTitle>
          <CardDescription>
            Add the team name, optional code, manager, and description.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DepartmentForm
            action={createDepartment}
            cancelHref="/departments"
            managers={managers}
            submitLabel="Create department"
          />
        </CardContent>
      </Card>
    </section>
  );
}
