import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message:
        "Auth provider boundary is ready. Install and configure Auth.js or swap this route for Clerk middleware.",
    },
    { status: 501 },
  );
}

export const POST = GET;
