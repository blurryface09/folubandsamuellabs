"use server";

import { DocumentType, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentMembership, requireRole } from "@/lib/current-organization";
import { db } from "@/lib/db";
import { deleteDocumentFile, saveDocumentFile } from "@/lib/document-storage";
import { hasMinimumRole } from "@/lib/roles";

const documentTypes = new Set(Object.values(DocumentType));

function cleanString(value: FormDataEntryValue | null) {
  const nextValue = typeof value === "string" ? value.trim() : "";
  return nextValue.length > 0 ? nextValue : null;
}

function redirectWithMessage(
  employeeId: string,
  message: string,
  type = "error",
): never {
  redirect(
    `/employees/${employeeId}?toast=${encodeURIComponent(message)}&toastType=${type}`,
  );
}

export async function uploadEmployeeDocument(formData: FormData) {
  const membership = await requireRole(UserRole.HR_MANAGER);
  const employeeId = cleanString(formData.get("employeeId"));
  const category = cleanString(formData.get("category"));
  const fileValue = formData.get("file");

  if (!employeeId) {
    redirect("/employees?toast=Missing%20employee%20id&toastType=error");
  }

  if (!category || !documentTypes.has(category as DocumentType)) {
    redirectWithMessage(employeeId!, "Choose a valid document type.");
  }

  if (!(fileValue instanceof File)) {
    redirectWithMessage(employeeId!, "Choose a file to upload.");
  }

  const employee = await db.employee.findFirst({
    where: {
      id: employeeId!,
      organizationId: membership.organizationId,
    },
    select: { id: true },
  });

  if (!employee) {
    redirect("/employees?toast=Employee%20not%20found&toastType=error");
  }

  try {
    const storedFile = await saveDocumentFile({
      organizationId: membership.organizationId,
      employeeId: employee.id,
      file: fileValue,
    });

    await db.document.create({
      data: {
        organizationId: membership.organizationId,
        employeeId: employee.id,
        uploadedByMemberId: membership.id,
        category: category as DocumentType,
        name: storedFile.name,
        storageKey: storedFile.storageKey,
        contentType: storedFile.contentType,
        sizeBytes: storedFile.sizeBytes,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Document upload failed.";
    redirectWithMessage(employee.id, message);
  }

  revalidatePath("/documents");
  revalidatePath("/my-profile");
  revalidatePath(`/employees/${employee.id}`);
  redirect(`/employees/${employee.id}?toast=Document%20uploaded`);
}

export async function deleteEmployeeDocument(formData: FormData) {
  const membership = await getCurrentMembership();

  if (!hasMinimumRole(membership.role, UserRole.HR_MANAGER)) {
    redirect("/dashboard?error=AccessDenied");
  }

  const documentId = cleanString(formData.get("documentId"));
  const employeeId = cleanString(formData.get("employeeId"));

  if (!documentId || !employeeId) {
    redirect("/employees?toast=Missing%20document%20details&toastType=error");
  }

  const document = await db.document.findFirst({
    where: {
      id: documentId!,
      employeeId: employeeId!,
      organizationId: membership.organizationId,
    },
    select: {
      id: true,
      storageKey: true,
      employeeId: true,
    },
  });

  if (!document) {
    redirect(`/employees/${employeeId}?toast=Document%20not%20found&toastType=error`);
  }

  await db.document.delete({
    where: {
      id: document.id,
    },
  });
  await deleteDocumentFile(document.storageKey);

  revalidatePath("/documents");
  revalidatePath("/my-profile");
  revalidatePath(`/employees/${document.employeeId}`);
  redirect(`/employees/${document.employeeId}?toast=Document%20deleted`);
}
