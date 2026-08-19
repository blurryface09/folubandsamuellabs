import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const submissions = await db.assignmentSubmission.findMany({
    orderBy: { submittedAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      assignment: {
        select: {
          title: true,
          type: true,
          maxScore: true,
          module: { select: { title: true, course: { select: { title: true } } } },
        },
      },
    },
  });

  return NextResponse.json({ submissions });
}
