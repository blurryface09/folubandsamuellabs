import { createEmployee } from "@/app/(app)/employees/actions";
import { EmployeeForm } from "@/app/(app)/employees/employee-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentOrganization } from "@/lib/current-organization";
import { db } from "@/lib/db";

export default async function NewEmployeePage() {
  const organization = await getCurrentOrganization();
  const departments = await db.department.findMany({
    where: { organizationId: organization.id },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      code: true,
    },
  });

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Employee onboarding
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
          Add employee
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Create a tenant-scoped employee record for {organization.name}.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Employee details</CardTitle>
          <CardDescription>
            Capture the core profile fields needed to onboard staff.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeForm
            action={createEmployee}
            cancelHref="/employees"
            departments={departments}
            submitLabel="Create employee"
          />
        </CardContent>
      </Card>
    </section>
  );
}
