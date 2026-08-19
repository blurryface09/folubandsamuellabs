import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ assignmentId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { assignmentId } = await params;

  const submission = await db.assignmentSubmission.findUnique({
    where: { assignmentId_userId: { assignmentId, userId: session.user.id } },
  });

  return NextResponse.json({ submission });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ assignmentId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { assignmentId } = await params;
  const { content } = await req.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: "Submission content is required" }, { status: 400 });
  }

  const assignment = await db.assignment.findUnique({
    where: { id: assignmentId },
    include: { module: { include: { course: true } } },
  });

  if (!assignment) {
    return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
  }

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: assignment.module.courseId } },
    select: { paymentStatus: true },
  });

  if (enrollment?.paymentStatus !== "COMPLETED") {
    return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 });
  }

  const submission = await db.assignmentSubmission.upsert({
    where: { assignmentId_userId: { assignmentId, userId: session.user.id } },
    update: { content: content.trim(), submittedAt: new Date(), score: null, feedback: null, gradedAt: null, gradedById: null },
    create: { assignmentId, userId: session.user.id, content: content.trim() },
  });

  return NextResponse.json({ submission }, { status: 201 });
}
