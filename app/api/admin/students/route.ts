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
      examAttempts: {
        select: { examId: true, score: true, passed: true },
        orderBy: { submittedAt: "desc" },
      },
      enrollments: {
        where: { paymentStatus: "COMPLETED" },
        select: {
          enrolledAt: true,
          course: {
            select: {
              title: true,
              modules: {
                where: { isPublished: true },
                orderBy: { order: "asc" },
                select: {
                  id: true,
                  title: true,
                  order: true,
                  lessons: { select: { id: true } },
                  exams: { select: { id: true, passingScore: true } },
                },
              },
            },
          },
          progress: {
            where: { completedAt: { not: null } },
            select: { lessonId: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const shaped = students.map((s) => {
    const completedLessonIds = new Set<string>();
    for (const e of s.enrollments) {
      for (const p of e.progress) completedLessonIds.add(p.lessonId);
    }
    const bestAttemptByExam = new Map<string, { score: number; passed: boolean }>();
    for (const a of s.examAttempts) {
      const existing = bestAttemptByExam.get(a.examId);
      if (!existing || a.score > existing.score) bestAttemptByExam.set(a.examId, { score: a.score, passed: a.passed });
    }

    return {
      id: s.id,
      name: s.name,
      email: s.email,
      studentId: s.studentId,
      createdAt: s.createdAt,
      enrollments: s.enrollments.map((e) => ({
        enrolledAt: e.enrolledAt,
        course: {
          title: e.course.title,
          modules: e.course.modules.map((m) => ({
            title: m.title,
            order: m.order,
            lessonsCompleted: m.lessons.filter((l) => completedLessonIds.has(l.id)).length,
            lessonsTotal: m.lessons.length,
            exam: m.exams[0]
              ? {
                  attempted: bestAttemptByExam.has(m.exams[0].id),
                  passed: bestAttemptByExam.get(m.exams[0].id)?.passed ?? false,
                  score: bestAttemptByExam.get(m.exams[0].id)?.score ?? null,
                  passingScore: m.exams[0].passingScore,
                }
              : null,
          })),
        },
      })),
    };
  });

  return NextResponse.json({ students: shaped });
}
