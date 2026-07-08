import Link from "next/link";

import { registerCompanyAction } from "@/app/(auth)/actions";
import { AuthForm } from "@/app/(auth)/auth-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-24 text-slate-950">
      <div className="mx-auto w-full max-w-md">
        <Link className="text-sm font-medium text-slate-500" href="/">
          Folub & Samuel Labs
        </Link>
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-normal">
              Register company
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create an organization workspace and first company admin.
            </p>
          </div>
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
                placeholder: "At least 8 characters",
                type: "password",
              },
            ]}
            footerHref="/login"
            footerLabel="Log in"
            footerText="Already registered?"
            submitLabel="Create workspace"
          />
        </div>
      </div>
    </main>
  );
}
