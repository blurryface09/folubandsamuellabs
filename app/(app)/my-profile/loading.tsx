import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function MyProfileLoading() {
  return (
    <section className="space-y-6">
      <div className="h-8 w-64 animate-pulse rounded-md bg-slate-200" />
      <Card>
        <CardHeader>
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-md bg-slate-100" />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
