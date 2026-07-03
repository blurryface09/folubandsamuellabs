"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ─── Scramble hook ─── */
const GLYPHS = "!@#$%^&*<>?/|\\[]{}01ΩΨΔΦλπ∑∂≠≡±∞αβγδεζ";
function useScramble(text: string, delay = 400) {
  const [display, setDisplay] = useState(() => text.replace(/\S/g, "·"));
  useEffect(() => {
    const timer = setTimeout(() => {
      let frame = 0;
      const total = text.length;
      const id = setInterval(() => {
        frame++;
        const resolved = Math.floor((frame / 70) * total);
        setDisplay(
          text.split("").map((ch, i) => {
            if (ch === " " || ch === "\n") return ch;
            if (i < resolved) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }).join("")
        );
        if (resolved >= total) clearInterval(id);
      }, 30);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);
  return display;
}

/* ─── Scroll reveal ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add("visible"); obs.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── Contact form ─── */
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const fieldCls = "w-full bg-white border border-[#E5E0D8] text-[#1A1714] text-sm px-4 py-3 rounded-sm placeholder:text-[#7A746D]/50 focus:outline-none focus:border-[#4F46E5] transition-colors";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") return (
    <div className="border border-[#4F46E5]/20 bg-[#EEF2FF] p-10 text-center rounded-sm">
      <p className="text-[#4F46E5] text-xs tracking-widest uppercase mb-2 font-medium" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>Message received</p>
      <p className="text-[#7A746D] text-sm" style={{ fontFamily: "var(--font-ibm-plex-sans)" }}>We will be in touch within 24 hours.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] tracking-[0.15em] uppercase text-[#7A746D] mb-1.5 font-medium" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>Name</label>
          <input required className={fieldCls} placeholder="Your name"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.15em] uppercase text-[#7A746D] mb-1.5 font-medium" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>Email</label>
          <input required type="email" className={fieldCls} placeholder="you@company.com"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
      </div>
      <div>
        <label className="block text-[10px] tracking-[0.15em] uppercase text-[#7A746D] mb-1.5 font-medium" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>Service</label>
        <select required className={fieldCls}
          value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
          <option value="" disabled>Select a service</option>
          <option value="Software Development">Software Development</option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="Digital Solutions">Digital Solutions</option>
          <option value="FSLabs Exchange">FSLabs Exchange</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-[10px] tracking-[0.15em] uppercase text-[#7A746D] mb-1.5 font-medium" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>Message</label>
        <textarea required rows={5} className={fieldCls} placeholder="Tell us about your project..."
          value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
      </div>
      {status === "error" && (
        <p className="text-red-500 text-xs" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
          Something went wrong. Email us at admin@folubandsamuellabs.com
        </p>
      )}
      <button type="submit" disabled={status === "sending"}
        className="w-full py-3.5 bg-[#4F46E5] text-white font-semibold text-sm tracking-wide rounded-sm hover:bg-[#4338CA] transition-colors disabled:opacity-50"
        style={{ fontFamily: "var(--font-ibm-plex-sans)" }}>
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

export default function Home() {
  useReveal();
  const headline = useScramble("Your vision.\nOur execution.", 600);

  return (
    <>
      {/* ══════ HERO ══════ */}
      <section className="relative min-h-screen flex flex-col justify-center pt-28 pb-20 overflow-hidden bg-[#FAFAF8]">
        {/* Soft gradient blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#4F46E5]/8 blur-3xl pointer-events-none"
          style={{ animation: "orb-drift 16s ease-in-out infinite" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#F97316]/8 blur-3xl pointer-events-none"
          style={{ animation: "orb-drift-2 20s ease-in-out infinite" }} />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-[#0891B2]/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 w-full z-10">
          <div className="inline-flex items-center gap-2 bg-[#EEF2FF] border border-[#4F46E5]/20 px-4 py-1.5 rounded-full mb-10 reveal">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
            <span className="text-[#4F46E5] text-[11px] tracking-wide" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
              RC 9637480 · Lagos, Nigeria · Est. 2026
            </span>
          </div>

          <h1 className="font-bold leading-[1.08] tracking-tight mb-8 max-w-4xl whitespace-pre-line reveal"
            style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(2.8rem,7vw,84px)", color: "#1A1714" }}>
            {headline.split("\n").map((line, i) => (
              <span key={i} className={`block ${i === 1 ? "text-[#4F46E5]" : ""}`}>{line}</span>
            ))}
          </h1>

          <p className="text-[#7A746D] text-lg md:text-xl max-w-xl leading-relaxed mb-12 reveal"
            style={{ fontFamily: "var(--font-ibm-plex-sans)" }}>
            FSLabs is a technology and cybersecurity company based in Lagos. We build software, secure systems, and deliver digital solutions for businesses that need it done right.
          </p>

          <div className="flex flex-wrap gap-4 mb-20 reveal">
            <a href="/#contact"
              className="px-8 py-3.5 bg-[#4F46E5] text-white font-semibold text-sm rounded-sm hover:bg-[#4338CA] transition-colors"
              style={{ fontFamily: "var(--font-ibm-plex-sans)" }}>
              Start a Project
            </a>
            <a href="/#services"
              className="px-8 py-3.5 border border-[#E5E0D8] text-[#7A746D] text-sm rounded-sm hover:border-[#4F46E5]/40 hover:text-[#4F46E5] transition-all bg-white"
              style={{ fontFamily: "var(--font-ibm-plex-sans)" }}>
              See What We Do →
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 reveal">
            {[
              { v: "2026", l: "Founded" },
              { v: "3", l: "Service Lines" },
              { v: "50/50", l: "Founder Equity" },
              { v: "Lagos", l: "HQ" },
            ].map(s => (
              <div key={s.l} className="bg-white border border-[#E5E0D8] rounded-sm px-5 py-4 hover:border-[#4F46E5]/30 transition-colors">
                <p className="text-[#4F46E5] text-xl font-bold mb-0.5" style={{ fontFamily: "var(--font-space-grotesk)" }}>{s.v}</p>
                <p className="text-[#7A746D] text-[10px] tracking-widest uppercase" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SERVICES ══════ */}
      <section id="services" className="relative py-28 bg-[#F2EFE9]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 mb-4 reveal">
            <span className="w-5 h-px bg-[#F97316]" />
            <span className="text-[#F97316] text-[10px] tracking-[0.25em] uppercase font-medium" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>What We Do</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1714] mb-4 reveal" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Three service lines.<br />
            <span className="text-[#F97316]">One quality standard.</span>
          </h2>
          <p className="text-[#7A746D] max-w-lg mb-14 leading-relaxed reveal" style={{ fontFamily: "var(--font-ibm-plex-sans)" }}>
            From custom software to security operations, every service is delivered directly by the FSLabs team with no middlemen and no shortcuts.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 reveal">
            {[
              { n: "01", title: "Software Development", color: "#4F46E5", bg: "#EEF2FF", icon: "⚡",
                desc: "We design and build web apps, mobile apps, APIs, and enterprise systems from the ground up. Clean architecture, production ready code.",
                tags: ["Full Stack", "Mobile", "APIs", "Architecture"] },
              { n: "02", title: "Cybersecurity", color: "#F97316", bg: "#FFF7ED", icon: "🛡",
                desc: "We run penetration tests, security audits, threat assessments, and compliance checks. CEH certified and hands on from day one.",
                tags: ["Pen Testing", "Audits", "Threat Intel", "Compliance"] },
              { n: "03", title: "Digital Solutions", color: "#0891B2", bg: "#ECFEFF", icon: "✦",
                desc: "We handle UI and UX design, product strategy, and technology consulting for businesses making the move into the digital space.",
                tags: ["UI UX", "Strategy", "Integration", "Consulting"] },
            ].map(s => (
              <div key={s.title} className="bg-white rounded-lg p-8 border border-[#E5E0D8] hover:border-transparent hover:shadow-lg transition-all group">
                <div className="w-10 h-10 rounded-md flex items-center justify-center text-lg mb-5" style={{ background: s.bg }}>
                  {s.icon}
                </div>
                <p className="text-[10px] tracking-[0.2em] mb-3 font-medium" style={{ fontFamily: "var(--font-ibm-plex-mono)", color: s.color }}>{s.n}</p>
                <h3 className="text-lg font-semibold text-[#1A1714] mb-3" style={{ fontFamily: "var(--font-space-grotesk)" }}>{s.title}</h3>
                <p className="text-[#7A746D] text-sm leading-relaxed mb-5" style={{ fontFamily: "var(--font-ibm-plex-sans)" }}>{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map(t => (
                    <span key={t} className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                      style={{ background: s.bg, color: s.color, fontFamily: "var(--font-ibm-plex-mono)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PROCESS ══════ */}
      <section id="process" className="relative py-28 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 mb-4 reveal">
            <span className="w-5 h-px bg-[#4F46E5]" />
            <span className="text-[#4F46E5] text-[10px] tracking-[0.25em] uppercase font-medium" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>How We Work</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1714] mb-4 reveal" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Simple process.<br /><span className="text-[#4F46E5]">Real results.</span>
          </h2>
          <p className="text-[#7A746D] max-w-lg mb-14 leading-relaxed reveal" style={{ fontFamily: "var(--font-ibm-plex-sans)" }}>
            We keep it straightforward. You tell us what you need, we scope it honestly, build it properly, and hand it over working.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 reveal">
            {[
              { n: "01", title: "Brief", color: "#4F46E5", bg: "#EEF2FF",
                desc: "You tell us what you are building or what problem you are facing. We listen and ask the right questions." },
              { n: "02", title: "Scope", color: "#F97316", bg: "#FFF7ED",
                desc: "We define the work, set a realistic timeline, and agree on clear deliverables before anything starts." },
              { n: "03", title: "Build", color: "#0891B2", bg: "#ECFEFF",
                desc: "We do the work. Software gets built, systems get secured, solutions get shipped. No status theatre." },
              { n: "04", title: "Deliver", color: "#4F46E5", bg: "#EEF2FF",
                desc: "You receive something that works, is documented, and is ready for the real world. That is the standard." },
            ].map(step => (
              <div key={step.n} className="bg-white rounded-lg p-7 border border-[#E5E0D8] hover:shadow-md transition-all">
                <div className="w-9 h-9 rounded-md flex items-center justify-center text-sm font-bold mb-5"
                  style={{ background: step.bg, color: step.color, fontFamily: "var(--font-ibm-plex-mono)" }}>
                  {step.n}
                </div>
                <h3 className="text-base font-semibold text-[#1A1714] mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>{step.title}</h3>
                <p className="text-[#7A746D] text-sm leading-relaxed" style={{ fontFamily: "var(--font-ibm-plex-sans)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TEAM ══════ */}
      <section id="team" className="relative py-28 bg-[#F2EFE9]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 mb-4 reveal">
            <span className="w-5 h-px bg-[#0891B2]" />
            <span className="text-[#0891B2] text-[10px] tracking-[0.25em] uppercase font-medium" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>Founders</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1714] mb-14 reveal" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Built by people who<br /><span className="text-[#0891B2]">do the work.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal">
            {[
              { initial: "S", name: "Adeseko Samuel", role: "Co-Founder and Technical Lead", color: "#4F46E5", bg: "#EEF2FF",
                bio: "Samuel is the builder. A cybersecurity professional and full stack developer who carries the full technical weight of FSLabs. From system architecture and backend engineering to security implementation and product delivery. He thinks in systems, ships in weeks, and holds the standard that everything we release has to actually work, scale, and be secure from day one.",
                tags: ["Cybersecurity", "Full Stack", "System Architecture", "Security Ops", "ALX Graduate"] },
              { initial: "A", name: "Akinbayo", role: "Co-Founder and Business Lead", color: "#F97316", bg: "#FFF7ED",
                bio: "Akinbayo is the business engine behind FSLabs. He drives strategy, client relationships, partnerships, and the commercial growth of everything we build. If FSLabs is moving, Akinbayo is making sure it moves in the right direction.",
                tags: ["Strategy", "Operations", "Business Development", "Client Relations", "Cybersecurity"] },
            ].map(f => (
              <div key={f.name} className="bg-white rounded-lg p-8 border border-[#E5E0D8] hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                    style={{ background: f.bg, color: f.color, fontFamily: "var(--font-space-grotesk)" }}>
                    {f.initial}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#1A1714]" style={{ fontFamily: "var(--font-space-grotesk)" }}>{f.name}</h3>
                    <p className="text-[10px] tracking-wide font-medium mt-0.5" style={{ fontFamily: "var(--font-ibm-plex-mono)", color: f.color }}>{f.role}</p>
                  </div>
                </div>
                <p className="text-[#7A746D] text-sm leading-relaxed mb-5" style={{ fontFamily: "var(--font-ibm-plex-sans)" }}>{f.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.tags.map(t => (
                    <span key={t} className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                      style={{ background: f.bg, color: f.color, fontFamily: "var(--font-ibm-plex-mono)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CONTACT ══════ */}
      <section id="contact" className="relative py-28 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

            {/* Left */}
            <div className="reveal">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-5 h-px bg-[#F97316]" />
                <span className="text-[#F97316] text-[10px] tracking-[0.25em] uppercase font-medium" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>Start a Project</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1A1714] mb-5 leading-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Tell us what<br />you need built.
              </h2>
              <p className="text-[#7A746D] text-sm leading-relaxed mb-10" style={{ fontFamily: "var(--font-ibm-plex-sans)" }}>
                Whether it is a product, a security audit, or a digital solution, send us the brief and we will come back with a clear plan within 24 hours.
              </p>
              <div className="space-y-4">
                {[
                  { label: "Email", value: "admin@folubandsamuellabs.com" },
                  { label: "Location", value: "Lagos, Nigeria" },
                  { label: "RC Number", value: "9637480" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="text-[10px] tracking-wide uppercase text-[#7A746D] w-20 flex-shrink-0 font-medium" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>{item.label}</span>
                    <span className="text-[#1A1714] text-xs" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div className="bg-white rounded-lg border border-[#E5E0D8] p-8 reveal">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
