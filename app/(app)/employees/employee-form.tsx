"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import type {
  EmployeeFormDepartment,
  EmployeeFormState,
  EmployeeFormValues,
} from "./types";

const statusOptions = [
  ["ACTIVE", "Active"],
  ["ON_LEAVE", "On leave"],
  ["SUSPENDED", "Suspended"],
  ["TERMINATED", "Terminated"],
];

const employmentTypeOptions = [
  ["FULL_TIME", "Full time"],
  ["PART_TIME", "Part time"],
  ["CONTRACT", "Contract"],
  ["INTERN", "Intern"],
  ["TEMPORARY", "Temporary"],
];

const initialState: EmployeeFormState = { ok: false };

type EmployeeFormProps = {
  action: (
    previousState: EmployeeFormState,
    formData: FormData,
  ) => Promise<EmployeeFormState>;
  departments: EmployeeFormDepartment[];
  employee?: EmployeeFormValues;
  submitLabel: string;
  cancelHref: string;
};

function dateValue(value?: Date | string | null) {
  if (!value) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value.slice(0, 10);
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-xs font-medium text-red-600">{message}</p>;
}

const fieldClass =
  "mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

const labelClass = "text-sm font-medium text-slate-700";

export function EmployeeForm({
  action,
  departments,
  employee,
  submitLabel,
  cancelHref,
}: EmployeeFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {employee?.id ? <input type="hidden" name="id" value={employee.id} /> : null}
      {state.message ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="employeeNumber">
            Employee code
          </label>
          <input
            className={fieldClass}
            defaultValue={employee?.employeeNumber ?? ""}
            id="employeeNumber"
            name="employeeNumber"
            placeholder="FSL-0002"
            required
          />
          <FieldError message={state.fieldErrors?.employeeNumber} />
        </div>

        <div>
          <label className={labelClass} htmlFor="departmentId">
            Department
          </label>
          <select
            className={fieldClass}
            defaultValue={employee?.departmentId ?? ""}
            id="departmentId"
            name="departmentId"
          >
            <option value="">No department yet</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
                {department.code ? ` (${department.code})` : ""}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.departmentId} />
        </div>

        <div>
          <label className={labelClass} htmlFor="firstName">
            First name
          </label>
          <input
            className={fieldClass}
            defaultValue={employee?.firstName ?? ""}
            id="firstName"
            name="firstName"
            placeholder="Ada"
            required
          />
          <FieldError message={state.fieldErrors?.firstName} />
        </div>

        <div>
          <label className={labelClass} htmlFor="lastName">
            Last name
          </label>
          <input
            className={fieldClass}
            defaultValue={employee?.lastName ?? ""}
            id="lastName"
            name="lastName"
            placeholder="Okafor"
            required
          />
          <FieldError message={state.fieldErrors?.lastName} />
        </div>

        <div>
          <label className={labelClass} htmlFor="workEmail">
            Work email
          </label>
          <input
            className={fieldClass}
            defaultValue={employee?.workEmail ?? ""}
            id="workEmail"
            name="workEmail"
            placeholder="name@company.com"
            type="email"
          />
          <FieldError message={state.fieldErrors?.workEmail} />
        </div>

        <div>
          <label className={labelClass} htmlFor="phone">
            Phone
          </label>
          <input
            className={fieldClass}
            defaultValue={employee?.phone ?? ""}
            id="phone"
            name="phone"
            placeholder="+234..."
          />
          <FieldError message={state.fieldErrors?.phone} />
        </div>

        <div>
          <label className={labelClass} htmlFor="jobTitle">
            Job title
          </label>
          <input
            className={fieldClass}
            defaultValue={employee?.jobTitle ?? ""}
            id="jobTitle"
            name="jobTitle"
            placeholder="HR Operations Lead"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="hireDate">
            Hire date
          </label>
          <input
            className={fieldClass}
            defaultValue={dateValue(employee?.hireDate)}
            id="hireDate"
            name="hireDate"
            type="date"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="employmentType">
            Employment type
          </label>
          <select
            className={fieldClass}
            defaultValue={employee?.employmentType ?? "FULL_TIME"}
            id="employmentType"
            name="employmentType"
            required
          >
            {employmentTypeOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.employmentType} />
        </div>

        <div>
          <label className={labelClass} htmlFor="status">
            Status
          </label>
          <select
            className={fieldClass}
            defaultValue={employee?.status ?? "ACTIVE"}
            id="status"
            name="status"
            required
          >
            {statusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.status} />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          href={cancelHref}
        >
          Cancel
        </Link>
        <Button disabled={pending} type="submit">
          {pending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
