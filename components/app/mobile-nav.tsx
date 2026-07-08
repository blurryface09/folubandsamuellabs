import Link from "next/link";

import { appRoutes } from "@/lib/navigation";

export function MobileNav() {
  return (
    <nav
      aria-label="Mobile dashboard"
      className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden"
    >
      {appRoutes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className="whitespace-nowrap rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600"
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
