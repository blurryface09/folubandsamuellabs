import "server-only";

import type { Prisma } from "@prisma/client";

import { db } from "@/lib/db";

export async function writeAuditLog({
  organizationId,
  actorUserId,
  actorMemberId,
  action,
  entityType,
  entityId,
  metadata,
}: {
  organizationId: string;
  actorUserId?: string | null;
  actorMemberId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Prisma.InputJsonValue;
}) {
  await db.auditLog.create({
    data: {
      organizationId,
      actorUserId,
      actorMemberId,
      action,
      entityType,
      entityId,
      metadata,
    },
  });
}
