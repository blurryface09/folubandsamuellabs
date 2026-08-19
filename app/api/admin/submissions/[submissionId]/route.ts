import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ submissionId: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { submissionId } = await params;
  const { score, feedback } = await req.json();

  if (typeof score !== "number" || score < 0) {
    return NextResponse.json({ error: "A valid score is required" }, { status: 400 });
  }

  const submission = await db.assignmentSubmission.update({
    where: { id: submissionId },
    data: {
      score,
      feedback: feedback?.trim() || null,
      gradedAt: new Date(),
      gradedById: admin.userId,
    },
  });

  return NextResponse.json({ submission });
}
