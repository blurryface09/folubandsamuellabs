import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentMembership } from "@/lib/current-organization";
import { db } from "@/lib/db";

function display(value?: string | null) {
  return value && value.trim().length > 0 ? value : "Not set";
}

function formatDate(value: Date | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(value);
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
    },
  });

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {membership.organization.name}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
          My profile
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Your employee record and account information.
        </p>
      </div>

      {!employee ? (
        <Card>
          <CardHeader>
            <CardTitle>No employee profile linked</CardTitle>
            <CardDescription>
              Your account is active, but no employee record has been linked yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-600">
              Ask your company admin or HR officer to connect your staff profile.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {employee.firstName} {employee.lastName}
            </CardTitle>
            <CardDescription>{employee.employeeNumber}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
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
              ].map(([label, value]) => (
                <div className="rounded-md border border-slate-200 p-4" key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {label}
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-slate-950">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
