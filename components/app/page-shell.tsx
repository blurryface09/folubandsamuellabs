import Link from "next/link";
import { ArrowLeft, CircleDashed, Hammer } from "lucide-react";

import type { AppRoute } from "@/lib/navigation";
import { appRoutes } from "@/lib/navigation";

type PageShellProps = {
  title: string;
  description: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
};

export function PageShell({
  title,
  description,
  eyebrow,
  actions,
  children,
}: PageShellProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-2">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            {title}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
        </div>
        {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

type ComingSoonProps = {
  routeHref: string;
  summary: string;
  features: string[];
};

export function ComingSoon({ routeHref, summary, features }: ComingSoonProps) {
  const route = appRoutes.find((item) => item.href === routeHref) as AppRoute;
  const Icon = route.icon;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col items-center px-6 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 ring-1 ring-amber-200">
          <Icon aria-hidden className="h-6 w-6 text-amber-700" />
        </div>
        <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
          <Hammer aria-hidden className="h-3.5 w-3.5" />
          In development
        </span>
        <h2 className="mt-4 text-lg font-semibold text-slate-950">
          {route.label} is coming soon
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">{summary}</p>
      </div>
      <div className="border-t border-slate-200 bg-slate-50/60 px-6 py-6 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Planned for this module
        </p>
        <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700">
              <CircleDashed
                aria-hidden
                className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
              />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            href="/dashboard"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            Back to dashboard
          </Link>
          <Link
            className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            href="/employees"
          >
            Manage employees
          </Link>
        </div>
      </div>
    </div>
  );
}
