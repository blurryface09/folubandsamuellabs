import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function POST(req: NextRequest, { params }: { params: Promise<{ moduleId: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await params;
  const { title, content, videoUrl, durationMins } = await req.json();

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const last = await db.lesson.findFirst({
    where: { moduleId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const lesson = await db.lesson.create({
    data: {
      moduleId,
      title: title.trim(),
      content: content?.trim() || null,
      videoUrl: videoUrl?.trim() || null,
      durationMins: durationMins ? Number(durationMins) : null,
      order: (last?.order ?? 0) + 1,
    },
  });

  return NextResponse.json({ lesson }, { status: 201 });
}
