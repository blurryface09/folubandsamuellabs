import type { Role } from "@/lib/rbac";

export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  organizationId: string;
};

export type AppSession = {
  user: SessionUser;
};

export const authRoutes = {
  signIn: "/login",
  afterSignIn: "/dashboard",
};

export async function getCurrentSession(): Promise<AppSession | null> {
  // Wire this to Auth.js `auth()` or Clerk's server helpers when the provider is selected.
  return null;
}
