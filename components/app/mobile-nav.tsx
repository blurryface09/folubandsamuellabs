"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appRoutes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile dashboard"
      className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden"
    >
      {appRoutes.map((route) => {
        const active =
          pathname === route.href || pathname.startsWith(`${route.href}/`);

        return (
          <Link
            key={route.href}
            href={route.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950",
            )}
          >
            <route.icon aria-hidden className="h-3.5 w-3.5" />
            {route.label}
            {route.status === "soon" ? (
              <span
                aria-hidden
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  active ? "bg-[#F0C040]" : "bg-amber-400",
                )}
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
