import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const MAX_DATA_URL_LENGTH = 1_500_000; // ~1MB after base64 overhead

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { image } = await req.json();

    if (typeof image !== "string" || !image.startsWith("data:image/")) {
      return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
    }

    if (image.length > MAX_DATA_URL_LENGTH) {
      return NextResponse.json({ error: "Image is too large" }, { status: 413 });
    }

    const user = await db.user.update({
      where: { id: session.user.id },
      data: { image },
      select: { image: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Update profile photo error:", error);
    return NextResponse.json({ error: "Failed to update photo" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { image: null },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Remove profile photo error:", error);
    return NextResponse.json({ error: "Failed to remove photo" }, { status: 500 });
  }
}
