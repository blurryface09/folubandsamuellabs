import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

interface QuestionInput {
  question: string;
  options: { text: string; isCorrect: boolean }[];
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ moduleId: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await params;
  const { title, instructions, passingScore, questions } = (await req.json()) as {
    title: string;
    instructions?: string;
    passingScore?: number;
    questions: QuestionInput[];
  };

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return NextResponse.json({ error: "At least one question is required" }, { status: 400 });
  }

  for (const q of questions) {
    if (!q.question?.trim()) {
      return NextResponse.json({ error: "Every question needs text" }, { status: 400 });
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      return NextResponse.json({ error: "Every question needs at least 2 options" }, { status: 400 });
    }
    if (!q.options.some((o) => o.isCorrect)) {
      return NextResponse.json({ error: "Every question needs a correct option marked" }, { status: 400 });
    }
  }

  const last = await db.exam.findFirst({
    where: { moduleId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const exam = await db.exam.create({
    data: {
      moduleId,
      title: title.trim(),
      instructions: instructions?.trim() || null,
      passingScore: passingScore ? Number(passingScore) : 70,
      order: (last?.order ?? 0) + 1,
      questions: {
        create: questions.map((q, qIdx) => ({
          question: q.question.trim(),
          order: qIdx + 1,
          options: {
            create: q.options.map((o, oIdx) => ({
              text: o.text.trim(),
              isCorrect: o.isCorrect,
              order: oIdx + 1,
            })),
          },
        })),
      },
    },
    include: { questions: { include: { options: true } } },
  });

  return NextResponse.json({ exam }, { status: 201 });
}
