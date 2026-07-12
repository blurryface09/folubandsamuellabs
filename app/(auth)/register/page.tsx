import { registerCompanyAction } from "@/app/(auth)/actions";
import { AuthForm } from "@/app/(auth)/auth-form";
import { AuthShell } from "@/app/(auth)/auth-shell";

export default function RegisterPage() {
  return (
    <AuthShell
      description="Create an organization workspace and the first company admin account."
      eyebrow="Company setup"
      title="Register company"
    >
          <AuthForm
            action={registerCompanyAction}
            fields={[
              {
                label: "Company name",
                name: "companyName",
                placeholder: "Acme Limited",
              },
              {
                label: "Your name",
                name: "fullName",
                placeholder: "Ada Okafor",
              },
              {
                label: "Work email",
                name: "email",
                placeholder: "admin@company.com",
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
            footerHref="/login"
            footerLabel="Log in"
            footerText="Already registered?"
            submitLabel="Create workspace"
          />
    </AuthShell>
  );
}
