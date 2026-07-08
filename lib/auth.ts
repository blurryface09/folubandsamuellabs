import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserRole } from "@prisma/client";

import { db } from "@/lib/db";
import { appRoleLabels } from "@/lib/roles";
import { verifyPassword } from "@/lib/password";

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
  afterSignIn: "/dashboard",
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: authRoutes.signIn,
  },
  session: {
    strategy: "jwt",
  },
  secret:
    process.env.AUTH_SECRET ?? "development-auth-secret-change-before-production",
  trustHost: true,
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
          return null;
        }

        const membership = user.memberships[0];

        if (!membership || membership.organization.status !== "ACTIVE") {
          return null;
        }

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
        session.user.role = token.role ?? UserRole.EMPLOYEE;
        session.user.appRole = token.appRole ?? "employee";
        session.user.isPlatformAdmin = Boolean(token.isPlatformAdmin);
      }

      return session;
    },
  },
});
