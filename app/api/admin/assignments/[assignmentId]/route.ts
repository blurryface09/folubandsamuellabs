import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ assignmentId: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { assignmentId } = await params;
  await db.assignment.delete({ where: { id: assignmentId } });

  return NextResponse.json({ ok: true });
}
