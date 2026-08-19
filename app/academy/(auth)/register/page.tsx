import { registerCompanyAction } from "@/app/(auth)/actions";
import { AuthForm } from "@/app/(auth)/auth-form";
import { AuthShell } from "@/app/(auth)/auth-shell";

export default function RegisterPage() {
  return (
    <AuthShell
      description="Create your account and start learning"
      eyebrow="Join FSLabs Academy"
      title="Sign up"
    >
          <AuthForm
            action={registerCompanyAction}
            fields={[
              {
                label: "Full name",
                name: "fullName",
                placeholder: "Ada Okafor",
              },
              {
                label: "Email",
                name: "email",
                placeholder: "your@email.com",
                type: "email",
              },
              {
                label: "Password",
                name: "password",
                placeholder: "10+ chars, number, symbol",
                type: "password",
                autoComplete: "new-password",
              },
              {
                label: "Confirm password",
                name: "confirmPassword",
                placeholder: "Repeat password",
                type: "password",
                autoComplete: "new-password",
              },
            ]}
            footerHref="/academy/login"
            footerLabel="Log in"
            footerText="Already have an account?"
            submitLabel="Create account"
          />
    </AuthShell>
  );
}
