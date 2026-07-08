import type { NextRequest } from "next/server";

export const ORGANIZATION_HEADER = "x-organization-id";

export type TenantContext = {
  organizationId: string;
  slug?: string;
};

export function getTenantFromRequest(request: NextRequest): TenantContext | null {
  const organizationId = request.headers.get(ORGANIZATION_HEADER);
  const slug = request.cookies.get("organizationSlug")?.value;

  if (!organizationId) {
    return null;
  }

  return { organizationId, slug };
}

export function requireOrganizationId(organizationId?: string | null) {
  if (!organizationId) {
    throw new Error("Missing organizationId for tenant-scoped operation.");
  }

  return organizationId;
}
