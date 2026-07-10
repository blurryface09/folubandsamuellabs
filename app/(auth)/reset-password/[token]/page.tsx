import Link from "next/link";

import { ResetPasswordForm } from "@/app/(auth)/reset-password/[token]/reset-password-form";

type ResetPasswordPageProps = {
  params: Promise<{ token: string }>;
};

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { token } = await params;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-24 text-slate-950">
      <div className="mx-auto w-full max-w-md">
        <Link className="text-sm font-medium text-slate-500" href="/">
          Folub & Samuel Labs
        </Link>
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-normal">
              Set a new password
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Choose a strong password for your HR workspace account.
            </p>
          </div>
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </main>
  );
}
