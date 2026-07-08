"use server";

import { EmployeeStatus, Prisma, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentOrganization, requireRole } from "@/lib/current-organization";
import { db } from "@/lib/db";

import type { DepartmentFormState } from "./types";

function cleanString(value: FormDataEntryValue | null) {
  const nextValue = typeof value === "string" ? value.trim() : "";
  return nextValue.length > 0 ? nextValue : null;
}

async function validateDepartmentForm(formData: FormData) {
  const organization = await getCurrentOrganization();
  const fieldErrors: Record<string, string> = {};
  const name = cleanString(formData.get("name"));
  const code = cleanString(formData.get("code"));
  const description = cleanString(formData.get("description"));
  const managerEmployeeId = cleanString(formData.get("managerEmployeeId"));

  if (!name) {
    fieldErrors.name = "Department name is required.";
  }

  if (code && code.length > 24) {
    fieldErrors.code = "Code should be 24 characters or fewer.";
  }

  if (managerEmployeeId) {
    const manager = await db.employee.findFirst({
      where: {
        id: managerEmployeeId,
        organizationId: organization.id,
        status: {
          in: [EmployeeStatus.ACTIVE, EmployeeStatus.ON_LEAVE],
        },
      },
      select: { id: true },
    });

    if (!manager) {
      fieldErrors.managerEmployeeId = "Choose an active employee manager.";
    }
  }

  return {
    organization,
    fieldErrors,
    values: {
      name,
      code: code?.toUpperCase() ?? null,
      description,
      managerEmployeeId,
    },
  };
}

function departmentError(error: unknown): DepartmentFormState {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return {
        ok: false,
        message:
          "A department with this name or code already exists in this organization.",
      };
    }

    if (error.code === "P2025") {
      return {
        ok: false,
        message: "Department was not found in the current organization.",
      };
    }
  }

  return {
    ok: false,
    message: "Something went wrong. Please try again.",
  };
}

export async function createDepartment(
  _previousState: DepartmentFormState,
  formData: FormData,
): Promise<DepartmentFormState> {
  await requireRole(UserRole.HR_MANAGER);
  const result = await validateDepartmentForm(formData);

  if (Object.keys(result.fieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors: result.fieldErrors,
      message: "Check the highlighted fields.",
    };
  }

  let departmentId: string;

  try {
    const department = await db.department.create({
      data: {
        organizationId: result.organization.id,
        name: result.values.name!,
        code: result.values.code,
        description: result.values.description,
        managerEmployeeId: result.values.managerEmployeeId,
      },
      select: { id: true },
    });
    departmentId = department.id;
  } catch (error) {
    return departmentError(error);
  }

  revalidatePath("/departments");
  redirect(`/departments/${departmentId}?toast=Department%20created`);
}

export async function updateDepartment(
  _previousState: DepartmentFormState,
  formData: FormData,
): Promise<DepartmentFormState> {
  await requireRole(UserRole.HR_MANAGER);
  const departmentId = cleanString(formData.get("id"));

  if (!departmentId) {
    return {
      ok: false,
      message: "Missing department id.",
    };
  }

  const result = await validateDepartmentForm(formData);

  if (Object.keys(result.fieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors: result.fieldErrors,
      message: "Check the highlighted fields.",
    };
  }

  try {
    await db.department.update({
      where: {
        id_organizationId: {
          id: departmentId,
          organizationId: result.organization.id,
        },
      },
      data: {
        name: result.values.name!,
        code: result.values.code,
        description: result.values.description,
        managerEmployeeId: result.values.managerEmployeeId,
      },
    });
  } catch (error) {
    return departmentError(error);
  }

  revalidatePath("/departments");
  revalidatePath(`/departments/${departmentId}`);
  redirect(`/departments/${departmentId}?toast=Department%20updated`);
}

export async function deactivateDepartment(formData: FormData) {
  await requireRole(UserRole.HR_MANAGER);
  const organization = await getCurrentOrganization();
  const departmentId = cleanString(formData.get("id"));

  if (!departmentId) {
    redirect("/departments?toast=Missing%20department%20id&toastType=error");
  }

  const activeEmployees = await db.employee.count({
    where: {
      organizationId: organization.id,
      departmentId: departmentId!,
      status: {
        in: [EmployeeStatus.ACTIVE, EmployeeStatus.ON_LEAVE],
      },
    },
  });

  if (activeEmployees > 0) {
    redirect(
      `/departments/${departmentId}?toast=Move%20active%20employees%20before%20deactivating%20this%20department&toastType=error`,
    );
  }

  await db.department.update({
    where: {
      id_organizationId: {
        id: departmentId!,
        organizationId: organization.id,
      },
    },
    data: {
      isActive: false,
      deletedAt: new Date(),
      managerEmployeeId: null,
    },
  });

  revalidatePath("/departments");
  revalidatePath(`/departments/${departmentId}`);
  redirect("/departments?toast=Department%20deactivated");
}
