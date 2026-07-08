"use server";

import { EmployeeStatus, EmploymentType, Prisma, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentOrganization, requireRole } from "@/lib/current-organization";
import { db } from "@/lib/db";

import type { EmployeeFormState } from "./types";

const employmentTypes = new Set(Object.values(EmploymentType));
const employeeStatuses = new Set(Object.values(EmployeeStatus));

function cleanString(value: FormDataEntryValue | null) {
  const nextValue = typeof value === "string" ? value.trim() : "";
  return nextValue.length > 0 ? nextValue : null;
}

function parseDate(value: FormDataEntryValue | null) {
  const text = cleanString(value);

  if (!text) {
    return null;
  }

  const date = new Date(`${text}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

async function validateEmployeeForm(formData: FormData) {
  const organization = await getCurrentOrganization();
  const fieldErrors: Record<string, string> = {};

  const employeeNumber = cleanString(formData.get("employeeNumber"));
  const firstName = cleanString(formData.get("firstName"));
  const lastName = cleanString(formData.get("lastName"));
  const workEmail = cleanString(formData.get("workEmail"));
  const phone = cleanString(formData.get("phone"));
  const jobTitle = cleanString(formData.get("jobTitle"));
  const departmentId = cleanString(formData.get("departmentId"));
  const employmentType = cleanString(formData.get("employmentType"));
  const status = cleanString(formData.get("status"));
  const hireDate = parseDate(formData.get("hireDate"));

  if (!employeeNumber) {
    fieldErrors.employeeNumber = "Employee code is required.";
  }

  if (!firstName) {
    fieldErrors.firstName = "First name is required.";
  }

  if (!lastName) {
    fieldErrors.lastName = "Last name is required.";
  }

  if (workEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail)) {
    fieldErrors.workEmail = "Enter a valid work email address.";
  }

  if (phone && phone.length < 7) {
    fieldErrors.phone = "Enter a valid phone number.";
  }

  if (!employmentType || !employmentTypes.has(employmentType as EmploymentType)) {
    fieldErrors.employmentType = "Choose an employment type.";
  }

  if (!status || !employeeStatuses.has(status as EmployeeStatus)) {
    fieldErrors.status = "Choose an employee status.";
  }

  if (departmentId) {
    const department = await db.department.findFirst({
      where: {
        id: departmentId,
        organizationId: organization.id,
      },
      select: { id: true },
    });

    if (!department) {
      fieldErrors.departmentId = "Choose a valid department.";
    }
  }

  return {
    organization,
    fieldErrors,
    values: {
      employeeNumber,
      firstName,
      lastName,
      workEmail,
      phone,
      jobTitle,
      departmentId,
      employmentType: employmentType as EmploymentType,
      status: status as EmployeeStatus,
      hireDate,
    },
  };
}

function employeeError(error: unknown): EmployeeFormState {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return {
        ok: false,
        message:
          "An employee with this code or linked account already exists in this organization.",
      };
    }

    if (error.code === "P2025") {
      return {
        ok: false,
        message: "Employee was not found in the current organization.",
      };
    }
  }

  return {
    ok: false,
    message: "Something went wrong. Please try again.",
  };
}

export async function createEmployee(
  _previousState: EmployeeFormState,
  formData: FormData,
): Promise<EmployeeFormState> {
  await requireRole(UserRole.HR_MANAGER);
  const result = await validateEmployeeForm(formData);

  if (Object.keys(result.fieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors: result.fieldErrors,
      message: "Check the highlighted fields.",
    };
  }

  let employeeId: string;

  try {
    const employee = await db.employee.create({
      data: {
        organizationId: result.organization.id,
        employeeNumber: result.values.employeeNumber!,
        firstName: result.values.firstName!,
        lastName: result.values.lastName!,
        workEmail: result.values.workEmail,
        phone: result.values.phone,
        jobTitle: result.values.jobTitle,
        departmentId: result.values.departmentId,
        employmentType: result.values.employmentType,
        status: result.values.status,
        hireDate: result.values.hireDate,
      },
      select: { id: true },
    });
    employeeId = employee.id;
  } catch (error) {
    return employeeError(error);
  }

  revalidatePath("/employees");
  redirect(`/employees/${employeeId}?toast=Employee%20created`);
}

export async function updateEmployee(
  _previousState: EmployeeFormState,
  formData: FormData,
): Promise<EmployeeFormState> {
  await requireRole(UserRole.HR_MANAGER);
  const employeeId = cleanString(formData.get("id"));

  if (!employeeId) {
    return {
      ok: false,
      message: "Missing employee id.",
    };
  }

  const result = await validateEmployeeForm(formData);

  if (Object.keys(result.fieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors: result.fieldErrors,
      message: "Check the highlighted fields.",
    };
  }

  try {
    await db.employee.update({
      where: {
        id_organizationId: {
          id: employeeId,
          organizationId: result.organization.id,
        },
      },
      data: {
        employeeNumber: result.values.employeeNumber!,
        firstName: result.values.firstName!,
        lastName: result.values.lastName!,
        workEmail: result.values.workEmail,
        phone: result.values.phone,
        jobTitle: result.values.jobTitle,
        departmentId: result.values.departmentId,
        employmentType: result.values.employmentType,
        status: result.values.status,
        hireDate: result.values.hireDate,
      },
    });
  } catch (error) {
    return employeeError(error);
  }

  revalidatePath("/employees");
  revalidatePath(`/employees/${employeeId}`);
  redirect(`/employees/${employeeId}?toast=Employee%20updated`);
}

export async function deactivateEmployee(formData: FormData) {
  await requireRole(UserRole.HR_MANAGER);
  const organization = await getCurrentOrganization();
  const employeeId = cleanString(formData.get("id"));

  if (!employeeId) {
    redirect("/employees?toast=Missing%20employee%20id");
  }

  await db.employee.update({
    where: {
      id_organizationId: {
        id: employeeId!,
        organizationId: organization.id,
      },
    },
    data: {
      status: EmployeeStatus.SUSPENDED,
      terminationDate: new Date(),
    },
  });

  revalidatePath("/employees");
  revalidatePath(`/employees/${employeeId}`);
  redirect("/employees?toast=Employee%20deactivated");
}
