import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const helpRequests = await db.helpRequest.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      message: true,
      preferredContact: true,
      phone: true,
      preferredTime: true,
      status: true,
      adminNote: true,
      createdAt: true,
      user: { select: { name: true, email: true, studentId: true } },
      course: { select: { title: true } },
      module: { select: { title: true } },
    },
  });

  return NextResponse.json({ helpRequests });
}
