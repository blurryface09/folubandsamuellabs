import { hasMinimumRole, type UserRoleName } from "./roles";

export function canAccessEmployeeDocument({
  role,
  sessionOrganizationId,
  documentOrganizationId,
  sessionMemberId,
  employeeOrganizationMemberId,
}: {
  role: UserRoleName;
  sessionOrganizationId: string;
  documentOrganizationId: string;
  sessionMemberId: string;
  employeeOrganizationMemberId?: string | null;
}) {
  if (sessionOrganizationId !== documentOrganizationId) {
    return false;
  }

  if (hasMinimumRole(role, "HR_MANAGER")) {
    return true;
  }

  return employeeOrganizationMemberId === sessionMemberId;
}
