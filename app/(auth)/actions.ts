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
  successMessage?: string;
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
  const companyName = cleanString(formData.get("companyName")) || "FSLabs Academy";
  const fullName = cleanString(formData.get("fullName"));
  const email = cleanString(formData.get("email"))?.toLowerCase();
  const password = cleanString(formData.get("password"));
  const confirmPassword = cleanString(formData.get("confirmPassword"));
  const fieldErrors: Record<string, string> = {};

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

  if (!confirmPassword) {
    fieldErrors.confirmPassword = "Confirm your password.";
  } else if (password && confirmPassword !== password) {
    fieldErrors.confirmPassword = "Passwords do not match.";
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

  const existingUser = await db.user.findUnique({
    where: { email: email! },
    select: { id: true },
  });

  if (existingUser) {
    return {
      ok: false,
      fieldErrors: { email: "An account with this email already exists." },
      message: "Use a different email or log in.",
    };
  }

  let createdUser:
    | {
        id: string;
        email: string;
        name: string | null;
        organizationId: string;
        memberId: string;
      }
    | undefined;

  try {
    await db.$transaction(async (tx) => {
      // Academy students share a single workspace instead of each spinning up
      // their own organization — find-or-create keeps repeat signups from
      // colliding on the default "FSLabs Academy" slug.
      const organization = await tx.organization.upsert({
        where: { slug },
        update: {},
        create: {
          name: companyName!,
          slug,
        },
      });

      const user = await tx.user.create({
        data: {
          email: email!,
          name: fullName!,
          passwordHash: hashPassword(password!),
        },
      });

      const member = await tx.organizationMember.create({
        data: {
          organizationId: organization.id,
          userId: user.id,
          role: UserRole.STUDENT,
        },
      });
      createdUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        organizationId: organization.id,
        memberId: member.id,
      };

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

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = Array.isArray(error.meta?.target)
          ? error.meta.target.join(",")
          : String(error.meta?.target ?? "");

        if (target.includes("email")) {
          return {
            ok: false,
            fieldErrors: { email: "An account with this email already exists." },
            message: "Use a different email or log in.",
          };
        }

        if (target.includes("slug")) {
          return {
            ok: false,
            fieldErrors: {
              companyName:
                "A company workspace with this name already exists. Add a branch, location, or legal suffix.",
            },
            message: "Choose a more specific company name.",
          };
        }

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

  if (createdUser) {
    try {
      const verificationResult = await createAndSendVerificationEmail({
        userId: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
      });

      if (!verificationResult.ok) {
        await db.auditLog.create({
          data: {
            organizationId: createdUser.organizationId,
            actorUserId: createdUser.id,
            actorMemberId: createdUser.memberId,
            action: "auth.email_verification_delivery_failed",
            entityType: "User",
            entityId: createdUser.id,
            metadata: {
              provider: verificationResult.provider,
              reason: verificationResult.error.slice(0, 200),
            },
          },
        });
      }
    } catch {
      // Workspace registration has already succeeded. Verification can be resent.
    }
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
