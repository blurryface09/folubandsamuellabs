"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

type AuthFormState = {
  ok: boolean;
  message?: string;
  successMessage?: string;
  fieldErrors?: Record<string, string>;
};

type Field = {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
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
  children?: React.ReactNode;
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
  children,
}: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm leading-6 ${
            state.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </div>
      ) : null}
      {state.successMessage ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
          {state.successMessage}
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
          <div className="relative mt-2">
            <input
              autoComplete={field.autoComplete}
              className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50 disabled:text-slate-400"
              disabled={pending}
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              type={
                field.type === "password" && visiblePasswords[field.name]
                  ? "text"
                  : field.type ?? "text"
              }
            />
            {field.type === "password" ? (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-950"
                disabled={pending}
                onClick={() =>
                  setVisiblePasswords((current) => ({
                    ...current,
                    [field.name]: !current[field.name],
                  }))
                }
                type="button"
              >
                {visiblePasswords[field.name] ? "Hide" : "Show"}
              </button>
            ) : null}
          </div>
          <FieldError message={state.fieldErrors?.[field.name]} />
        </div>
      ))}
      {children}
      <button
        className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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
