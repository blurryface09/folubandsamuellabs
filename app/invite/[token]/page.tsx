import Link from "next/link";

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
    <main className="min-h-screen bg-slate-50 px-4 py-24 text-slate-950">
      <div className="mx-auto w-full max-w-md">
        <Link className="text-sm font-medium text-slate-500" href="/">
          Folub & Samuel Labs
        </Link>
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-normal">
              Accept invitation
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {invite
                ? `${invite.organization.name} invited ${invite.employee.firstName} ${invite.employee.lastName}.`
                : "This invitation could not be found."}
            </p>
          </div>
          {canAccept ? (
            <InviteAcceptForm token={token} />
          ) : (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              This invite is {status.toLowerCase()} and cannot be accepted.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
