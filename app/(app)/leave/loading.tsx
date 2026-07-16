export default function LeaveLoading() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-40 animate-pulse rounded-md bg-slate-200" />
        <div className="h-4 w-80 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-lg bg-slate-100" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
        <div className="h-96 animate-pulse rounded-lg bg-slate-100" />
        <div className="space-y-6">
          <div className="h-40 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-40 animate-pulse rounded-lg bg-slate-100" />
        </div>
      </div>
    </section>
  );
}
