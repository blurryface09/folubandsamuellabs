export const roles = ["OWNER", "ADMIN", "INSTRUCTOR", "STUDENT"] as const;

export type Role = (typeof roles)[number];

export type Permission =
  | "academy:manage"
  | "courses:manage"
  | "courses:teach"
  | "enrollments:manage"
  | "certificates:issue"
  | "analytics:view"
  | "students:manage";

const rolePermissions: Record<Role, Permission[]> = {
  OWNER: [
    "academy:manage",
    "courses:manage",
    "courses:teach",
    "enrollments:manage",
    "certificates:issue",
    "analytics:view",
    "students:manage",
  ],
  ADMIN: [
    "courses:manage",
    "enrollments:manage",
    "certificates:issue",
    "analytics:view",
    "students:manage",
  ],
  INSTRUCTOR: [
    "courses:teach",
    "certificates:issue",
    "analytics:view",
  ],
  STUDENT: [],
};

export function can(role: Role, permission: Permission) {
  return rolePermissions[role].includes(permission);
}
