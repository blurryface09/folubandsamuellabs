"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navGroups } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 lg:flex">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-800 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#F0C040] to-[#8B6914] text-sm font-bold text-slate-950">
          FS
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">FSLabs HR</p>
          <p className="truncate text-xs text-slate-400">People workspace</p>
        </div>
      </div>
      <nav aria-label="Dashboard" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.routes.map((route) => {
                const active =
                  pathname === route.href || pathname.startsWith(`${route.href}/`);

                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-100",
                    )}
                  >
                    <route.icon
                      aria-hidden
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active
                          ? "text-[#F0C040]"
                          : "text-slate-500 group-hover:text-slate-300",
                      )}
                    />
                    <span className="flex-1 truncate">{route.label}</span>
                    {route.status === "soon" ? (
                      <span className="rounded-full border border-slate-700 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                        Soon
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="shrink-0 border-t border-slate-800 px-5 py-4">
        <p className="text-xs text-slate-500">Folub &amp; Samuel Labs</p>
        <p className="mt-0.5 text-[11px] text-slate-600">Multi-tenant HR platform</p>
      </div>
    </aside>
  );
}
