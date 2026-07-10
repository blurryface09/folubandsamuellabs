import Link from "next/link";

import type { DocumentType } from "@prisma/client";

import { deleteEmployeeDocument } from "@/app/(app)/employees/document-actions";
import { Button } from "@/components/ui/button";
import { documentTypeLabels, formatFileSize } from "@/lib/document-types";

type EmployeeDocument = {
  id: string;
  employeeId: string | null;
  name: string;
  category: DocumentType;
  contentType: string | null;
  sizeBytes: number | null;
  createdAt: Date;
  uploadedByMember?: {
    user: {
      name: string | null;
      email: string;
    };
  } | null;
};

export function EmployeeDocumentList({
  documents,
  canDelete = false,
}: {
  documents: EmployeeDocument[];
  canDelete?: boolean;
}) {
  if (documents.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
        <p className="text-sm font-medium text-slate-700">No documents yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Uploaded onboarding files will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200 rounded-md border border-slate-200">
      {documents.map((document) => (
        <div
          className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
          key={document.id}
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold text-slate-950">
                {document.name}
              </p>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {documentTypeLabels[document.category]}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {formatFileSize(document.sizeBytes)} · Uploaded{" "}
              {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
                document.createdAt,
              )}
              {document.uploadedByMember
                ? ` by ${document.uploadedByMember.user.name ?? document.uploadedByMember.user.email}`
                : ""}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              href={`/documents/${document.id}/download`}
            >
              Download
            </Link>
            {canDelete && document.employeeId ? (
              <form action={deleteEmployeeDocument}>
                <input name="documentId" type="hidden" value={document.id} />
                <input name="employeeId" type="hidden" value={document.employeeId} />
                <Button
                  className="h-9 w-full border-red-200 px-3 text-red-700 hover:bg-red-50 sm:w-auto"
                  type="submit"
                  variant="secondary"
                >
                  Delete
                </Button>
              </form>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
