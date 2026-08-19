import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyTransaction } from "@/lib/paystack";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");
  const origin = req.nextUrl.origin;

  if (!reference) {
    return NextResponse.redirect(`${origin}/academy/courses?payment=error`);
  }

  try {
    const payment = await db.payment.findUnique({
      where: { id: reference },
      include: { enrollment: { include: { course: true } } },
    });

    if (!payment) {
      return NextResponse.redirect(`${origin}/academy/courses?payment=error`);
    }

    const courseSlug = payment.enrollment.course.slug;
    const verification = await verifyTransaction(reference);

    if (verification.data.status === "success") {
      await db.$transaction([
        db.payment.update({
          where: { id: payment.id },
          data: { status: "COMPLETED" },
        }),
        db.enrollment.update({
          where: { id: payment.enrollmentId },
          data: { status: "ACTIVE", paymentStatus: "COMPLETED", startedAt: new Date() },
        }),
      ]);

      return NextResponse.redirect(`${origin}/academy/courses/${courseSlug}?payment=success`);
    }

    await db.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });

    return NextResponse.redirect(`${origin}/academy/courses/${courseSlug}?payment=failed`);
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.redirect(`${origin}/academy/courses?payment=error`);
  }
}
