"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import type {
  DepartmentFormState,
  DepartmentFormValues,
  DepartmentManagerOption,
} from "./types";

const initialState: DepartmentFormState = { ok: false };

type DepartmentFormProps = {
  action: (
    previousState: DepartmentFormState,
    formData: FormData,
  ) => Promise<DepartmentFormState>;
  cancelHref: string;
  department?: DepartmentFormValues;
  managers: DepartmentManagerOption[];
  submitLabel: string;
};

const fieldClass =
  "mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

const textareaClass =
  "mt-2 min-h-28 w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

const labelClass = "text-sm font-medium text-slate-700";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-xs font-medium text-red-600">{message}</p>;
}

export function DepartmentForm({
  action,
  cancelHref,
  department,
  managers,
  submitLabel,
}: DepartmentFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {department?.id ? (
        <input name="id" type="hidden" value={department.id} />
      ) : null}

      {state.message ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">
            Department name
          </label>
          <input
            className={fieldClass}
            defaultValue={department?.name ?? ""}
            id="name"
            name="name"
            placeholder="People Operations"
            required
          />
          <FieldError message={state.fieldErrors?.name} />
        </div>

        <div>
          <label className={labelClass} htmlFor="code">
            Code
          </label>
          <input
            className={fieldClass}
            defaultValue={department?.code ?? ""}
            id="code"
            maxLength={24}
            name="code"
            placeholder="OPS"
          />
          <FieldError message={state.fieldErrors?.code} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="managerEmployeeId">
            Department manager
          </label>
          <select
            className={fieldClass}
            defaultValue={department?.managerEmployeeId ?? ""}
            id="managerEmployeeId"
            name="managerEmployeeId"
          >
            <option value="">No manager assigned</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.firstName} {manager.lastName} · {manager.employeeNumber}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.managerEmployeeId} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="description">
            Description
          </label>
          <textarea
            className={textareaClass}
            defaultValue={department?.description ?? ""}
            id="description"
            name="description"
            placeholder="What this department owns and who it supports."
          />
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
