import "server-only";

import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { appRoleLabels, hasMinimumRole } from "@/lib/roles";

export async function getCurrentMembership() {
  const session = await auth();

  if (!session?.user?.id || !session.user.organizationId) {
    redirect("/login");
  }

  const membership = await db.organizationMember.findFirst({
    where: {
      id: session.user.memberId,
      userId: session.user.id,
      organizationId: session.user.organizationId,
      organization: {
        status: "ACTIVE",
      },
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          emailVerified: true,
          isPlatformAdmin: true,
        },
      },
    },
  });

  if (!membership) {
    redirect("/login?error=SessionExpired");
  }

  return {
    ...membership,
    appRole: appRoleLabels[membership.role],
  };
}

export async function getCurrentOrganization() {
  const membership = await getCurrentMembership();

  return membership.organization;
}

export async function requireRole(minimumRole: UserRole) {
  const membership = await getCurrentMembership();

  if (!membership.user.emailVerified) {
    redirect("/dashboard?error=EmailVerificationRequired");
  }

  if (!hasMinimumRole(membership.role, minimumRole)) {
    redirect("/dashboard?error=AccessDenied");
  }

  return membership;
}

export async function requireVerifiedUser() {
  const membership = await getCurrentMembership();

  if (!membership.user.emailVerified) {
    redirect("/dashboard?error=EmailVerificationRequired");
  }

  return membership;
}
