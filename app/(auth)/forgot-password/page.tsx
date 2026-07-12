import { AuthForm } from "@/app/(auth)/auth-form";
import { AuthShell } from "@/app/(auth)/auth-shell";
import { requestPasswordResetAction } from "@/app/(auth)/password-actions";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      description="Enter your email and we will send reset instructions if an account exists."
      eyebrow="Account recovery"
      title="Reset access"
    >
          <AuthForm
            action={requestPasswordResetAction}
            fields={[
              {
                label: "Email",
                name: "email",
                placeholder: "you@company.com",
                type: "email",
                autoComplete: "email",
              },
            ]}
            footerHref="/login"
            footerLabel="Log in"
            footerText="Remembered it?"
            submitLabel="Send reset link"
          />
    </AuthShell>
  );
}
