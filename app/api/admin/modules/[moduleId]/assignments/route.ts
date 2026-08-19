import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function POST(req: NextRequest, { params }: { params: Promise<{ moduleId: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await params;
  const { title, instructions, type, dueDate, maxScore } = await req.json();

  if (!title?.trim() || !instructions?.trim()) {
    return NextResponse.json({ error: "Title and instructions are required" }, { status: 400 });
  }

  const last = await db.assignment.findFirst({
    where: { moduleId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const assignment = await db.assignment.create({
    data: {
      moduleId,
      title: title.trim(),
      instructions: instructions.trim(),
      type: type === "CLASSWORK" ? "CLASSWORK" : "ASSIGNMENT",
      dueDate: dueDate ? new Date(dueDate) : null,
      maxScore: maxScore ? Number(maxScore) : 100,
      order: (last?.order ?? 0) + 1,
    },
  });

  return NextResponse.json({ assignment }, { status: 201 });
}
