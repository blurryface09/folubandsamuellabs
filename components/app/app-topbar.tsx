import { logoutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export async function AppTopbar() {
  const session = await auth();
  const initials =
    session?.user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "HR";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">
            {session?.user?.organizationName ?? "Workspace"}
          </p>
          <p className="truncate text-xs text-slate-500">
            {session?.user?.email} · {session?.user?.appRole}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <form action={logoutAction}>
            <Button variant="secondary" type="submit">
              Logout
            </Button>
          </form>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
