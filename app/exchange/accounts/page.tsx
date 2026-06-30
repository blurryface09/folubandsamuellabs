"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const accountTypes = [
  { id: "cashapp", label: "CashApp", tag: "US Digital Wallet", desc: "Receive USD from US clients via $Cashtag. Widely used by freelancers." },
  { id: "zelle", label: "Zelle", tag: "US Bank Transfer", desc: "Instant US bank transfers. Linked to a real US bank account." },
  { id: "paypal", label: "PayPal", tag: "Global", desc: "Accept payments from clients worldwide in USD, GBP, EUR and more." },
  { id: "venmo", label: "Venmo", tag: "US Digital Wallet", desc: "Popular US wallet for receiving service and freelance payments." },
  { id: "chime", label: "Chime", tag: "US Bank Account", desc: "Real US checking account with routing number. Accepts ACH & direct deposit." },
  { id: "sofi", label: "SoFi", tag: "US Bank Account", desc: "Full US bank account. Accepts wire transfers, ACH, and direct deposits." },
  { id: "usd_bank", label: "USD Bank Account", tag: "Traditional Bank", desc: "SWIFT-enabled USD account for large international wire transfers." },
  { id: "gbp_bank", label: "GBP Bank Account", tag: "Traditional Bank", desc: "UK bank account for receiving payments from UK-based clients." },
];

export default function Accounts() {
  const [selected, setSelected] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", purpose: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) { setError("Please select an account type."); return; }
    setLoading(true);
    setError("");

    const res = await fetch("/api/exchange/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "Account Request",
        name: form.name,
        email: form.email,
        details: {
          account_type: selected,
          phone: form.phone,
          purpose: form.purpose,
          ...(form.notes ? { notes: form.notes } : {}),
        },
      }),
    });

    if (!res.ok) { setError("Failed to submit. Please try again."); setLoading(false); return; }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("exchange_requests").insert({
        user_id: user.id,
        type: "account_request",
        details: { account_type: selected, phone: form.phone, purpose: form.purpose },
        status: "pending",
      });
    }

    setDone(true);
    setLoading(false);
  };

  const inputClass = "w-full bg-[#0a0a0a] border border-white/8 focus:border-[#c9a84c]/60 outline-none px-4 py-3.5 text-white placeholder-white/20 text-sm tracking-wide transition-colors";
  const labelClass = "block text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2";

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center border border-[#c9a84c]/30">
          <svg className="w-7 h-7 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 className="text-white text-2xl font-bold mb-3">Request Received</h2>
        <p className="text-white/35 text-sm mb-8 leading-relaxed">Our team will review your account request and reach out within 24 hours with setup steps and any applicable fees.</p>
        <Link href="/exchange" className="inline-block px-8 py-3 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-xs tracking-widest uppercase hover:opacity-90 transition-opacity">
          Back to Exchange
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/exchange" className="text-white/20 hover:text-[#c9a84c] transition-colors text-sm">← Exchange</Link>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Get a Payment Account</h1>
        <p className="text-white/30 text-sm mb-12">Pick the account you need. We handle setup and deliver your access credentials securely.</p>

        <div className="mb-12">
          <p className={labelClass}>Select Account Type</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#c9a84c]/10">
            {accountTypes.map((a) => (
              <button key={a.id} type="button" onClick={() => setSelected(a.id)}
                className={`text-left p-6 transition-colors relative group ${selected === a.id ? "bg-[#0f0c05] border border-[#c9a84c]/30" : "bg-[#080808] hover:bg-[#0b0906] border border-transparent"}`}>
                {selected === a.id && (
                  <div className="absolute top-3 right-3 w-4 h-4 border border-[#c9a84c]/50 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#c9a84c]" />
                  </div>
                )}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className={`font-bold text-sm transition-colors ${selected === a.id ? "text-[#c9a84c]" : "text-white group-hover:text-[#c9a84c]"}`}>{a.label}</p>
                  <span className="text-[9px] tracking-widest uppercase text-[#c9a84c]/40 border border-[#c9a84c]/15 px-2 py-0.5 shrink-0">{a.tag}</span>
                </div>
                <p className="text-white/30 text-xs leading-relaxed">{a.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="border-t border-[#c9a84c]/10 pt-8">
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-6">Your Details</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="As on your ID" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Phone / WhatsApp</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+234 800 000 0000" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Purpose of Account</label>
              <input type="text" name="purpose" value={form.purpose} onChange={handleChange} placeholder="e.g. Receive freelance payments" required className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Additional Notes (optional)</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any specific requirements..." rows={3}
              className="w-full bg-[#0a0a0a] border border-white/8 focus:border-[#c9a84c]/60 outline-none px-4 py-3.5 text-white placeholder-white/20 text-sm tracking-wide transition-colors resize-none" />
          </div>

          {error && <p className="text-red-400/70 text-xs border border-red-400/20 px-4 py-3 bg-red-400/5">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            {loading ? "Submitting..." : "Submit Account Request"}
          </button>
          <p className="text-white/20 text-xs text-center leading-relaxed">We will contact you within 24 hours with setup details and any applicable fees.</p>
        </form>
      </div>
    </div>
  );
}
