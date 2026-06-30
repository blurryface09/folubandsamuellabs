"use client";
import { useState } from "react";
import Link from "next/link";

const coins = ["Bitcoin (BTC)", "Tether (USDT)", "Ethereum (ETH)", "Litecoin (LTC)", "BNB", "USDC"];
const networks = ["Bitcoin Network", "Ethereum (ERC-20)", "Tron (TRC-20)", "BNB Smart Chain (BEP-20)"];

export default function CryptoTrade() {
  const [tradeType, setTradeType] = useState<"buy" | "sell">("sell");
  const [form, setForm] = useState({ name: "", email: "", phone: "", coin: "", network: "", amount: "", walletAddress: "", bankName: "", accountNumber: "", accountName: "", notes: "" });
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
        type: `Crypto ${tradeType === "sell" ? "Sale" : "Purchase"}`,
        name: form.name,
        email: form.email,
        details: {
          phone: form.phone,
          coin: form.coin,
          network: form.network,
          amount: `$${form.amount}`,
          ...(tradeType === "buy" ? { wallet_address: form.walletAddress } : { bank: form.bankName, account_number: form.accountNumber, account_name: form.accountName }),
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
        <p className="text-white/35 text-sm mb-8 leading-relaxed">Our team will review your {tradeType} request and contact you within 30 minutes during business hours.</p>
        <Link href="/exchange" className="inline-block px-8 py-3 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-xs tracking-widest uppercase hover:opacity-90 transition-opacity">
          Back to Exchange
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/exchange" className="text-white/20 hover:text-[#c9a84c] transition-colors text-sm">← Exchange</Link>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Crypto Trade</h1>
        <p className="text-white/30 text-sm mb-10">Submit a buy or sell request. We process within 30 minutes.</p>

        {/* Toggle */}
        <div className="flex mb-10 border border-white/8">
          {(["sell", "buy"] as const).map((t) => (
            <button key={t} onClick={() => setTradeType(t)} type="button"
              className={`flex-1 py-3 text-xs tracking-widest uppercase font-bold transition-all ${tradeType === t ? "bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black" : "text-white/30 hover:text-white/60"}`}>
              {t === "sell" ? "Sell Crypto" : "Buy Crypto"}
            </button>
          ))}
        </div>

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
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-5">Trade Details</p>
          </div>

          <div>
            <label className={labelClass}>Cryptocurrency</label>
            <select name="coin" value={form.coin} onChange={handleChange} required className={selectClass}>
              <option value="" disabled className="bg-[#080808]">Select coin</option>
              {coins.map(c => <option key={c} className="bg-[#080808]">{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Network</label>
            <select name="network" value={form.network} onChange={handleChange} required className={selectClass}>
              <option value="" disabled className="bg-[#080808]">Select network</option>
              {networks.map(n => <option key={n} className="bg-[#080808]">{n}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Amount (USD equivalent)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="0.00" required min="10" className={inputClass + " pl-8"} />
            </div>
          </div>

          {tradeType === "buy" ? (
            <div>
              <label className={labelClass}>Your Wallet Address</label>
              <input type="text" name="walletAddress" value={form.walletAddress} onChange={handleChange} placeholder="Paste your wallet address" required className={inputClass} />
            </div>
          ) : (
            <>
              <div className="border-t border-[#c9a84c]/10 pt-5">
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-5">Bank Details (to receive naira)</p>
              </div>
              <div>
                <label className={labelClass}>Bank Name</label>
                <input type="text" name="bankName" value={form.bankName} onChange={handleChange} placeholder="e.g. Access Bank, GTBank" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Account Number</label>
                <input type="text" name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="10-digit account number" required maxLength={10} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Account Name</label>
                <input type="text" name="accountName" value={form.accountName} onChange={handleChange} placeholder="Name on your bank account" required className={inputClass} />
              </div>
            </>
          )}

          <div>
            <label className={labelClass}>Notes (optional)</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any extra info..." rows={3}
              className="w-full bg-[#0a0a0a] border border-white/8 focus:border-[#c9a84c]/60 outline-none px-4 py-3.5 text-white placeholder-white/20 text-sm tracking-wide transition-colors resize-none" />
          </div>

          {error && <p className="text-red-400/70 text-xs border border-red-400/20 px-4 py-3 bg-red-400/5">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            {loading ? "Submitting..." : `Submit ${tradeType === "sell" ? "Sell" : "Buy"} Request`}
          </button>
          <p className="text-white/20 text-xs text-center">We will contact you via WhatsApp or email after reviewing your request.</p>
        </form>
      </div>
    </div>
  );
}
