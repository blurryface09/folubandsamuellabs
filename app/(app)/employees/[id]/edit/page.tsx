import { notFound } from "next/navigation";

import { updateEmployee } from "@/app/(app)/employees/actions";
import { EmployeeForm } from "@/app/(app)/employees/employee-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentOrganization, requireRole } from "@/lib/current-organization";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

type EditEmployeePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditEmployeePage({ params }: EditEmployeePageProps) {
  await requireRole(UserRole.HR_MANAGER);
  const { id } = await params;
  const organization = await getCurrentOrganization();
  const [employee, departments] = await Promise.all([
    db.employee.findFirst({
      where: {
        id,
        organizationId: organization.id,
      },
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
  ]);

  if (!employee) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Employee profile
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
          Edit {employee.firstName} {employee.lastName}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Update this employee record inside {organization.name}.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Employee details</CardTitle>
          <CardDescription>
            Changes are saved only for the active organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeForm
            action={updateEmployee}
            cancelHref={`/employees/${employee.id}`}
            departments={departments}
            employee={employee}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </section>
  );
}
