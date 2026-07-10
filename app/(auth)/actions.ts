"use server";

import { Prisma, UserRole } from "@prisma/client";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/lib/auth";
import { createAndSendVerificationEmail } from "@/lib/account-email";
import { db } from "@/lib/db";
import { hashPassword, validatePasswordStrength } from "@/lib/password";

type AuthFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

function cleanString(value: FormDataEntryValue | null) {
  const nextValue = typeof value === "string" ? value.trim() : "";
  return nextValue.length > 0 ? nextValue : null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function validatePassword(password: string | null) {
  return validatePasswordStrength(password);
}

export async function loginAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = cleanString(formData.get("email"))?.toLowerCase();
  const password = cleanString(formData.get("password"));
  const fieldErrors: Record<string, string> = {};

  if (!email) {
    fieldErrors.email = "Email is required.";
  }

  if (!password) {
    fieldErrors.password = "Password is required.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors,
      message: "Check the highlighted fields.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        ok: false,
        message: "Invalid email, password, or inactive organization.",
      };
    }

    throw error;
  }

  return { ok: true };
}

export async function registerCompanyAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const companyName = cleanString(formData.get("companyName"));
  const fullName = cleanString(formData.get("fullName"));
  const email = cleanString(formData.get("email"))?.toLowerCase();
  const password = cleanString(formData.get("password"));
  const fieldErrors: Record<string, string> = {};

  if (!companyName) {
    fieldErrors.companyName = "Company name is required.";
  }

  if (!fullName) {
    fieldErrors.fullName = "Your name is required.";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  const passwordError = validatePassword(password);

  if (passwordError) {
    fieldErrors.password = passwordError;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors,
      message: "Check the highlighted fields.",
    };
  }

  const baseSlug = slugify(companyName!);
  const slug = baseSlug || `company-${Date.now()}`;

  try {
    let createdUser:
      | { id: string; email: string; name: string | null }
      | undefined;

    await db.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: companyName!,
          slug,
          status: "ACTIVE",
        },
      });

      const user = await tx.user.create({
        data: {
          email: email!,
          name: fullName!,
          passwordHash: hashPassword(password!),
        },
      });
      createdUser = { id: user.id, email: user.email, name: user.name };

      await tx.organizationMember.create({
        data: {
          organizationId: organization.id,
          userId: user.id,
          role: UserRole.ADMIN,
          title: "Company Administrator",
          joinedAt: new Date(),
        },
      });

      await tx.auditLog.create({
        data: {
          organizationId: organization.id,
          actorUserId: user.id,
          action: "organization.registered",
          entityType: "Organization",
          entityId: organization.id,
        },
      });
    });

    if (createdUser) {
      await createAndSendVerificationEmail({
        userId: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
      });
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          ok: false,
          message:
            "An account or organization with these details already exists.",
        };
      }
    }

    return {
      ok: false,
      message: "Could not create company workspace. Please try again.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?registered=1");
    }

    throw error;
  }

  return { ok: true };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
