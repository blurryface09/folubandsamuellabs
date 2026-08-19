import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ examId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { examId } = await params;

  const attempts = await db.examAttempt.findMany({
    where: { examId, userId: session.user.id },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json({ attempts });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ examId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { examId } = await params;
  const { answers } = (await req.json()) as { answers: { questionId: string; selectedOptionId: string }[] };

  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ error: "Answers are required" }, { status: 400 });
  }

  const exam = await db.exam.findUnique({
    where: { id: examId },
    include: {
      module: { select: { courseId: true } },
      questions: { include: { options: true } },
    },
  });

  if (!exam) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: exam.module.courseId } },
    select: { paymentStatus: true },
  });

  if (enrollment?.paymentStatus !== "COMPLETED") {
    return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 });
  }

  let correctCount = 0;
  const answerRecords: { questionId: string; selectedOptionId: string; isCorrect: boolean }[] = [];

  for (const question of exam.questions) {
    const submitted = answers.find((a) => a.questionId === question.id);
    if (!submitted) continue;

    const option = question.options.find((o) => o.id === submitted.selectedOptionId);
    const isCorrect = Boolean(option?.isCorrect);
    if (isCorrect) correctCount++;

    answerRecords.push({
      questionId: question.id,
      selectedOptionId: submitted.selectedOptionId,
      isCorrect,
    });
  }

  const score = Math.round((correctCount / exam.questions.length) * 100);
  const passed = score >= exam.passingScore;

  const attempt = await db.examAttempt.create({
    data: {
      examId,
      userId: session.user.id,
      score,
      passed,
      answers: { create: answerRecords },
    },
  });

  return NextResponse.json({ attempt: { ...attempt, totalQuestions: exam.questions.length, correctCount } }, { status: 201 });
}
