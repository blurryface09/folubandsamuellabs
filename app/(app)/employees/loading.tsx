import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function EmployeesLoading() {
  return (
    <section className="space-y-6">
      <div className="h-8 w-64 animate-pulse rounded-md bg-slate-200" />
      <Card>
        <CardHeader>
          <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-14 animate-pulse rounded-md bg-slate-100" />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
