import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserRole } from "@prisma/client";

import { db } from "@/lib/db";
import { appRoleLabels } from "@/lib/roles";
import { verifyPassword } from "@/lib/password";
import { isLoginLocked, recordLoginFailure, recordLoginSuccess } from "@/lib/auth-security";

function authSecret() {
  if (!process.env.AUTH_SECRET && process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is required in production.");
  }

  return process.env.AUTH_SECRET;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      organizationId: string;
      organizationSlug: string;
      organizationName: string;
      memberId: string;
      role: UserRole;
      appRole: string;
      isPlatformAdmin: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    organizationId?: string;
    organizationSlug?: string;
    organizationName?: string;
    memberId?: string;
    role?: UserRole;
    appRole?: string;
    isPlatformAdmin?: boolean;
  }
}

export const authRoutes = {
  signIn: "/login",
  afterSignIn: "/student/dashboard",
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: authRoutes.signIn,
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
    updateAge: 60 * 15,
  },
  secret: authSecret(),
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === "production",
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        if (!email || !password) {
          return null;
        }

        if (await isLoginLocked(email)) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email },
          include: {
            memberships: {
              include: {
                organization: true,
              },
              orderBy: { createdAt: "asc" },
            },
          },
        });

        if (!user || !verifyPassword(password, user.passwordHash)) {
          await recordLoginFailure(email);
          const membership = user?.memberships[0];

          if (membership) {
            await db.auditLog.create({
              data: {
                organizationId: membership.organizationId,
                actorUserId: user.id,
                actorMemberId: membership.id,
                action: "auth.login_failed",
                entityType: "User",
                entityId: user.id,
              },
            });
          }

          return null;
        }

        const membership = user.memberships[0];

        if (!membership) {
          await recordLoginFailure(email);
          return null;
        }

        await recordLoginSuccess(email);
        await db.auditLog.create({
          data: {
            organizationId: membership.organizationId,
            actorUserId: user.id,
            actorMemberId: membership.id,
            action: "auth.login_success",
            entityType: "User",
            entityId: user.id,
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          organizationId: membership.organizationId,
          organizationSlug: membership.organization.slug,
          organizationName: membership.organization.name,
          memberId: membership.id,
          role: membership.role,
          appRole: appRoleLabels[membership.role],
          isPlatformAdmin: user.isPlatformAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as typeof user & {
          organizationId: string;
          organizationSlug: string;
          organizationName: string;
          memberId: string;
          role: UserRole;
          appRole: string;
          isPlatformAdmin: boolean;
        };

        token.userId = authUser.id;
        token.organizationId = authUser.organizationId;
        token.organizationSlug = authUser.organizationSlug;
        token.organizationName = authUser.organizationName;
        token.memberId = authUser.memberId;
        token.role = authUser.role;
        token.appRole = authUser.appRole;
        token.isPlatformAdmin = authUser.isPlatformAdmin;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId ?? "";
        session.user.organizationId = token.organizationId ?? "";
        session.user.organizationSlug = token.organizationSlug ?? "";
        session.user.organizationName = token.organizationName ?? "";
        session.user.memberId = token.memberId ?? "";
        session.user.role = token.role ?? UserRole.STUDENT;
        session.user.appRole = token.appRole ?? "student";
        session.user.isPlatformAdmin = Boolean(token.isPlatformAdmin);
      }

      return session;
    },
  },
});
