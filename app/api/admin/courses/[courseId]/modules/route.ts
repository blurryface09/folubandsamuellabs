import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { courseId } = await params;

  const modules = await db.module.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
    include: {
      lessons: { orderBy: { order: "asc" } },
      assignments: { orderBy: { order: "asc" } },
      exams: {
        orderBy: { order: "asc" },
        include: { questions: { include: { options: true }, orderBy: { order: "asc" } } },
      },
    },
  });

  return NextResponse.json({ modules });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { courseId } = await params;
  const { title } = await req.json();

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const lastModule = await db.module.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const createdModule = await db.module.create({
    data: {
      courseId,
      title: title.trim(),
      order: (lastModule?.order ?? 0) + 1,
    },
  });

  return NextResponse.json({ module: createdModule }, { status: 201 });
}
