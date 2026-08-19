import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ examId: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { examId } = await params;
  await db.exam.delete({ where: { id: examId } });

  return NextResponse.json({ ok: true });
}
