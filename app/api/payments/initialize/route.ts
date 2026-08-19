import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { initializeTransaction } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { error: "Payments aren't set up yet. Please try again shortly." },
        { status: 503 }
      );
    }

    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    let enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
      include: { payment: true },
    });

    if (enrollment?.paymentStatus === "COMPLETED") {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 409 });
    }

    if (!enrollment) {
      enrollment = await db.enrollment.create({
        data: {
          userId: session.user.id,
          courseId,
          status: "PENDING",
          paymentStatus: "PENDING",
        },
        include: { payment: true },
      });
    }

    const payment = enrollment.payment
      ? await db.payment.update({
          where: { id: enrollment.payment.id },
          data: { status: "PENDING", amount: course.pricing, currency: course.currency },
        })
      : await db.payment.create({
          data: {
            enrollmentId: enrollment.id,
            amount: course.pricing,
            currency: course.currency,
            provider: "paystack",
            status: "PENDING",
          },
        });

    const callbackUrl = `${req.nextUrl.origin}/api/payments/callback`;
    const amountKobo = Math.round(Number(course.pricing) * 100);

    const result = await initializeTransaction({
      email: session.user.email,
      amountKobo,
      reference: payment.id,
      callbackUrl,
      metadata: { courseId, courseSlug: course.slug, userId: session.user.id },
    });

    await db.payment.update({
      where: { id: payment.id },
      data: { providerRef: result.data.reference },
    });

    return NextResponse.json({ authorizationUrl: result.data.authorization_url });
  } catch (error) {
    console.error("Payment initialize error:", error);
    return NextResponse.json({ error: "Failed to start payment" }, { status: 500 });
  }
}
