import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function MyProfileLoading() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
        <div className="h-8 w-48 animate-pulse rounded-md bg-slate-200" />
        <div className="h-4 w-72 animate-pulse rounded bg-slate-100" />
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="h-5 w-44 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-56 animate-pulse rounded bg-slate-100" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
