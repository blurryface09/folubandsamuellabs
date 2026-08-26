import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendHelpRequestAlert } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message, preferredContact, phone, preferredTime, courseId, moduleId } = await req.json();

  if (!message?.trim()) {
    return NextResponse.json({ error: "Please tell us what you need help with" }, { status: 400 });
  }
  if (!phone?.trim()) {
    return NextResponse.json({ error: "A phone number is required so we can reach you" }, { status: 400 });
  }

  const validContacts = ["CALL", "WHATSAPP", "VIDEO"];
  const contact = validContacts.includes(preferredContact) ? preferredContact : "CALL";

  const helpRequest = await db.helpRequest.create({
    data: {
      userId: session.user.id,
      courseId: courseId || null,
      moduleId: moduleId || null,
      message: message.trim(),
      preferredContact: contact,
      phone: phone.trim(),
      preferredTime: preferredTime?.trim() || null,
    },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
      module: { select: { title: true } },
    },
  });

  sendHelpRequestAlert({
    studentName: helpRequest.user.name || helpRequest.user.email,
    studentEmail: helpRequest.user.email,
    phone: helpRequest.phone,
    preferredContact: helpRequest.preferredContact,
    preferredTime: helpRequest.preferredTime,
    message: helpRequest.message,
    courseTitle: helpRequest.course?.title ?? null,
    moduleTitle: helpRequest.module?.title ?? null,
  }).catch(() => {});

  return NextResponse.json({ helpRequest }, { status: 201 });
}
