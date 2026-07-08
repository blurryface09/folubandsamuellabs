import Link from "next/link";

import { appRoutes } from "@/lib/navigation";

export function AppSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <div>
          <p className="text-sm font-semibold text-slate-950">FSLabs HR</p>
          <p className="text-xs text-slate-500">Multi-tenant workspace</p>
        </div>
      </div>
      <nav aria-label="Dashboard" className="space-y-1 p-4">
        {appRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
