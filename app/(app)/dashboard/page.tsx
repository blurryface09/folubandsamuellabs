import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { appRoutes } from "@/lib/navigation";

const metrics = [
  { label: "Employees", value: "0", detail: "Awaiting employee import" },
  { label: "Departments", value: "0", detail: "Create the first department" },
  { label: "Pending Leave", value: "0", detail: "No approval queue yet" },
  { label: "Payroll Runs", value: "0", detail: "Payroll module scaffolded" },
];

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Tenant workspace
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
