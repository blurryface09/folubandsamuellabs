import { AuthShell } from "@/app/(auth)/auth-shell";
import { ResetPasswordForm } from "@/app/(auth)/reset-password/[token]/reset-password-form";

type ResetPasswordPageProps = {
  params: Promise<{ token: string }>;
};

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { token } = await params;

  return (
    <AuthShell
      description="Choose a strong password for your HR workspace account."
      eyebrow="Account recovery"
      title="Set a new password"
    >
          <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
