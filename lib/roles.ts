import { UserRole } from "@prisma/client";

export const appRoleLabels: Record<UserRole, string> = {
  OWNER: "company_admin",
  ADMIN: "company_admin",
  HR_MANAGER: "hr_officer",
  MANAGER: "team_lead",
  EMPLOYEE: "employee",
};

export type AppRole =
  | "company_admin"
  | "hr_officer"
  | "team_lead"
  | "employee";

const roleRank: Record<UserRole, number> = {
  OWNER: 4,
  ADMIN: 4,
  HR_MANAGER: 3,
  MANAGER: 2,
  EMPLOYEE: 1,
};

export function hasMinimumRole(role: UserRole, minimumRole: UserRole) {
  return roleRank[role] >= roleRank[minimumRole];
}

export function canManageWorkspace(role: UserRole) {
  return hasMinimumRole(role, UserRole.HR_MANAGER);
}
