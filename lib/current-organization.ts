import "server-only";

import { db } from "@/lib/db";

export const SEEDED_ORGANIZATION_SLUG = "fslabs-demo";

export async function getCurrentOrganization() {
  const organization = await db.organization.findUnique({
    where: { slug: SEEDED_ORGANIZATION_SLUG },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  if (!organization) {
    throw new Error(
      `Seeded organization "${SEEDED_ORGANIZATION_SLUG}" was not found.`,
    );
  }

  return organization;
}
