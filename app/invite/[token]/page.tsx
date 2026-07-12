import { AuthShell } from "@/app/(auth)/auth-shell";
import { InviteAcceptForm } from "@/app/invite/[token]/invite-accept-form";
import { db } from "@/lib/db";
import { hashInviteToken, inviteStatus } from "@/lib/invite-token";

type InvitePageProps = {
  params: Promise<{ token: string }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const invite = await db.employeeInvite.findUnique({
    where: { tokenHash: hashInviteToken(token) },
    include: {
      employee: {
        select: {
          firstName: true,
          lastName: true,
          employeeNumber: true,
          jobTitle: true,
        },
      },
      organization: {
        select: {
          name: true,
          status: true,
        },
      },
    },
  });
  const status = inviteStatus(invite);
  const canAccept = invite && status === "Pending" && invite.organization.status === "ACTIVE";

  return (
    <AuthShell
      description={
        invite
          ? `${invite.organization.name} invited ${invite.employee.firstName} ${invite.employee.lastName}.`
          : "This invitation could not be found."
      }
      eyebrow="Staff access"
      title="Accept invitation"
    >
      {canAccept ? (
        <InviteAcceptForm token={token} />
      ) : (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          This invite is {status.toLowerCase()} and cannot be accepted.
        </div>
      )}
    </AuthShell>
  );
}
