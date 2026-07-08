import { Button } from "@/components/ui/button";

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">
            Folub & Samuel Labs
          </p>
          <p className="truncate text-xs text-slate-500">
            Organization context: pending auth connection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="hidden sm:inline-flex">
            Invite
          </Button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
            FS
          </div>
        </div>
      </div>
    </header>
  );
}
