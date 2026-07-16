import Link from "next/link";
import { notFound } from "next/navigation";

import {
  deactivateEmployee,
  deleteEmployee,
  removeMemberAccess,
  updateMemberRole,
} from "@/app/(app)/employees/actions";
import { ConfirmSubmitButton } from "@/app/(app)/employees/confirm-submit-button";
import { EmployeeDocumentList } from "@/app/(app)/employees/document-list";
import { EmployeeDocumentUploadForm } from "@/app/(app)/employees/document-upload-form";
import { inviteEmployee } from "@/app/(app)/employees/invite-actions";
import { EmployeeToast } from "@/app/(app)/employees/employee-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/current-organization";
import { db } from "@/lib/db";
import { inviteStatus } from "@/lib/invite-token";
import { hasMinimumRole } from "@/lib/roles";
import { UserRole } from "@prisma/client";

const roleLabels: Record<UserRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  HR_MANAGER: "HR Manager",
  MANAGER: "Manager",
  EMPLOYEE: "Employee",
};

const assignableRoles: UserRole[] = [
  UserRole.ADMIN,
  UserRole.HR_MANAGER,
  UserRole.MANAGER,
  UserRole.EMPLOYEE,
];

type EmployeeDetailsPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function formatDate(value: Date | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(value);
}

function display(value?: string | null) {
  return value && value.trim().length > 0 ? value : "Not set";
}

function paramValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function EmployeeDetailsPage({
  params,
  searchParams,
}: EmployeeDetailsPageProps) {
  const [{ id }, queryParams] = await Promise.all([
    params,
    searchParams ?? Promise.resolve({}),
  ]);
  const viewer = await requireRole(UserRole.HR_MANAGER);
  const organization = viewer.organization;
  const isAdmin = hasMinimumRole(viewer.role, UserRole.ADMIN);
  const employee = await db.employee.findFirst({
    where: {
      id,
      organizationId: organization.id,
    },
    include: {
      department: {
        select: {
          name: true,
          code: true,
        },
      },
      organizationMember: {
        include: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      },
      invites: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          invitedByMember: {
            include: {
              user: {
                select: { email: true, name: true },
              },
            },
          },
        },
      },
      documents: {
        orderBy: { createdAt: "desc" },
        include: {
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
      },
    },
  });

  if (!employee) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <EmployeeToast
        message={paramValue(queryParams, "toast")}
        type={paramValue(queryParams, "toastType")}
      />
      {paramValue(queryParams, "invite") ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <p className="font-medium">Invite link created</p>
          <p className="mt-2 break-all font-mono text-xs">
            {paramValue(queryParams, "invite")}
          </p>
        </div>
      ) : null}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Employee profile
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
            {employee.firstName} {employee.lastName}
          </h1>
          <p className="mt-2 text-sm text-slate-600">{employee.employeeNumber}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            href="/employees"
          >
            Back
          </Link>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800"
            href={`/employees/${employee.id}/edit`}
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Core staff information scoped to {organization.name}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                ["Work email", display(employee.workEmail)],
                ["Phone", display(employee.phone)],
                ["Job title", display(employee.jobTitle)],
                [
                  "Department",
                  employee.department
                    ? `${employee.department.name}${employee.department.code ? ` (${employee.department.code})` : ""}`
                    : "No department",
                ],
                ["Employment type", employee.employmentType.replaceAll("_", " ")],
                ["Status", employee.status.replaceAll("_", " ")],
                ["Hire date", formatDate(employee.hireDate)],
                ["Deactivated date", formatDate(employee.terminationDate)],
              ].map(([label, value]) => (
                <div className="rounded-md border border-slate-200 p-4" key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {label}
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-slate-950">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account link</CardTitle>
            <CardDescription>
              Optional user membership connected to this employee.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-md border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Linked user
              </p>
              <p className="mt-2 text-sm font-medium text-slate-950">
                {employee.organizationMember?.user.email ?? "Not linked"}
              </p>
              {employee.organizationMember ? (
                <p className="mt-1 text-xs text-slate-500">
                  Workspace role: {roleLabels[employee.organizationMember.role]}
                </p>
              ) : null}
            </div>
            {employee.organizationMember &&
            isAdmin &&
            employee.organizationMember.role !== UserRole.OWNER &&
            employee.organizationMember.id !== viewer.id ? (
              <div className="space-y-3 rounded-md border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Workspace access
                </p>
                <form action={updateMemberRole} className="flex gap-2">
                  <input
                    name="memberId"
                    type="hidden"
                    value={employee.organizationMember.id}
                  />
                  <input name="employeeId" type="hidden" value={employee.id} />
                  <select
                    className="h-10 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    defaultValue={employee.organizationMember.role}
                    name="role"
                  >
                    {assignableRoles.map((role) => (
                      <option key={role} value={role}>
                        {roleLabels[role]}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" variant="secondary">
                    Update
                  </Button>
                </form>
                <p className="text-xs leading-5 text-slate-500">
                  Admins can view and manage employees, documents, and settings.
                </p>
                <form action={removeMemberAccess}>
                  <input
                    name="memberId"
                    type="hidden"
                    value={employee.organizationMember.id}
                  />
                  <input name="employeeId" type="hidden" value={employee.id} />
                  <ConfirmSubmitButton
                    className="w-full border-red-200 text-red-700 hover:bg-red-50"
                    confirmMessage={`Remove workspace access for ${employee.organizationMember.user.email}? They will no longer be able to log in to ${organization.name}. The employee record stays.`}
                    variant="secondary"
                  >
                    Remove workspace access
                  </ConfirmSubmitButton>
                </form>
              </div>
            ) : null}
            <div className="rounded-md border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Invite status
              </p>
              <p className="mt-2 text-sm font-medium text-slate-950">
                {employee.organizationMember
                  ? "Account active"
                  : inviteStatus(employee.invites[0])}
              </p>
              {employee.invites[0] ? (
                <div className="mt-2 space-y-1 text-xs text-slate-500">
                  <p>Expires {formatDate(employee.invites[0].expiresAt)}</p>
                  <p>
                    Delivery {employee.invites[0].deliveryStatus.toLowerCase()}
                    {employee.invites[0].sentAt
                      ? ` on ${formatDate(employee.invites[0].sentAt)}`
                      : ""}
                  </p>
                  {employee.invites[0].deliveryError ? (
                    <p className="text-red-600">
                      {employee.invites[0].deliveryError}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
            {!employee.organizationMember ? (
              <form action={inviteEmployee}>
                <input name="employeeId" type="hidden" value={employee.id} />
                <Button className="w-full" type="submit">
                  {employee.invites[0] ? "Resend invite" : "Invite employee"}
                </Button>
              </form>
            ) : null}
            <form action={deactivateEmployee}>
              <input name="id" type="hidden" value={employee.id} />
              <Button
                className="w-full border-red-200 text-red-700 hover:bg-red-50"
                disabled={employee.status === "SUSPENDED"}
                type="submit"
                variant="secondary"
              >
                {employee.status === "SUSPENDED"
                  ? "Employee deactivated"
                  : "Deactivate employee"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            Upload and manage onboarding files for this employee.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <EmployeeDocumentUploadForm employeeId={employee.id} />
          <EmployeeDocumentList documents={employee.documents} canDelete />
        </CardContent>
      </Card>

      {isAdmin ? (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Danger zone</CardTitle>
            <CardDescription>
              Permanently delete this employee record, including documents,
              invites, and history. This cannot be undone.
              {employee.organizationMember
                ? " The linked user keeps workspace access until it is removed above."
                : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={deleteEmployee}>
              <input name="id" type="hidden" value={employee.id} />
              <ConfirmSubmitButton
                className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-600"
                confirmMessage={`Permanently delete ${employee.firstName} ${employee.lastName} (${employee.employeeNumber})? Documents, invites, and history are removed. This cannot be undone.`}
              >
                Delete employee record
              </ConfirmSubmitButton>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
