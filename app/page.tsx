"use client";
import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Particle Mesh Canvas ─── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cv: HTMLCanvasElement = canvas;
    const ctx = cv.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    let W = 0, H = 0, raf = 0;
    const COUNT = 80;
    const MAX_DIST = 160;

    interface Pt { x: number; y: number; vx: number; vy: number; r: number }
    let pts: Pt[] = [];

    function resize() {
      W = cv.offsetWidth; H = cv.offsetHeight;
      cv.width = W; cv.height = H;
    }

    function init() {
      pts = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(99,102,241,0.7)";
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${(1 - d / MAX_DIST) * 0.25})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(() => { resize(); init(); });
    ro.observe(cv);
    resize(); init(); draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.6 }}
    />
  );
}

/* ─── 3D Tilt Card ─── */
function TiltCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 2;
    const y = ((e.clientY - top) / height - 0.5) * 2;
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(10px)`;
    el.style.boxShadow = `${-x * 10}px ${y * 10}px 40px rgba(99,102,241,0.2), 0 0 40px rgba(99,102,241,0.08)`;
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
    el.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.07)";
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Scramble hook ─── */
const GLYPHS = "01ΩΨΔΦλπ∑∂≠≡±∞αβγδ!@#$%^&*";
function useScramble(text: string, delay = 500) {
  const [display, setDisplay] = useState(() => text.replace(/\S/g, "·"));
  useEffect(() => {
    const timer = setTimeout(() => {
      let frame = 0;
      const total = text.length;
      const id = setInterval(() => {
        frame++;
        const resolved = Math.floor((frame / 60) * total);
        setDisplay(text.split("").map((ch, i) => {
          if (ch === " " || ch === "\n") return ch;
          if (i < resolved) return ch;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }).join(""));
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
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── Contact Form ─── */
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "#F1F5F9",
    fontSize: 14,
    padding: "12px 16px",
    fontFamily: "var(--font-ibm-plex-sans)",
    outline: "none",
    transition: "border-color 0.2s",
  };

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
    <div style={{ padding: 40, textAlign: "center", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 16, background: "rgba(99,102,241,0.08)" }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 11l5 5 9-9" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 18, fontWeight: 600, color: "#F1F5F9", marginBottom: 8 }}>Message received</p>
      <p style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 14, color: "rgba(241,245,249,0.5)" }}>We will be in touch within 24 hours.</p>
    </div>
  );

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {(["name", "email"] as const).map(field => (
          <div key={field}>
            <label style={{ display: "block", fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.35)", marginBottom: 6 }}>
              {field}
            </label>
            <input
              required
              type={field === "email" ? "email" : "text"}
              placeholder={field === "email" ? "you@company.com" : "Your name"}
              style={inputStyle}
              value={form[field]}
              onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
        ))}
      </div>
      <div>
        <label style={{ display: "block", fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.35)", marginBottom: 6 }}>Service</label>
        <select
          required
          style={{ ...inputStyle, cursor: "pointer" }}
          value={form.service}
          onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
          onFocus={e => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)")}
          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
        >
          <option value="" disabled style={{ background: "#0D0D1A" }}>Select a service</option>
          {["Software Development", "Cybersecurity", "Digital Solutions", "FS Exchange", "Other"].map(s => (
            <option key={s} value={s} style={{ background: "#0D0D1A" }}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label style={{ display: "block", fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.35)", marginBottom: 6 }}>Message</label>
        <textarea
          required
          rows={5}
          placeholder="Tell us about your project..."
          style={{ ...inputStyle, resize: "none" }}
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          onFocus={e => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)")}
          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
        />
      </div>
      {status === "error" && (
        <p style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 12, color: "#F87171" }}>
          Something went wrong. Email us at admin@folubandsamuellabs.com
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        style={{ padding: "14px 24px", background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#fff", borderRadius: 12, border: "none", fontFamily: "var(--font-ibm-plex-sans)", fontWeight: 600, fontSize: 15, cursor: status === "sending" ? "not-allowed" : "pointer", opacity: status === "sending" ? 0.7 : 1, boxShadow: "0 0 30px rgba(99,102,241,0.35)", transition: "opacity 0.2s, transform 0.2s" }}
        onMouseEnter={e => { if (status !== "sending") (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  useReveal();
  const headline = useScramble("Your vision.\nOur execution.", 600);

  return (
    <>
      {/* ══════ HERO ══════ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 96, paddingBottom: 80, overflow: "hidden", background: "#04040A" }}>
        <ParticleCanvas />

        {/* Aurora blobs */}
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)", pointerEvents: "none", animation: "orb-drift 18s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", pointerEvents: "none", animation: "orb-drift-2 22s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: "40%", left: "40%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)", pointerEvents: "none", animation: "orb-drift-3 14s ease-in-out infinite" }} />

        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 24px", width: "100%", zIndex: 10 }}>
          <div className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", padding: "6px 16px", borderRadius: 100, marginBottom: 40 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366F1", boxShadow: "0 0 8px #6366F1", animation: "pulse-glow 2s ease-in-out infinite" }} />
            <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 11, letterSpacing: "0.12em", color: "rgba(99,102,241,0.9)" }}>
              RC 9637480 &middot; Lagos, Nigeria &middot; Est. 2026
            </span>
          </div>

          <h1 className="reveal" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 32, maxWidth: 860, whiteSpace: "pre-line", fontSize: "clamp(3rem,7.5vw,90px)" }}>
            {headline.split("\n").map((line, i) => (
              <span key={i} style={{ display: "block", background: i === 1 ? "linear-gradient(90deg, #6366F1, #8B5CF6, #22D3EE)" : "none", WebkitBackgroundClip: i === 1 ? "text" : undefined, WebkitTextFillColor: i === 1 ? "transparent" : "#F1F5F9", backgroundClip: i === 1 ? "text" : undefined, color: i === 1 ? "transparent" : "#F1F5F9" }}>
                {line}
              </span>
            ))}
          </h1>

          <p className="reveal" style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: "clamp(16px,2vw,20px)", color: "rgba(241,245,249,0.55)", lineHeight: 1.7, maxWidth: 520, marginBottom: 48 }}>
            FSLabs is a technology and cybersecurity company based in Lagos. We build software, secure systems, and deliver digital solutions for businesses that demand real results.
          </p>

          <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 80 }}>
            <a href="#contact" style={{ padding: "14px 32px", background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#fff", borderRadius: 14, fontFamily: "var(--font-ibm-plex-sans)", fontWeight: 600, fontSize: 15, textDecoration: "none", boxShadow: "0 0 30px rgba(99,102,241,0.4)", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 50px rgba(99,102,241,0.6)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(99,102,241,0.4)"; }}
            >
              Start a Project
            </a>
            <a href="#services" style={{ padding: "14px 32px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(241,245,249,0.75)", borderRadius: 14, fontFamily: "var(--font-ibm-plex-sans)", fontWeight: 500, fontSize: 15, textDecoration: "none", transition: "background 0.2s, border-color 0.2s, color 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLElement).style.color = "#F1F5F9"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.color = "rgba(241,245,249,0.75)"; }}
            >
              See What We Do &rarr;
            </a>
          </div>

          {/* Stats */}
          <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, maxWidth: 640 }}>
            {[
              { v: "2026", l: "Founded" },
              { v: "3+", l: "Service Lines" },
              { v: "50/50", l: "Founder Equity" },
              { v: "Lagos", l: "Headquarters" },
            ].map(s => (
              <div key={s.l} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px" }}>
                <p style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: 22, color: "#F1F5F9", marginBottom: 4 }}>{s.v}</p>
                <p style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(241,245,249,0.35)" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SERVICES ══════ */}
      <section id="services" style={{ position: "relative", padding: "120px 24px", background: "#04040A", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", right: 0, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ width: 32, height: 1, background: "#F97316" }} />
            <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F97316" }}>What We Do</span>
          </div>
          <h2 className="reveal" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "clamp(2rem,5vw,56px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#F1F5F9", marginBottom: 20, maxWidth: 700 }}>
            Three service lines.<br />
            <span style={{ background: "linear-gradient(90deg, #F97316, #FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" }}>
              One quality standard.
            </span>
          </h2>
          <p className="reveal" style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 16, color: "rgba(241,245,249,0.45)", lineHeight: 1.7, maxWidth: 480, marginBottom: 60 }}>
            From custom software to security operations, every service is delivered directly by the FSLabs team. No middlemen, no shortcuts.
          </p>

          <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {[
              { n: "01", title: "Software Development", accent: "#6366F1", glow: "rgba(99,102,241,0.15)",
                icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><polyline points="4 8 2 11 4 14" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="18 8 20 11 18 14" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="9" y1="18" x2="13" y2="4" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round"/></svg>,
                desc: "We design and build web apps, mobile apps, APIs, and enterprise systems from the ground up. Clean architecture, production ready code.",
                tags: ["Full Stack", "Mobile", "APIs", "Architecture"] },
              { n: "02", title: "Cybersecurity", accent: "#F97316", glow: "rgba(249,115,22,0.12)",
                icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2L4 6v5c0 4.4 3 8.4 7 9.3 4-0.9 7-4.9 7-9.3V6L11 2z" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                desc: "We run penetration tests, security audits, threat assessments, and compliance checks. CEH certified and hands on from day one.",
                tags: ["Pen Testing", "Audits", "Threat Intel", "Compliance"] },
              { n: "03", title: "Digital Solutions", accent: "#22D3EE", glow: "rgba(34,211,238,0.1)",
                icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="3" width="18" height="14" rx="2" stroke="#22D3EE" strokeWidth="1.8"/><line x1="8" y1="21" x2="14" y2="21" stroke="#22D3EE" strokeWidth="1.8" strokeLinecap="round"/><line x1="11" y1="17" x2="11" y2="21" stroke="#22D3EE" strokeWidth="1.8" strokeLinecap="round"/></svg>,
                desc: "We handle UI and UX design, product strategy, and technology consulting for businesses making the move into the digital space.",
                tags: ["UI/UX", "Strategy", "Integration", "Consulting"] },
            ].map(s => (
              <TiltCard key={s.title} style={{ padding: 32, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -40, right: -40, width: 150, height: 150, borderRadius: "50%", background: `radial-gradient(circle, ${s.glow} 0%, transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.glow}`, border: `1px solid ${s.accent}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {s.icon}
                    </div>
                    <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 11, color: "rgba(241,245,249,0.2)", letterSpacing: "0.1em" }}>{s.n}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 600, fontSize: 20, color: "#F1F5F9", marginBottom: 12, letterSpacing: "-0.02em" }}>{s.title}</h3>
                  <p style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 14, color: "rgba(241,245,249,0.5)", lineHeight: 1.7, marginBottom: 24 }}>{s.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {s.tags.map(t => (
                      <span key={t} style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10, letterSpacing: "0.08em", padding: "5px 10px", borderRadius: 6, background: `${s.glow}`, border: `1px solid ${s.accent}30`, color: s.accent }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PROCESS ══════ */}
      <section id="process" style={{ position: "relative", padding: "120px 24px", background: "#06060F", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: 0, left: "30%", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ width: 32, height: 1, background: "#6366F1" }} />
            <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6366F1" }}>How We Work</span>
          </div>
          <h2 className="reveal" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "clamp(2rem,5vw,56px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#F1F5F9", marginBottom: 60, maxWidth: 600 }}>
            Simple process.<br />
            <span style={{ background: "linear-gradient(90deg, #6366F1, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" }}>
              Real results.
            </span>
          </h2>

          <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
            {[
              { n: "01", title: "Brief", accent: "#6366F1", desc: "You tell us what you are building or what problem you are facing. We listen and ask the right questions." },
              { n: "02", title: "Scope", accent: "#8B5CF6", desc: "We define the work, set a realistic timeline, and agree on clear deliverables before anything starts." },
              { n: "03", title: "Build", accent: "#22D3EE", desc: "We do the work. Software gets built, systems get secured, solutions get shipped. No status theatre." },
              { n: "04", title: "Deliver", accent: "#F97316", desc: "You receive something that works, is documented, and is ready for the real world. That is the standard." },
            ].map((step, i) => (
              <div key={step.n} className="reveal" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 28, transition: "border-color 0.2s, background 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${step.accent}40`; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 22, fontWeight: 700, color: step.accent, opacity: 0.9 }}>{step.n}</span>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${step.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: step.accent, boxShadow: `0 0 8px ${step.accent}` }} />
                  </div>
                </div>
                <h3 style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 600, fontSize: 18, color: "#F1F5F9", marginBottom: 10, letterSpacing: "-0.01em" }}>{step.title}</h3>
                <p style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 13, color: "rgba(241,245,249,0.45)", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ ABOUT ══════ */}
      <section id="about" style={{ position: "relative", padding: "120px 24px", background: "#04040A", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), rgba(139,92,246,0.3), transparent)" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="about-grid">
            <div>
              <div className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ width: 32, height: 1, background: "#22D3EE" }} />
                <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#22D3EE" }}>About FSLabs</span>
              </div>
              <h2 className="reveal" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "clamp(2rem,4.5vw,52px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#F1F5F9", marginBottom: 24 }}>
                Built from Lagos.<br />
                <span style={{ background: "linear-gradient(90deg, #22D3EE, #6366F1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" }}>
                  Built for scale.
                </span>
              </h2>
              <div className="reveal" style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 15, color: "rgba(241,245,249,0.55)", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 16 }}>
                <p>Folub and Samuel Labs is a technology and cybersecurity company incorporated in Nigeria. We are a two founder company where both founders work directly on client projects. That is the model and that is the standard.</p>
                <p>We do not hand off your work to junior contractors or offshore teams. When you engage FSLabs, you get Adeseko Samuel on the technical implementation and Akinbayo on strategy and delivery management. Every time.</p>
              </div>
            </div>

            <div className="reveal">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { label: "Company Type", value: "Limited Liability", accent: "#6366F1" },
                  { label: "RC Number", value: "9637480", accent: "#8B5CF6" },
                  { label: "HQ", value: "Lagos, Nigeria", accent: "#22D3EE" },
                  { label: "Founded", value: "2026", accent: "#F97316" },
                  { label: "Specialties", value: "Software, Security", accent: "#6366F1" },
                  { label: "Team Size", value: "Lean and Direct", accent: "#22D3EE" },
                ].map(item => (
                  <div key={item.label} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 18 }}>
                    <p style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: item.accent, marginBottom: 6 }}>{item.label}</p>
                    <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 14, fontWeight: 600, color: "#F1F5F9" }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) { .about-grid { grid-template-columns: 1fr !important; gap: 48px !important; } }
        `}</style>
      </section>

      {/* ══════ TEAM ══════ */}
      <section id="team" style={{ position: "relative", padding: "120px 24px", background: "#06060F", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.2), rgba(139,92,246,0.2), transparent)" }} />
        <div style={{ position: "absolute", top: "30%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ width: 32, height: 1, background: "#8B5CF6" }} />
            <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B5CF6" }}>Founders</span>
          </div>
          <h2 className="reveal" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "clamp(2rem,5vw,56px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#F1F5F9", marginBottom: 16 }}>
            Built by people who<br />
            <span style={{ background: "linear-gradient(90deg, #8B5CF6, #6366F1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" }}>
              do the work.
            </span>
          </h2>
          <p className="reveal" style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 15, color: "rgba(241,245,249,0.45)", marginBottom: 60, maxWidth: 500, lineHeight: 1.7 }}>
            No account managers, no project coordinators sitting between you and the builders. Just two founders doing exactly what they said they would do.
          </p>

          <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
            {[
              { initial: "S", name: "Adeseko Samuel", role: "Co-Founder and Technical Lead", accent: "#6366F1", glow: "rgba(99,102,241,0.12)",
                bio: "Samuel is the builder. A cybersecurity professional and full stack developer who carries the full technical weight of FSLabs. From system architecture and backend engineering to security implementation and product delivery. He thinks in systems, ships in weeks, and holds the standard that everything we release has to actually work, scale, and be secure from day one.",
                tags: ["Cybersecurity", "Full Stack", "System Architecture", "Security Ops", "ALX Graduate"] },
              { initial: "A", name: "Akinbayo", role: "Co-Founder and Business Lead", accent: "#F97316", glow: "rgba(249,115,22,0.1)",
                bio: "Akinbayo is the business engine behind FSLabs. He drives strategy, client relationships, partnerships, and the commercial growth of everything we build. If FSLabs is moving, Akinbayo is making sure it moves in the right direction.",
                tags: ["Strategy", "Operations", "Business Development", "Client Relations", "Cybersecurity"] },
            ].map(f => (
              <TiltCard key={f.name} style={{ padding: 36, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${f.glow} 0%, transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${f.accent}30, ${f.accent}10)`, border: `1px solid ${f.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: 22, color: f.accent }}>{f.initial}</span>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 600, fontSize: 18, color: "#F1F5F9", letterSpacing: "-0.01em", marginBottom: 4 }}>{f.name}</h3>
                      <p style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10, letterSpacing: "0.08em", color: f.accent, textTransform: "uppercase" }}>{f.role}</p>
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 14, color: "rgba(241,245,249,0.5)", lineHeight: 1.8, marginBottom: 24 }}>{f.bio}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {f.tags.map(t => (
                      <span key={t} style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10, padding: "5px 10px", borderRadius: 6, background: `${f.glow}`, border: `1px solid ${f.accent}25`, color: f.accent }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FS EXCHANGE BANNER ══════ */}
      <section style={{ padding: "80px 24px", background: "#04040A", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.06) 50%, rgba(34,211,238,0.04) 100%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", padding: "5px 14px", borderRadius: 100, marginBottom: 24 }}>
            <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6366F1" }}>New Platform</span>
          </div>
          <h2 className="reveal" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "clamp(2rem,5vw,52px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#F1F5F9", marginBottom: 16 }}>
            Introducing{" "}
            <span style={{ background: "linear-gradient(90deg, #6366F1, #22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" }}>
              FS Exchange
            </span>
          </h2>
          <p className="reveal" style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 16, color: "rgba(241,245,249,0.5)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 36px" }}>
            Nigeria's fastest and most transparent currency exchange platform. Built by FSLabs, powered by real rates, designed for trust.
          </p>
          <a href="/exchange" className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 32px", background: "linear-gradient(135deg, #6366F1, #22D3EE)", color: "#fff", borderRadius: 14, fontFamily: "var(--font-ibm-plex-sans)", fontWeight: 600, fontSize: 15, textDecoration: "none", boxShadow: "0 0 40px rgba(99,102,241,0.3)" }}>
            Visit FS Exchange
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
      </section>

      {/* ══════ CONTACT ══════ */}
      <section id="contact" style={{ position: "relative", padding: "120px 24px", background: "#06060F", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.2), rgba(249,115,22,0.2), transparent)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "20%", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="contact-grid">
            <div>
              <div className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ width: 32, height: 1, background: "#F97316" }} />
                <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F97316" }}>Start a Project</span>
              </div>
              <h2 className="reveal" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "clamp(2rem,4.5vw,52px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#F1F5F9", marginBottom: 20 }}>
                Tell us what<br />
                <span style={{ background: "linear-gradient(90deg, #F97316, #FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" }}>
                  you need built.
                </span>
              </h2>
              <p className="reveal" style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 15, color: "rgba(241,245,249,0.45)", lineHeight: 1.8, marginBottom: 48 }}>
                Whether it is a product, a security audit, or a digital solution, send us the brief and we will come back with a clear plan within 24 hours.
              </p>
              <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { label: "Email", value: "admin@folubandsamuellabs.com", accent: "#6366F1" },
                  { label: "Location", value: "Lagos, Nigeria", accent: "#8B5CF6" },
                  { label: "RC Number", value: "9637480", accent: "#22D3EE" },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${item.accent}15`, border: `1px solid ${item.accent}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 9, color: item.accent, letterSpacing: "0.05em" }}>{item.label.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(241,245,249,0.3)", marginBottom: 3 }}>{item.label}</p>
                      <p style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 13, color: "rgba(241,245,249,0.7)", wordBreak: "break-all" }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal">
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: 40 }}>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; } }
        `}</style>
      </section>
    </>
  );
}
