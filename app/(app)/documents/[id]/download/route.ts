import { readFile } from "fs/promises";

import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { storagePathForKey } from "@/lib/document-storage";
import { hasMinimumRole } from "@/lib/roles";

type DownloadRouteProps = {
  params: Promise<{ id: string }>;
};

function downloadName(name: string) {
  return name.replace(/["\r\n]/g, "").trim() || "document";
}

export async function GET(_request: Request, { params }: DownloadRouteProps) {
  const session = await auth();

  if (!session?.user?.id || !session.user.organizationId || !session.user.memberId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const document = await db.document.findFirst({
    where: {
      id,
      organizationId: session.user.organizationId,
    },
    include: {
      employee: {
        select: {
          organizationMemberId: true,
        },
      },
    },
  });

  if (!document) {
    return new NextResponse("Not found", { status: 404 });
  }

  const canManageDocuments = hasMinimumRole(
    session.user.role,
    UserRole.HR_MANAGER,
  );
  const ownsDocument =
    document.employee?.organizationMemberId === session.user.memberId;

  if (!canManageDocuments && !ownsDocument) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const body = await readFile(storagePathForKey(document.storageKey));

    return new NextResponse(body, {
      headers: {
        "Content-Disposition": `attachment; filename="${downloadName(document.name)}"`,
        "Content-Length": String(body.byteLength),
        "Content-Type": document.contentType ?? "application/octet-stream",
      },
    });
  } catch {
    return new NextResponse("File not found", { status: 404 });
  }
}
