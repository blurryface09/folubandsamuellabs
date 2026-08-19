import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await params;

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
    select: { paymentStatus: true },
  });

  if (enrollment?.paymentStatus !== "COMPLETED") {
    return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 });
  }

  const modules = await db.module.findMany({
    where: { courseId, isPublished: true },
    orderBy: { order: "asc" },
    include: {
      lessons: { orderBy: { order: "asc" } },
      assignments: { orderBy: { order: "asc" } },
      exams: {
        orderBy: { order: "asc" },
        include: {
          questions: {
            orderBy: { order: "asc" },
            include: { options: { orderBy: { order: "asc" }, select: { id: true, text: true, order: true } } },
          },
        },
      },
    },
  });

  return NextResponse.json({ modules });
}
