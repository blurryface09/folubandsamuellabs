"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (signInError) { setError("Invalid email or password."); setLoading(false); return; }
    router.push("/exchange/dashboard");
  };

  const inputClass = "w-full bg-[#0a0a0a] border border-white/8 focus:border-[#c9a84c]/60 outline-none px-4 py-3.5 text-white placeholder-white/20 text-sm tracking-wide transition-colors";
  const labelClass = "block text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2";

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-6 bg-[#c9a84c]" />
          <span className="text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase">FSLabs Exchange</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-white/35 text-sm mb-10">
          No account yet?{" "}
          <Link href="/exchange/signup" className="text-[#c9a84c] hover:underline">Create one free</Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Your password" required className={inputClass} />
          </div>

          {error && <p className="text-red-400/70 text-xs border border-red-400/20 px-4 py-3 bg-red-400/5">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
