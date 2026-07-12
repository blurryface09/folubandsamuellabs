import Link from "next/link";

import { AuthShell } from "@/app/(auth)/auth-shell";
import { verifyEmailToken } from "@/app/(auth)/verify-actions";

type VerifyEmailPageProps = {
  params: Promise<{ token: string }>;
};

export default async function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const { token } = await params;
  const result = await verifyEmailToken(token);

  return (
    <AuthShell
      description="Complete email verification for your HR workspace account."
      eyebrow="Email verification"
      title={result.ok ? "Email verified" : "Verification failed"}
    >
          <div
            className={`rounded-lg border px-4 py-3 text-sm leading-6 ${
              result.ok
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {result.message}
          </div>
          <Link
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white"
            href="/dashboard"
          >
            Continue
          </Link>
    </AuthShell>
  );
}
