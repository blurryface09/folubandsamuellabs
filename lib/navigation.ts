export type AppRoute = {
  href: string;
  label: string;
  description: string;
};

export const appRoutes: AppRoute[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Workforce overview and operational signals.",
  },
  {
    href: "/employees",
    label: "Employees",
    description: "Employee records, lifecycle status, and assignments.",
  },
  {
    href: "/departments",
    label: "Departments",
    description: "Teams, reporting lines, and department ownership.",
  },
  {
    href: "/attendance",
    label: "Attendance",
    description: "Clock-ins, exceptions, shifts, and timesheet summaries.",
  },
  {
    href: "/leave",
    label: "Leave",
    description: "Leave policies, balances, approvals, and calendars.",
  },
  {
    href: "/documents",
    label: "Documents",
    description: "Tenant-scoped HR files and employee document records.",
  },
  {
    href: "/payroll",
    label: "Payroll",
    description: "Compensation, payroll runs, payslips, and deductions.",
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Organization settings, roles, billing, and integrations.",
  },
];
