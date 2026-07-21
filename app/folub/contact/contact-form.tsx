"use client";

import { useState } from "react";

const intents = [
  "General enquiry",
  "Buying a property",
  "Selling a property",
  "Development / partnership",
  "Careers",
];

type Status = "idle" | "sending" | "success" | "error";

const fieldClass =
  "w-full rounded-md border border-[#E2DCD0] bg-[#FBFAF6] px-4 py-3 text-[#1B2A38] placeholder:text-[#9C978B] focus:border-[#C6A24A] focus:bg-white focus:outline-none";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[#6E6A5F]";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/folub/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C6A24A] text-2xl text-[#16283A]">
          ✓
        </div>
        <h3 className="font-display mt-5 text-2xl text-[#213A54]">Message received.</h3>
        <p className="mt-2 max-w-sm text-[#6E6A5F]">
          Thanks for reaching out — a member of the FOLUB team will get back to you
          within one business day. Check your inbox for a confirmation.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-[#213A54] underline-offset-4 hover:text-[#A9863A] hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>Full name *</label>
          <input id="name" name="name" required className={fieldClass} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email *</label>
          <input id="email" name="email" type="email" required className={fieldClass} placeholder="you@email.com" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>Phone</label>
          <input id="phone" name="phone" className={fieldClass} placeholder="+234 …" />
        </div>
        <div>
          <label htmlFor="intent" className={labelClass}>I&apos;m looking to *</label>
          <select id="intent" name="intent" required defaultValue="" className={fieldClass}>
            <option value="" disabled>Select an option</option>
            {intents.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>Message *</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`${fieldClass} resize-y`}
          placeholder="Tell us what you're looking for…"
        />
      </div>

      {status === "error" && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}. Please try again or email us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded bg-[#C6A24A] px-6 py-3.5 text-sm font-semibold text-[#16283A] transition-colors hover:bg-[#D9BE7C] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      <p className="text-xs text-[#9C978B]">
        By submitting, you agree to be contacted by FOLUB Builders about your enquiry.
      </p>
    </form>
  );
}
