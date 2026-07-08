"use client";

import { useActionState } from "react";
import Link from "next/link";

type AuthFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

type Field = {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
};

type AuthFormProps = {
  action: (
    previousState: AuthFormState,
    formData: FormData,
  ) => Promise<AuthFormState>;
  fields: Field[];
  submitLabel: string;
  footerText: string;
  footerHref: string;
  footerLabel: string;
};

const initialState: AuthFormState = { ok: false };

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-xs font-medium text-red-600">{message}</p>;
}

export function AuthForm({
  action,
  fields,
  submitLabel,
  footerText,
  footerHref,
  footerLabel,
}: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      ) : null}
      {fields.map((field) => (
        <div key={field.name}>
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor={field.name}
          >
            {field.label}
          </label>
          <input
            className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            type={field.type ?? "text"}
          />
          <FieldError message={state.fieldErrors?.[field.name]} />
        </div>
      ))}
      <button
        className="inline-flex h-11 w-full items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Please wait..." : submitLabel}
      </button>
      <p className="text-center text-sm text-slate-500">
        {footerText}{" "}
        <Link className="font-medium text-slate-950 hover:underline" href={footerHref}>
          {footerLabel}
        </Link>
      </p>
    </form>
  );
}
