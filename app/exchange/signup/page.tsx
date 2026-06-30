"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.fullName, phone: form.phone } },
    });

    if (signUpError) { setError(signUpError.message); setLoading(false); return; }
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
        <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
        <p className="text-white/35 text-sm mb-10">
          Already have an account?{" "}
          <Link href="/exchange/login" className="text-[#c9a84c] hover:underline">Sign in</Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Full Name</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Samuel Adeseko" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone / WhatsApp</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+234 800 000 0000" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" required minLength={8} className={inputClass} />
          </div>

          {error && <p className="text-red-400/70 text-xs border border-red-400/20 px-4 py-3 bg-red-400/5">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-white/20 text-xs text-center mt-8">By creating an account you agree to our terms of service.</p>
      </div>
    </div>
  );
}
