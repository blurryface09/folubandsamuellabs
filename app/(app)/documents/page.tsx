import { UserRole } from "@prisma/client";

import { EmployeeDocumentList } from "@/app/(app)/employees/document-list";
import { PageShell } from "@/components/app/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentMembership } from "@/lib/current-organization";
import { db } from "@/lib/db";
import { hasMinimumRole } from "@/lib/roles";

export default async function DocumentsPage() {
  const membership = await getCurrentMembership();
  const canManageDocuments = hasMinimumRole(membership.role, UserRole.HR_MANAGER);
  const employee = !canManageDocuments
    ? await db.employee.findFirst({
        where: {
          organizationId: membership.organizationId,
          organizationMemberId: membership.id,
        },
        select: { id: true },
      })
    : null;

  const documents = await db.document.findMany({
    where: {
      organizationId: membership.organizationId,
      ...(canManageDocuments
        ? {}
        : {
            employeeId: employee?.id ?? "__no_employee_profile__",
          }),
    },
    orderBy: { createdAt: "desc" },
    include: {
      employee: {
        select: {
          firstName: true,
          lastName: true,
          employeeNumber: true,
        },
      },
      uploadedByMember: {
        include: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return (
    <PageShell
      title="Documents"
      description={
        canManageDocuments
          ? "Review staff onboarding documents for your organization."
          : "View documents shared with your employee profile."
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>
            {canManageDocuments ? "Organization documents" : "My documents"}
          </CardTitle>
          <CardDescription>
            {canManageDocuments
              ? "Upload documents from an employee profile. Downloads remain tenant-protected."
              : "Only documents linked to your own staff profile are shown here."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {canManageDocuments && documents.length > 0 ? (
            <div className="divide-y divide-slate-200 rounded-md border border-slate-200">
              {documents.map((document) => (
                <div className="space-y-3 p-4" key={document.id}>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      {document.employee
                        ? `${document.employee.firstName} ${document.employee.lastName}`
                        : "Unassigned employee"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {document.employee?.employeeNumber ?? "No employee code"}
                    </p>
                  </div>
                  <EmployeeDocumentList
                    documents={[
                      {
                        ...document,
                        uploadedByMember: document.uploadedByMember,
                      },
                    ]}
                    canDelete
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmployeeDocumentList documents={documents} />
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
