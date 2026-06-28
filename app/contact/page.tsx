"use client";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <section className="pt-32 pb-12 max-w-4xl mx-auto px-6 text-center">
        <p className="text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-3">Contact</p>
        <h1 className="text-5xl font-bold text-white mb-6">Let's Work Together</h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Tell us about your project. We'll get back to you within 24 hours to discuss how we can help.
        </p>
      </section>

      <section className="pb-24 max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        {/* Contact info */}
        <div>
          <div className="space-y-6 mb-10">
            {[
              { icon: "📧", label: "Email", value: "sekosamuel@gmail.com" },
              { icon: "🌐", label: "Website", value: "folubandsamuellabs.com" },
              { icon: "📍", label: "Location", value: "Nigeria · Remote Worldwide" },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-4">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">{c.label}</p>
                  <p className="text-white text-sm">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl border border-cyan-900/30 bg-[#0a1220]">
            <p className="text-white font-semibold mb-2">Office Hours</p>
            <p className="text-slate-400 text-sm">Monday – Friday: 9am – 6pm WAT</p>
            <p className="text-slate-400 text-sm">Saturday: 10am – 2pm WAT</p>
            <p className="text-cyan-400 text-sm mt-3 font-medium">Urgent? We respond within hours.</p>
          </div>
        </div>

        {/* Form */}
        <div>
          {submitted ? (
            <div className="p-8 rounded-2xl border border-cyan-500/40 bg-cyan-500/5 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-white text-xl font-bold mb-2">Message Received!</h3>
              <p className="text-slate-400">Thanks for reaching out. We'll be in touch within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
                { name: "email", label: "Email Address", type: "email", placeholder: "john@company.com" },
                { name: "company", label: "Company (optional)", type: "text", placeholder: "Your Company" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm text-slate-400 mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={form[f.name as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    required={f.name !== "company"}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a1220] border border-cyan-900/30 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors text-sm"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Service Needed</label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#0a1220] border border-cyan-900/30 text-white focus:outline-none focus:border-cyan-500/60 transition-colors text-sm"
                >
                  <option value="" disabled>Select a service</option>
                  <option>Software Development</option>
                  <option>Cybersecurity</option>
                  <option>IT Consulting</option>
                  <option>Tech Outsourcing</option>
                  <option>Cloud Solutions</option>
                  <option>Data & Analytics</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project or challenge..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a1220] border border-cyan-900/30 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm transition-all hover:scale-[1.02]"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
