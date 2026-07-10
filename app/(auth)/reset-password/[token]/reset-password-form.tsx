"use client";

import { useActionState } from "react";

import { resetPasswordAction } from "@/app/(auth)/password-actions";

type PasswordActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

const initialState: PasswordActionState = { ok: false };

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input name="token" type="hidden" value={token} />
      {state.message ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      ) : null}
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="password">
          New password
        </label>
        <input
          className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          id="password"
          name="password"
          placeholder="10+ chars, mixed case, number, symbol"
          type="password"
        />
        {state.fieldErrors?.password ? (
          <p className="mt-2 text-xs font-medium text-red-600">
            {state.fieldErrors.password}
          </p>
        ) : null}
      </div>
      <button
        className="inline-flex h-11 w-full items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
