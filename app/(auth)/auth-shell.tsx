import Link from "next/link";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#e2e8f0,transparent_34rem),linear-gradient(180deg,#f8fafc,#eef2f7)] px-4 py-10 text-slate-950 sm:py-16">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <Link className="mb-8 flex items-center gap-3 self-center text-slate-950" href="/">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
            FS
          </span>
          <span>
            <span className="block text-sm font-semibold">Folub & Samuel Labs</span>
            <span className="block text-xs text-slate-500">HR workspace</span>
          </span>
        </Link>
        <div className="rounded-2xl border border-white/80 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur sm:p-8">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-normal text-slate-950">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
