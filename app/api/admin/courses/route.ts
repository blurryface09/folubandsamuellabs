import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const courses = await db.course.findMany({
    select: { id: true, title: true, slug: true },
    orderBy: { title: "asc" },
  });

  return NextResponse.json({ courses });
}
