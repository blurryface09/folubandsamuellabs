import Link from "next/link";
import { AuthShell } from "@/app/(auth)/auth-shell";
import { AuthForm } from "@/app/(auth)/auth-form";
import { loginAction } from "@/app/(auth)/actions";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function paramValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const error = paramValue(params, "error");
  const registered = paramValue(params, "registered");
  const reset = paramValue(params, "reset");

  return (
    <AuthShell
      description="Access your organization workspace and continue onboarding staff."
      eyebrow="Secure access"
      title="Log in"
    >
          {error ? (
            <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Please log in to continue.
            </div>
          ) : null}
          {registered ? (
            <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Company created. Check your email to verify your account.
            </div>
          ) : null}
          {reset ? (
            <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Password updated. Log in with your new password.
            </div>
          ) : null}
          <AuthForm
            action={loginAction}
            fields={[
              {
                label: "Email",
                name: "email",
                placeholder: "admin@company.com",
                type: "email",
                autoComplete: "email",
              },
              {
                label: "Password",
                name: "password",
                placeholder: "Your password",
                type: "password",
                autoComplete: "current-password",
              },
            ]}
            footerHref="/register"
            footerLabel="Register company"
            footerText="New workspace?"
            submitLabel="Log in"
          />
          <p className="mt-4 text-center text-sm">
            <Link className="font-medium text-slate-950 hover:underline" href="/forgot-password">
              Forgot password?
            </Link>
          </p>
    </AuthShell>
  );
}
