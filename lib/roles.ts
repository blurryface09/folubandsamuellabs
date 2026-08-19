export type UserRoleName =
  | "OWNER"
  | "ADMIN"
  | "INSTRUCTOR"
  | "STUDENT";

export const appRoleLabels: Record<UserRoleName, string> = {
  OWNER: "platform_owner",
  ADMIN: "academy_admin",
  INSTRUCTOR: "instructor",
  STUDENT: "student",
};

export type AppRole =
  | "platform_owner"
  | "academy_admin"
  | "instructor"
  | "student";

const roleRank: Record<UserRoleName, number> = {
  OWNER: 4,
  ADMIN: 3,
  INSTRUCTOR: 2,
  STUDENT: 1,
};

export function hasMinimumRole(role: UserRoleName, minimumRole: UserRoleName) {
  return roleRank[role] >= roleRank[minimumRole];
}

export function canManageCourses(role: UserRoleName) {
  return hasMinimumRole(role, "INSTRUCTOR");
}

export function canAdminAcademy(role: UserRoleName) {
  return hasMinimumRole(role, "ADMIN");
}

export function canManagePlatform(role: UserRoleName) {
  return hasMinimumRole(role, "OWNER");
}
