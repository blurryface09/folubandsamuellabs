import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentMembership } from "@/lib/current-organization";
import { db } from "@/lib/db";
import { appRoutes } from "@/lib/navigation";
import { resendVerificationAction } from "@/app/(auth)/verify-actions";

type DashboardPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function paramValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const [membership, params] = await Promise.all([
    getCurrentMembership(),
    searchParams ?? Promise.resolve({}),
  ]);
  const [employees, departments, pendingLeave, payrollRuns] = await Promise.all([
    db.employee.count({
      where: { organizationId: membership.organizationId },
    }),
    db.department.count({
      where: { organizationId: membership.organizationId },
    }),
    db.leaveRequest.count({
      where: { organizationId: membership.organizationId, status: "PENDING" },
    }),
    db.payrollRecord.count({
      where: { organizationId: membership.organizationId },
    }),
  ]);

  const metrics = [
    { label: "Employees", value: String(employees), detail: "Tenant-scoped staff records" },
    { label: "Departments", value: String(departments), detail: "Active departments" },
    { label: "Pending Leave", value: String(pendingLeave), detail: "No leave workflows yet" },
    { label: "Payroll Records", value: String(payrollRuns), detail: "Payroll module pending" },
  ];
  const error = paramValue(params, "error");
  const toast = paramValue(params, "toast");

  return (
    <section className="space-y-6">
      {error === "AccessDenied" ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          You do not have permission to perform that action.
        </div>
      ) : null}
      {error === "EmailVerificationRequired" ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Verify your email before managing staff, documents, or organization settings.
        </div>
      ) : null}
      {toast ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {toast}
        </div>
      ) : null}
      {!membership.user.emailVerified ? (
        <div className="flex flex-col gap-3 rounded-md border border-amber-200 bg-white px-4 py-4 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-slate-950">Email verification required</p>
            <p className="mt-1 text-slate-500">
              {membership.user.email} is not verified yet.
            </p>
          </div>
          <form action={resendVerificationAction}>
            <button
              className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white"
              type="submit"
            >
              Resend verification
            </button>
          </form>
        </div>
      ) : null}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {membership.organization.name}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
          HR operations dashboard
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          A clean starting point for organization-scoped HR workflows, RBAC,
          employee records, attendance, leave, documents, and payroll.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-3xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">{metric.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Module map</CardTitle>
          <CardDescription>
            Initial routes are present and ready for feature work.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {appRoutes.map((route) => (
              <div key={route.href} className="rounded-md border border-slate-200 p-4">
                <p className="text-sm font-medium text-slate-950">{route.label}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {route.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
