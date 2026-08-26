"use client";
import { useState } from "react";

const inputClass = "w-full bg-transparent border-b border-white/10 focus:border-[#c9a84c] outline-none py-4 text-white placeholder-white/20 text-sm tracking-wide transition-colors";
const labelClass = "block text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2";

export function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Email us directly at access@fslabs.tech");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-16 max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-8 bg-[#c9a84c]" />
          <span className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase">Contact</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-6">
          Let&apos;s build<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5d060] via-[#c9a84c] to-[#9a7228]">together.</span>
        </h1>
        <p className="text-white/40 text-base max-w-md leading-relaxed">Tell us about your project. We respond within 24 hours.</p>
      </section>

      {/* Content */}
      <section className="pb-32 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-20 border-t border-[#c9a84c]/10 pt-16">

          {/* Info */}
          <div className="md:col-span-2 space-y-12">
            <div>
              <p className="text-[10px] tracking-[0.2em] text-white/25 uppercase mb-5">Reach Us</p>
              <div className="space-y-5">
                {[
                  { label: "Email", value: "access@fslabs.tech" },
                  { label: "Website", value: "fslabs.tech" },
                  { label: "Location", value: "Nigeria · Remote Worldwide" },
                ].map((c) => (
                  <div key={c.label}>
                    <p className="text-[#c9a84c]/50 text-[10px] tracking-widest uppercase mb-1">{c.label}</p>
                    <p className="text-white/60 text-sm">{c.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#c9a84c]/10 pt-10">
              <p className="text-[10px] tracking-[0.2em] text-white/25 uppercase mb-5">Office Hours</p>
              <div className="space-y-2 text-sm text-white/40">
                <p>Mon – Fri &nbsp;·&nbsp; 9am – 6pm WAT</p>
                <p>Saturday &nbsp;·&nbsp; 10am – 2pm WAT</p>
                <p className="text-[#c9a84c]/70 mt-4 text-xs">Urgent projects? We respond within hours.</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            {submitted ? (
              <div className="h-full flex flex-col justify-center py-20 text-center">
                <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center border border-[#c9a84c]/30">
                  <svg className="w-7 h-7 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h3 className="text-white text-2xl font-bold mb-3">Message Received</h3>
                <p className="text-white/35 text-sm">We&apos;ll be in touch within 24 hours. Thank you for reaching out.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@company.com" required className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div>
                    <label className={labelClass}>Company (optional)</label>
                    <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Your Company" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Service Needed</label>
                    <select name="service" value={form.service} onChange={handleChange} required
                      className="w-full bg-transparent border-b border-white/10 focus:border-[#c9a84c] outline-none py-4 text-white text-sm tracking-wide transition-colors appearance-none cursor-pointer">
                      <option value="" disabled className="bg-[#080808]">Select a service</option>
                      {["Software Development","Cybersecurity","IT Consulting","Tech Outsourcing","Cloud Solutions","Data & Analytics","Other"].map(s => (
                        <option key={s} className="bg-[#080808]">{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Your Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange}
                    placeholder="Tell us about your project, timeline, and goals..."
                    required rows={6}
                    className="w-full bg-transparent border-b border-white/10 focus:border-[#c9a84c] outline-none py-4 text-white placeholder-white/20 text-sm tracking-wide transition-colors resize-none" />
                </div>

                {error && <p className="text-red-400/70 text-xs tracking-wide">{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full py-5 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
