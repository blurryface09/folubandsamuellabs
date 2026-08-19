import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courseId = req.nextUrl.searchParams.get("courseId");
    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
      select: {
        id: true,
        progress: { where: { completedAt: { not: null } }, select: { lessonId: true } },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ completedLessonIds: [] });
    }

    return NextResponse.json({
      completedLessonIds: enrollment.progress.map((p) => p.lessonId),
    });
  } catch (error) {
    console.error("Get progress error:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, lessonId, completed } = await req.json();
    if (!courseId || !lessonId) {
      return NextResponse.json({ error: "Missing courseId or lessonId" }, { status: 400 });
    }

    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
      select: { id: true },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 });
    }

    const lesson = await db.lesson.findUnique({ where: { id: lessonId }, select: { id: true } });
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const progress = await db.studentProgress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
      update: { completedAt: completed === false ? null : new Date() },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        completedAt: completed === false ? null : new Date(),
      },
    });

    return NextResponse.json({ ok: true, completedAt: progress.completedAt });
  } catch (error) {
    console.error("Update progress error:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
