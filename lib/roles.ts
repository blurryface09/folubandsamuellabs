export type UserRoleName =
  | "OWNER"
  | "ADMIN"
  | "HR_MANAGER"
  | "MANAGER"
  | "EMPLOYEE";

export const appRoleLabels: Record<UserRoleName, string> = {
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

const roleRank: Record<UserRoleName, number> = {
  OWNER: 4,
  ADMIN: 4,
  HR_MANAGER: 3,
  MANAGER: 2,
  EMPLOYEE: 1,
};

export function hasMinimumRole(role: UserRoleName, minimumRole: UserRoleName) {
  return roleRank[role] >= roleRank[minimumRole];
}

export function canManageWorkspace(role: UserRoleName) {
  return hasMinimumRole(role, "HR_MANAGER");
}
