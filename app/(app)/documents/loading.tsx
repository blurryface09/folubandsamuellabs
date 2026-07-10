import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DocumentsLoading() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <div className="h-4 w-36 rounded bg-slate-200" />
        <div className="h-8 w-48 rounded bg-slate-200" />
        <div className="h-4 w-full max-w-xl rounded bg-slate-200" />
      </div>
      <Card>
        <CardHeader>
          <div className="h-5 w-44 rounded bg-slate-200" />
          <div className="h-4 w-72 rounded bg-slate-200" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[0, 1, 2].map((item) => (
            <div className="h-20 rounded-md border border-slate-200 bg-slate-50" key={item} />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
