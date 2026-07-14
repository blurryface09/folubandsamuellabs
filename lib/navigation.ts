import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarClock,
  CalendarDays,
  FolderOpen,
  LayoutDashboard,
  Settings,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

export type AppRoute = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  status: "live" | "soon";
};

export type NavGroup = {
  label: string;
  routes: AppRoute[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    routes: [
      {
        href: "/dashboard",
        label: "Dashboard",
        description: "Workforce overview and operational signals.",
        icon: LayoutDashboard,
        status: "live",
      },
      {
        href: "/my-profile",
        label: "My Profile",
        description: "Personal employee portal for the signed-in staff member.",
        icon: UserRound,
        status: "live",
      },
    ],
  },
  {
    label: "Workforce",
    routes: [
      {
        href: "/employees",
        label: "Employees",
        description: "Employee records, lifecycle status, and assignments.",
        icon: Users,
        status: "live",
      },
      {
        href: "/departments",
        label: "Departments",
        description: "Teams, reporting lines, and department ownership.",
        icon: Building2,
        status: "live",
      },
      {
        href: "/documents",
        label: "Documents",
        description: "Tenant-scoped HR files and employee document records.",
        icon: FolderOpen,
        status: "live",
      },
    ],
  },
  {
    label: "Operations",
    routes: [
      {
        href: "/attendance",
        label: "Attendance",
        description: "Clock-ins, exceptions, shifts, and timesheet summaries.",
        icon: CalendarClock,
        status: "soon",
      },
      {
        href: "/leave",
        label: "Leave",
        description: "Leave policies, balances, approvals, and calendars.",
        icon: CalendarDays,
        status: "soon",
      },
      {
        href: "/payroll",
        label: "Payroll",
        description: "Compensation, payroll runs, payslips, and deductions.",
        icon: Wallet,
        status: "soon",
      },
    ],
  },
  {
    label: "Organization",
    routes: [
      {
        href: "/settings",
        label: "Settings",
        description: "Organization settings, roles, billing, and integrations.",
        icon: Settings,
        status: "soon",
      },
    ],
  },
];

export const appRoutes: AppRoute[] = navGroups.flatMap((group) => group.routes);
