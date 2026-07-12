"use client";

import { useActionState, useState } from "react";

import { acceptInviteAction } from "./actions";

type AcceptInviteState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

const initialState: AcceptInviteState = { ok: false };

export function InviteAcceptForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(
    acceptInviteAction,
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);

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
          Password
        </label>
        <div className="relative mt-2">
          <input
            autoComplete="new-password"
            className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            id="password"
            name="password"
            placeholder="10+ chars, number, symbol"
            type={showPassword ? "text" : "password"}
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-950"
            onClick={() => setShowPassword((value) => !value)}
            type="button"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {state.fieldErrors?.password ? (
          <p className="mt-2 text-xs font-medium text-red-600">
            {state.fieldErrors.password}
          </p>
        ) : null}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          autoComplete="new-password"
          className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Repeat password"
          type={showPassword ? "text" : "password"}
        />
        {state.fieldErrors?.confirmPassword ? (
          <p className="mt-2 text-xs font-medium text-red-600">
            {state.fieldErrors.confirmPassword}
          </p>
        ) : null}
      </div>
      <button
        className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Activating..." : "Activate account"}
      </button>
    </form>
  );
}
