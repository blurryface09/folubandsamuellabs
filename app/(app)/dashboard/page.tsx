import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  FolderOpen,
  MailWarning,
  Plus,
  ShieldAlert,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentMembership } from "@/lib/current-organization";
import { db } from "@/lib/db";
import { navGroups } from "@/lib/navigation";
import { canManageWorkspace } from "@/lib/roles";
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

  const error = paramValue(params, "error");
  const toast = paramValue(params, "toast");
  const firstName = membership.user.name?.split(" ")[0];
  const isManager = canManageWorkspace(membership.role);

  const metrics = [
    {
      label: "Employees",
      value: employees,
      icon: Users,
      href: isManager ? "/employees" : null,
      detail: "Staff records in this workspace",
    },
    {
      label: "Departments",
      value: departments,
      icon: Building2,
      href: isManager ? "/departments" : null,
      detail: "Active teams and units",
    },
    {
      label: "Pending leave",
      value: pendingLeave,
      icon: CalendarDays,
      href: "/leave",
      detail: "Requests awaiting a decision",
    },
    {
      label: "Payroll records",
      value: payrollRuns,
      icon: Wallet,
      href: null,
      detail: "Payroll module coming soon",
      soon: true,
    },
  ];

  const quickActions = [
    ...(isManager
      ? [
          { label: "Add employee", href: "/employees/new", icon: Plus },
          { label: "New department", href: "/departments/new", icon: Building2 },
          { label: "View documents", href: "/documents", icon: FolderOpen },
        ]
      : []),
    { label: "My profile", href: "/my-profile", icon: UserRound },
  ];

  const modules = navGroups
    .flatMap((group) => group.routes)
    .filter((route) => route.href !== "/dashboard");

  return (
    <section className="space-y-8">
      {error === "AccessDenied" ? (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <ShieldAlert aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          You do not have permission to perform that action.
        </div>
      ) : null}
      {error === "EmailVerificationRequired" ? (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          Verify your email before managing staff, documents, or organization settings.
        </div>
      ) : null}
      {toast ? (
        <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          {toast}
        </div>
      ) : null}
      {!membership.user.emailVerified ? (
        <div className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-white px-4 py-4 text-sm shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <MailWarning aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div>
              <p className="font-medium text-slate-950">Email verification required</p>
              <p className="mt-1 text-slate-500">
                {membership.user.email} is not verified yet.
              </p>
            </div>
          </div>
          <form action={resendVerificationAction}>
            <button
              className="inline-flex h-9 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800"
              type="submit"
            >
              Resend verification
            </button>
          </form>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {membership.organization.name}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Here is what is happening across your workforce today.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-950"
            >
              <action.icon aria-hidden className="h-4 w-4 text-slate-500" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const body = (
            <>
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                  <metric.icon aria-hidden className="h-4.5 w-4.5 text-slate-600" />
                </div>
                {metric.soon ? (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                    Coming soon
                  </span>
                ) : metric.href ? (
                  <ArrowUpRight aria-hidden className="h-4 w-4 text-slate-400" />
                ) : null}
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                {metric.value}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600">{metric.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{metric.detail}</p>
            </>
          );

          return metric.href ? (
            <Link
              key={metric.label}
              href={metric.href}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50/50"
            >
              {body}
            </Link>
          ) : (
            <div
              key={metric.label}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              {body}
            </div>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace modules</CardTitle>
          <CardDescription>
            What is live today and what is on the roadmap.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {modules.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="group flex items-start gap-3 rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50/50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <route.icon aria-hidden className="h-4 w-4 text-slate-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-950">{route.label}</p>
                    {route.status === "soon" ? (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                        Coming soon
                      </span>
                    ) : (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                        Live
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {route.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
