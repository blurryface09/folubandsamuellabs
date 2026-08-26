import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { status, adminNote } = await req.json();

  const validStatuses = ["PENDING", "CONTACTED", "RESOLVED"];
  const data: { status?: "PENDING" | "CONTACTED" | "RESOLVED"; adminNote?: string | null } = {};
  if (status !== undefined) {
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = status;
  }
  if (adminNote !== undefined) {
    data.adminNote = adminNote?.trim() || null;
  }

  const helpRequest = await db.helpRequest.update({ where: { id }, data });

  return NextResponse.json({ helpRequest });
}
