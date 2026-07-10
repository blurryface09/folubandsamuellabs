import Link from "next/link";

import { AuthForm } from "@/app/(auth)/auth-form";
import { requestPasswordResetAction } from "@/app/(auth)/password-actions";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-24 text-slate-950">
      <div className="mx-auto w-full max-w-md">
        <Link className="text-sm font-medium text-slate-500" href="/">
          Folub & Samuel Labs
        </Link>
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-normal">
              Reset access
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your email and we will send reset instructions if an account exists.
            </p>
          </div>
          <AuthForm
            action={requestPasswordResetAction}
            fields={[
              {
                label: "Email",
                name: "email",
                placeholder: "you@company.com",
                type: "email",
              },
            ]}
            footerHref="/login"
            footerLabel="Log in"
            footerText="Remembered it?"
            submitLabel="Send reset link"
          />
        </div>
      </div>
    </main>
  );
}
