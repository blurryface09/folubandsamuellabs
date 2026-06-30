"use client";
import { useState } from "react";
import Link from "next/link";

const cards = [
  "Steam", "iTunes / Apple", "Amazon", "Google Play",
  "Xbox / Microsoft", "PlayStation (PSN)", "Visa Gift Card",
  "Mastercard Gift Card", "eBay Gift Card", "Walmart Gift Card",
  "Target Gift Card", "Sephora Gift Card", "Other",
];
const currencies = ["USD", "GBP", "EUR", "CAD", "AUD"];
const countries = ["United States (US)", "United Kingdom (UK)", "Canada (CA)", "Australia (AU)", "European Union (EU)"];

export default function GiftCardTrade() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", cardType: "", currency: "", country: "", amount: "", cardCode: "", bankName: "", accountNumber: "", accountName: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/exchange/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "Gift Card Sale",
        name: form.name,
        email: form.email,
        details: {
          phone: form.phone,
          card: form.cardType,
          currency: form.currency,
          country: form.country,
          amount: `${form.currency} ${form.amount}`,
          card_code: form.cardCode,
          bank: form.bankName,
          account_number: form.accountNumber,
          account_name: form.accountName,
          ...(form.notes ? { notes: form.notes } : {}),
        },
      }),
    });

    if (!res.ok) { setError("Failed to submit. Please try again."); setLoading(false); return; }
    setDone(true);
    setLoading(false);
  };

  const selectClass = "w-full bg-[#0a0a0a] border border-white/8 focus:border-[#c9a84c]/60 outline-none px-4 py-3.5 text-white text-sm tracking-wide transition-colors appearance-none cursor-pointer";
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
        <h2 className="text-white text-2xl font-bold mb-3">Request Submitted</h2>
        <p className="text-white/35 text-sm mb-8 leading-relaxed">Our team will confirm the rate and process your gift card within 30 minutes during business hours.</p>
        <Link href="/exchange" className="inline-block px-8 py-3 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-xs tracking-widest uppercase hover:opacity-90 transition-opacity">
          Back to Exchange
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <Link href="/exchange" className="text-white/20 hover:text-[#c9a84c] transition-colors text-sm">← Exchange</Link>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Sell Gift Card</h1>
        <p className="text-white/30 text-sm mb-10">Submit your card details. We confirm the rate and pay naira to your bank account.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Your Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Samuel Adeseko" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Phone / WhatsApp</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+234 800 000 0000" required className={inputClass} />
          </div>

          <div className="border-t border-[#c9a84c]/10 pt-5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-5">Card Details</p>
          </div>

          <div>
            <label className={labelClass}>Gift Card Type</label>
            <select name="cardType" value={form.cardType} onChange={handleChange} required className={selectClass}>
              <option value="" disabled className="bg-[#080808]">Select card type</option>
              {cards.map(c => <option key={c} className="bg-[#080808]">{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Currency</label>
              <select name="currency" value={form.currency} onChange={handleChange} required className={selectClass}>
                <option value="" disabled className="bg-[#080808]">Currency</option>
                {currencies.map(c => <option key={c} className="bg-[#080808]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Card Value</label>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="0.00" required min="5" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Card Country</label>
            <select name="country" value={form.country} onChange={handleChange} required className={selectClass}>
              <option value="" disabled className="bg-[#080808]">Select country</option>
              {countries.map(c => <option key={c} className="bg-[#080808]">{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Card Code / Redemption Code</label>
            <input type="text" name="cardCode" value={form.cardCode} onChange={handleChange} placeholder="Paste your card code here" required className={inputClass} />
            <p className="text-white/20 text-[10px] mt-1.5">We confirm the rate with you before redeeming.</p>
          </div>

          <div className="border-t border-[#c9a84c]/10 pt-5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-5">Bank Details (to receive naira)</p>
          </div>
          <div>
            <label className={labelClass}>Bank Name</label>
            <input type="text" name="bankName" value={form.bankName} onChange={handleChange} placeholder="e.g. Access Bank, GTBank" required className={inputClass} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Account Number</label>
              <input type="text" name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="10-digit account number" required maxLength={10} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Account Name</label>
              <input type="text" name="accountName" value={form.accountName} onChange={handleChange} placeholder="Name on account" required className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Notes (optional)</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any extra info..." rows={2}
              className="w-full bg-[#0a0a0a] border border-white/8 focus:border-[#c9a84c]/60 outline-none px-4 py-3.5 text-white placeholder-white/20 text-sm tracking-wide transition-colors resize-none" />
          </div>

          {error && <p className="text-red-400/70 text-xs border border-red-400/20 px-4 py-3 bg-red-400/5">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            {loading ? "Submitting..." : "Submit Gift Card"}
          </button>
          <p className="text-white/20 text-xs text-center">We will confirm the rate with you before processing.</p>
        </form>
      </div>
    </div>
  );
}
