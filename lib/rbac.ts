export const roles = ["OWNER", "ADMIN", "HR_MANAGER", "MANAGER", "EMPLOYEE"] as const;

export type Role = (typeof roles)[number];

export type Permission =
  | "organization:manage"
  | "employees:read"
  | "employees:write"
  | "attendance:manage"
  | "leave:approve"
  | "documents:manage"
  | "payroll:manage"
  | "settings:manage";

const rolePermissions: Record<Role, Permission[]> = {
  OWNER: [
    "organization:manage",
    "employees:read",
    "employees:write",
    "attendance:manage",
    "leave:approve",
    "documents:manage",
    "payroll:manage",
    "settings:manage",
  ],
  ADMIN: [
    "employees:read",
    "employees:write",
    "attendance:manage",
    "leave:approve",
    "documents:manage",
    "payroll:manage",
    "settings:manage",
  ],
  HR_MANAGER: [
    "employees:read",
    "employees:write",
    "attendance:manage",
    "leave:approve",
    "documents:manage",
  ],
  MANAGER: ["employees:read", "attendance:manage", "leave:approve"],
  EMPLOYEE: ["employees:read"],
};

export function can(role: Role, permission: Permission) {
  return rolePermissions[role].includes(permission);
}
