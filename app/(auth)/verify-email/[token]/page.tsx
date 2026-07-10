import Link from "next/link";

import { verifyEmailToken } from "@/app/(auth)/verify-actions";

type VerifyEmailPageProps = {
  params: Promise<{ token: string }>;
};

export default async function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const { token } = await params;
  const result = await verifyEmailToken(token);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-24 text-slate-950">
      <div className="mx-auto w-full max-w-md">
        <Link className="text-sm font-medium text-slate-500" href="/">
          Folub & Samuel Labs
        </Link>
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-normal">
            {result.ok ? "Email verified" : "Verification failed"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{result.message}</p>
          <Link
            className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white"
            href="/dashboard"
          >
            Continue
          </Link>
        </div>
      </div>
    </main>
  );
}
