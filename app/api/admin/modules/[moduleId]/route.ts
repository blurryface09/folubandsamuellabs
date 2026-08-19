import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ moduleId: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await params;
  const { title, isPublished } = await req.json();

  const data: { title?: string; isPublished?: boolean; publishedAt?: Date | null } = {};
  if (typeof title === "string" && title.trim()) {
    data.title = title.trim();
  }
  if (typeof isPublished === "boolean") {
    data.isPublished = isPublished;
    data.publishedAt = isPublished ? new Date() : null;
  }

  const updatedModule = await db.module.update({ where: { id: moduleId }, data });
  return NextResponse.json({ module: updatedModule });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ moduleId: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await params;
  await db.module.delete({ where: { id: moduleId } });

  return NextResponse.json({ ok: true });
}
