import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  LayoutDashboard,
  Settings,
  Users,
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
    label: "Learning",
    routes: [
      {
        href: "/student/dashboard",
        label: "My Courses",
        description: "Your enrolled courses and progress.",
        icon: BookOpen,
        status: "live",
      },
    ],
  },
  {
    label: "Instructor",
    routes: [
      {
        href: "/instructor/courses",
        label: "My Courses",
        description: "Create and manage your courses.",
        icon: BookOpen,
        status: "soon",
      },
      {
        href: "/instructor/students",
        label: "Students",
        description: "View student progress and analytics.",
        icon: Users,
        status: "soon",
      },
    ],
  },
  {
    label: "Admin",
    routes: [
      {
        href: "/admin/academy/courses",
        label: "Courses",
        description: "Manage all courses and content.",
        icon: BookOpen,
        status: "soon",
      },
      {
        href: "/admin/academy/students",
        label: "Students",
        description: "Manage enrollments and access.",
        icon: Users,
        status: "soon",
      },
      {
        href: "/admin/academy/settings",
        label: "Settings",
        description: "Academy configuration and billing.",
        icon: Settings,
        status: "soon",
      },
    ],
  },
];

export const appRoutes: AppRoute[] = navGroups.flatMap((group) => group.routes);
