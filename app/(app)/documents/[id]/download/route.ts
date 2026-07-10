import { readFile } from "fs/promises";

import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { db } from "@/lib/db";
import { canAccessEmployeeDocument } from "@/lib/document-authorization";
import { createDocumentDownloadUrl, storagePathForKey } from "@/lib/document-storage";

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

  if (
    !canAccessEmployeeDocument({
      role: session.user.role,
      sessionOrganizationId: session.user.organizationId,
      documentOrganizationId: document.organizationId,
      sessionMemberId: session.user.memberId,
      employeeOrganizationMemberId: document.employee?.organizationMemberId,
    })
  ) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  await writeAuditLog({
    organizationId: session.user.organizationId,
    actorUserId: session.user.id,
    actorMemberId: session.user.memberId,
    action: "document.downloaded",
    entityType: "Document",
    entityId: document.id,
    metadata: {
      employeeId: document.employeeId,
      storageProvider: document.storageProvider,
    },
  });

  if (document.storageProvider === "S3") {
    try {
      const url = await createDocumentDownloadUrl({
        storageProvider: document.storageProvider,
        storageKey: document.storageKey,
        bucket: document.bucket,
      });

      if (!url) {
        return new NextResponse("Signed URL could not be created", { status: 500 });
      }

      return NextResponse.redirect(url);
    } catch {
      return new NextResponse("Signed URL could not be created", { status: 500 });
    }
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
