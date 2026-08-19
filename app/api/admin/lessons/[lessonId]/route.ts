import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ lessonId: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lessonId } = await params;
  const { title, content, videoUrl, durationMins } = await req.json();

  const data: Record<string, unknown> = {};
  if (typeof title === "string" && title.trim()) data.title = title.trim();
  if (typeof content === "string") data.content = content.trim() || null;
  if (typeof videoUrl === "string") data.videoUrl = videoUrl.trim() || null;
  if (durationMins !== undefined) data.durationMins = durationMins ? Number(durationMins) : null;

  const lesson = await db.lesson.update({ where: { id: lessonId }, data });
  return NextResponse.json({ lesson });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ lessonId: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lessonId } = await params;
  await db.lesson.delete({ where: { id: lessonId } });

  return NextResponse.json({ ok: true });
}
