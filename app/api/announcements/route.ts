import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const announcements = await db.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, title: true, body: true, createdAt: true },
  });

  return NextResponse.json({ announcements });
}
