import { LogOut } from "lucide-react";

import { logoutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

const roleLabels: Record<string, string> = {
  company_admin: "Company Admin",
  hr_officer: "HR Officer",
  team_lead: "Team Lead",
  employee: "Employee",
};

export async function AppTopbar() {
  const session = await auth();
  const initials =
    session?.user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "HR";
  const roleLabel = session?.user?.appRole
    ? (roleLabels[session.user.appRole] ?? session.user.appRole)
    : null;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#F0C040] to-[#8B6914] text-xs font-bold text-slate-950 lg:hidden">
            FS
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              {session?.user?.organizationName ?? "Workspace"}
            </p>
            <p className="truncate text-xs text-slate-500">
              {session?.user?.email}
            </p>
          </div>
          {roleLabel ? (
            <span className="hidden shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 sm:inline-flex">
              {roleLabel}
            </span>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <form action={logoutAction}>
            <Button variant="ghost" type="submit" className="h-9 px-3">
              <LogOut aria-hidden className="h-4 w-4" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </form>
          <div
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white"
          >
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
