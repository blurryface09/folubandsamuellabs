import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { appRoutes } from "@/lib/navigation";

type PageShellProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          HR SaaS foundation
        </p>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
          {title}
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {children ?? (
        <Card>
          <CardHeader>
            <CardTitle>{title} module</CardTitle>
            <CardDescription>
              This route is scaffolded for tenant-aware feature development.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {appRoutes.slice(0, 4).map((route) => (
                <div key={route.href} className="rounded-md border border-slate-200 p-4">
                  <p className="text-sm font-medium text-slate-950">{route.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {route.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
