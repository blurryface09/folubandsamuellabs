import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const students = await db.user.findMany({
    where: { isPlatformAdmin: false },
    select: {
      id: true,
      name: true,
      email: true,
      studentId: true,
      createdAt: true,
      enrollments: {
        where: { paymentStatus: "COMPLETED" },
        select: {
          enrolledAt: true,
          course: { select: { title: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ students });
}
