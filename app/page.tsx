"use client";
import { useEffect, useRef, useState, useCallback } from "react";

/* ══════════════════════════════════════════════
   GOLD PARTICLE CANVAS (adapted from 21st.dev)
══════════════════════════════════════════════ */
function GoldParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number; y: number; speed: number; opacity: number;
    fadeDelay: number; fadeStart: number; fadingOut: boolean;
    size: number;
  }>>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cv: HTMLCanvasElement = canvas;
    const ctx = cv.getContext("2d") as CanvasRenderingContext2D;

    function makeParticle() {
      return {
        x: Math.random() * cv.width,
        y: Math.random() * cv.height,
        speed: Math.random() * 0.3 + 0.08,
        opacity: 1,
        fadeDelay: Math.random() * 800 + 200,
        fadeStart: Date.now() + Math.random() * 800 + 200,
        fadingOut: false,
        size: Math.random() * 1.4 + 0.3,
      };
    }

    function resize() {
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
      const count = Math.floor((cv.width * cv.height) / 5000);
      particlesRef.current = Array.from({ length: count }, makeParticle);
    }

    function animate() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (const p of particlesRef.current) {
        p.y -= p.speed;
        if (p.y < 0) {
          p.x = Math.random() * cv.width;
          p.y = cv.height;
          p.opacity = 1;
          p.fadingOut = false;
          p.fadeStart = Date.now() + p.fadeDelay;
        }
        if (!p.fadingOut && Date.now() > p.fadeStart) p.fadingOut = true;
        if (p.fadingOut) {
          p.opacity -= 0.006;
          if (p.opacity <= 0) {
            p.x = Math.random() * cv.width;
            p.y = cv.height;
            p.opacity = 1;
            p.fadingOut = false;
            p.fadeStart = Date.now() + p.fadeDelay;
          }
        }
        const r = Math.floor(200 + Math.random() * 55);
        const g = Math.floor(150 + Math.random() * 68);
        ctx.fillStyle = `rgba(${r},${g},40,${p.opacity * 0.85})`;
        ctx.fillRect(p.x, p.y, p.size, Math.random() * 2.5 + 1);
      }
      rafRef.current = requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1, opacity: 0.7 }} />
  );
}

/* ══════════════════════════════════════════════
   GOLD SPOTLIGHTS
══════════════════════════════════════════════ */
function GoldSpotlights() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {[
        { rotate: "25deg", dur: "17s", delay: "0s" },
        { rotate: "-25deg", dur: "13s", delay: "0.5s" },
        { rotate: "0deg", dur: "21s", delay: "1s", reverse: true },
      ].map((s, i) => (
        <div key={i} style={{
          position: "absolute", left: 0, right: 0, top: "4em",
          margin: "0 auto", width: "36em", height: "90vh",
          borderRadius: "0 0 50% 50%",
          backgroundImage: "conic-gradient(from 0deg at 50% -5%, transparent 43%, rgba(201,168,76,0.18) 48%, rgba(201,168,76,0.35) 50%, rgba(201,168,76,0.18) 52%, transparent 57%)",
          transformOrigin: "50% 0",
          transform: `rotate(${s.rotate})`,
          filter: "blur(20px) opacity(0.45)",
          animation: `loadrot 2s ease-out ${s.delay} forwards, spotlight-anim ${s.dur} ease-in-out ${s.delay} infinite${s.reverse ? " reverse" : ""}`,
          opacity: 0,
        }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   3D TILT CARD (from 21st.dev tom_ui)
══════════════════════════════════════════════ */
function TiltCard({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
  const [spotPos, setSpotPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const xRot = (py - 0.5) * 22;
    const yRot = (px - 0.5) * -22;
    setTransform(`perspective(1200px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale3d(1.03,1.03,1.03)`);
    setSpotPos({ x: px * 100, y: py * 100 });
  }, []);

  const onLeave = useCallback(() => {
    setTransform("perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
    setHovered(false);
  }, []);

  return (
    <div ref={ref} className={className}
      onPointerEnter={() => setHovered(true)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ transform, transition: "transform 0.2s ease-out", transformStyle: "preserve-3d", willChange: "transform", position: "relative", overflow: "hidden", ...style }}
    >
      {children}
      <div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none", opacity: hovered ? 1 : 0, transition: "opacity 0.3s" }}>
        <div style={{ position: "absolute", width: "220%", height: "220%", borderRadius: "50%", left: `${spotPos.x}%`, top: `${spotPos.y}%`, transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(240,192,64,0.12) 0%, rgba(201,168,76,0.05) 30%, transparent 60%)" }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SCRAMBLE HOOK
══════════════════════════════════════════════ */
const GLYPHS = "01ΩΨΔΦλπ∑∂≠≡±∞αβγδ!@#$%^&*<>?|[]{}";
function useScramble(text: string, delay = 800) {
  const [display, setDisplay] = useState(() => text.replace(/\S/g, "·"));
  useEffect(() => {
    const t = setTimeout(() => {
      let frame = 0;
      const id = setInterval(() => {
        frame++;
        const resolved = Math.floor((frame / 65) * text.length);
        setDisplay(text.split("").map((ch, i) => {
          if (ch === " " || ch === "\n") return ch;
          if (i < resolved) return ch;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }).join(""));
        if (resolved >= text.length) clearInterval(id);
      }, 28);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);
  return display;
}

/* ══════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { (e.target as HTMLElement).classList.add("visible"); obs.unobserve(e.target); }
    }), { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ══════════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════════ */
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [status, setStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");

  const iStyle: React.CSSProperties = {
    width: "100%", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)",
    borderRadius: 10, color: "#F5F0E8", fontSize: 13, padding: "12px 16px",
    fontFamily: "var(--font-roboto-mono)", outline: "none", transition: "border-color 0.2s",
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setStatus(res.ok ? "sent" : "error");
    } catch { setStatus("error"); }
  }

  if (status === "sent") return (
    <div style={{ padding: 48, textAlign: "center", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 16, background: "rgba(201,168,76,0.04)" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-9" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <p style={{ fontFamily: "var(--font-exo2)", fontWeight: 700, fontSize: 20, color: "#F0C040", marginBottom: 8 }}>Message Received</p>
      <p style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 13, color: "rgba(245,240,232,0.45)" }}>We will respond within 24 hours.</p>
    </div>
  );

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {(["name","email"] as const).map(f => (
          <div key={f}>
            <label style={{ display: "block", fontFamily: "var(--font-roboto-mono)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: 6 }}>{f}</label>
            <input required type={f === "email" ? "email" : "text"} placeholder={f === "email" ? "you@company.com" : "Your name"} style={iStyle} value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)")} />
          </div>
        ))}
      </div>
      <div>
        <label style={{ display: "block", fontFamily: "var(--font-roboto-mono)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: 6 }}>Service</label>
        <select required style={{ ...iStyle, cursor: "pointer" }} value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
          onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)")}
          onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)")}>
          <option value="" disabled style={{ background: "#0A0A0A" }}>Select a service</option>
          {["Software Development","Cybersecurity","Digital Solutions","FS Exchange","Other"].map(s => (
            <option key={s} value={s} style={{ background: "#0A0A0A" }}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label style={{ display: "block", fontFamily: "var(--font-roboto-mono)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: 6 }}>Message</label>
        <textarea required rows={5} placeholder="Tell us about your project..." style={{ ...iStyle, resize: "none" }} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
          onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)")}
          onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)")} />
      </div>
      {status === "error" && <p style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 11, color: "#F87171" }}>Something went wrong. Email us at admin@folubandsamuellabs.com</p>}
      <button type="submit" disabled={status === "sending"} style={{
        padding: "15px 24px", background: "linear-gradient(135deg,#C9A84C,#8B6914)",
        color: "#050505", borderRadius: 12, border: "none",
        fontFamily: "var(--font-roboto-mono)", fontWeight: 700, fontSize: 12,
        letterSpacing: "0.12em", textTransform: "uppercase",
        cursor: status === "sending" ? "not-allowed" : "pointer",
        opacity: status === "sending" ? 0.6 : 1,
        boxShadow: "0 0 32px rgba(201,168,76,0.3)", transition: "opacity 0.2s, transform 0.2s, box-shadow 0.2s",
      }}
        onMouseEnter={e => { if (status !== "sending") { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 50px rgba(201,168,76,0.55)"; }}}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(201,168,76,0.3)"; }}
      >{status === "sending" ? "Sending..." : "Send Message →"}</button>
    </form>
  );
}

/* ══════════════════════════════════════════════
   SECTION LABEL
══════════════════════════════════════════════ */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <span style={{ width: 36, height: 1, background: "linear-gradient(90deg,#C9A84C,transparent)" }} />
      <span style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A84C" }}>{children}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════
   GOLD DIVIDER LINE
══════════════════════════════════════════════ */
function GoldDivider() {
  return <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.3),transparent)", margin: 0 }} />;
}

/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
export default function Home() {
  useReveal();
  const headline = useScramble("Your Vision.\nOur Execution.", 900);

  const S = { /* shared section padding */ padding: "120px 28px" } as const;
  const MW = { maxWidth: 1320, margin: "0 auto" } as const;

  return (
    <>
      {/* ══ HERO ══ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", background: "#050505", overflow: "hidden", paddingTop: 72 }}>
        <GoldParticleCanvas />
        <GoldSpotlights />

        {/* Aurora orbs */}
        <div style={{ position: "absolute", top: "-15%", right: "-8%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,168,76,0.1) 0%,transparent 65%)", pointerEvents: "none", animation: "orb-drift 20s ease-in-out infinite", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "-8%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(240,192,64,0.07) 0%,transparent 65%)", pointerEvents: "none", animation: "orb-drift-2 25s ease-in-out infinite", zIndex: 0 }} />

        {/* Grid overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ ...MW, padding: "0 28px", position: "relative", zIndex: 2, width: "100%" }}>
          {/* Badge */}
          <div className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", padding: "7px 18px", borderRadius: 100, marginBottom: 48 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A84C", animation: "pulse-gold 2s ease-in-out infinite", boxShadow: "0 0 8px #C9A84C" }} />
            <span style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 10, letterSpacing: "0.15em", color: "rgba(201,168,76,0.85)" }}>
              RC 9637480 &middot; Lagos, Nigeria &middot; Est. 2026
            </span>
          </div>

          {/* Main headline */}
          <h1 className="reveal" style={{ fontFamily: "var(--font-exo2)", fontWeight: 900, lineHeight: 1.02, letterSpacing: "-0.03em", marginBottom: 36, maxWidth: 900, whiteSpace: "pre-line", fontSize: "clamp(3.2rem,8vw,96px)" }}>
            {headline.split("\n").map((line, i) => (
              <span key={i} style={{ display: "block", ...(i === 1 ? { background: "linear-gradient(90deg,#F0C040 0%,#C9A84C 40%,#8B6914 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" } : { color: "#F5F0E8" }) }}>
                {line}
              </span>
            ))}
          </h1>

          <p className="reveal" style={{ fontFamily: "var(--font-roboto-mono)", fontSize: "clamp(13px,1.5vw,16px)", color: "rgba(245,240,232,0.45)", lineHeight: 1.9, maxWidth: 520, marginBottom: 52 }}>
            FSLabs is a technology and cybersecurity company based in Lagos. We build software, secure systems, and deliver digital solutions for businesses that demand real results.
          </p>

          {/* CTAs */}
          <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 88 }}>
            <a href="#contact" style={{ padding: "15px 36px", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#050505", borderRadius: 12, fontFamily: "var(--font-roboto-mono)", fontWeight: 700, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", boxShadow: "0 0 32px rgba(201,168,76,0.35)", transition: "box-shadow 0.25s, transform 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 56px rgba(201,168,76,0.65)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(201,168,76,0.35)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >Start a Project</a>
            <a href="#services" style={{ padding: "15px 36px", background: "transparent", border: "1px solid rgba(201,168,76,0.25)", color: "rgba(245,240,232,0.65)", borderRadius: 12, fontFamily: "var(--font-roboto-mono)", fontWeight: 500, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", transition: "border-color 0.25s, color 0.25s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.6)"; (e.currentTarget as HTMLElement).style.color = "#C9A84C"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.25)"; (e.currentTarget as HTMLElement).style.color = "rgba(245,240,232,0.65)"; }}
            >See What We Do →</a>
          </div>

          {/* Stats row */}
          <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {[
              { v: "2026", l: "Founded" },
              { v: "3+", l: "Service Lines" },
              { v: "100%", l: "Direct Delivery" },
              { v: "Lagos", l: "Headquarters" },
            ].map((s, i) => (
              <div key={s.l} style={{ padding: "24px 36px", borderTop: "1px solid rgba(201,168,76,0.12)", borderBottom: "1px solid rgba(201,168,76,0.12)", borderLeft: i === 0 ? "1px solid rgba(201,168,76,0.12)" : "none", borderRight: "1px solid rgba(201,168,76,0.12)", background: "rgba(201,168,76,0.02)" }}>
                <p style={{ fontFamily: "var(--font-exo2)", fontWeight: 800, fontSize: 28, color: "#F0C040", marginBottom: 4 }}>{s.v}</p>
                <p style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ══ SERVICES ══ */}
      <section id="services" style={{ ...S, background: "#050505", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ ...MW }}>
          <SectionLabel>What We Do</SectionLabel>
          <h2 className="reveal" style={{ fontFamily: "var(--font-exo2)", fontWeight: 800, fontSize: "clamp(2rem,5vw,58px)", lineHeight: 1.08, letterSpacing: "-0.02em", color: "#F5F0E8", marginBottom: 16, maxWidth: 700 }}>
            Three service lines.<br />
            <span style={{ background: "linear-gradient(90deg,#F0C040,#C9A84C,#8B6914)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              One quality standard.
            </span>
          </h2>
          <p className="reveal" style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 13, color: "rgba(245,240,232,0.4)", lineHeight: 1.9, maxWidth: 460, marginBottom: 64 }}>
            Every service is delivered directly by the FSLabs team. No middlemen. No shortcuts. Your vision executed by the people who designed it.
          </p>

          <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16 }}>
            {[
              {
                n: "01", title: "Software Development",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><polyline points="16 18 22 12 16 6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="8 6 2 12 8 18" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                desc: "We design and build web apps, mobile apps, APIs, and enterprise systems from the ground up. Clean architecture. Production ready. Built to scale.",
                tags: ["Full Stack", "Mobile", "APIs", "Architecture"],
              },
              {
                n: "02", title: "Cybersecurity",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 7v6c0 5.25 3.75 10.15 8 11 4.25-.85 8-5.75 8-11V7L12 2z" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                desc: "We run penetration tests, security audits, threat assessments, and compliance checks. CEH certified. Hands-on from day one.",
                tags: ["Pen Testing", "Audits", "Threat Intel", "Compliance"],
              },
              {
                n: "03", title: "Digital Solutions",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="#C9A84C" strokeWidth="2"/><line x1="8" y1="21" x2="16" y2="21" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="17" x2="12" y2="21" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/></svg>,
                desc: "UI/UX design, product strategy, and technology consulting for businesses making the move into the digital space. Vision into reality.",
                tags: ["UI/UX", "Strategy", "Integration", "Consulting"],
              },
            ].map(s => (
              <TiltCard key={s.n} style={{ background: "rgba(201,168,76,0.03)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 20, padding: 36 }}>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {s.icon}
                    </div>
                    <span style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 28, fontWeight: 700, color: "rgba(201,168,76,0.12)", letterSpacing: "-0.02em" }}>{s.n}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-exo2)", fontWeight: 700, fontSize: 22, color: "#F5F0E8", marginBottom: 12, letterSpacing: "-0.01em" }}>{s.title}</h3>
                  <p style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 12, color: "rgba(245,240,232,0.42)", lineHeight: 1.9, marginBottom: 28 }}>{s.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {s.tags.map(t => (
                      <span key={t} style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 9, letterSpacing: "0.12em", padding: "5px 12px", borderRadius: 6, background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.18)", color: "rgba(201,168,76,0.7)", textTransform: "uppercase" }}>
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

      <GoldDivider />

      {/* ══ ACADEMY ══ */}
      <section id="academy" style={{ ...S, background: "#050505", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-5%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,168,76,0.08) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ ...MW }}>
          <SectionLabel>Learn & Grow</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="academy-grid">
            <div>
              <h2 className="reveal" style={{ fontFamily: "var(--font-exo2)", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,52px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#F5F0E8", marginBottom: 28 }}>
                FSLabs Academy.<br />
                <span style={{ background: "linear-gradient(90deg,#F0C040,#C9A84C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Learn to Code. Build Real Skills.
                </span>
              </h2>
              <p className="reveal" style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 13, color: "rgba(245,240,232,0.45)", lineHeight: 1.95, marginBottom: 28 }}>
                Learn full-stack development, cybersecurity, and system architecture from engineers who build production systems. Self-paced. Project-driven. Proven path to employment.
              </p>
              <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
                {[
                  "Built by FSLabs, not generic platforms",
                  "Real projects, real skills, real careers",
                  "Self-paced learning without artificial deadlines",
                  "Lifetime access to evolving materials",
                ].map((benefit, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l2 2 6-6" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 13, color: "rgba(245,240,232,0.7)" }}>{benefit}</span>
                  </div>
                ))}
              </div>
              <a href="/academy" style={{ display: "inline-block", padding: "15px 36px", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#050505", borderRadius: 12, fontFamily: "var(--font-roboto-mono)", fontWeight: 700, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", boxShadow: "0 0 32px rgba(201,168,76,0.35)", transition: "box-shadow 0.25s, transform 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 56px rgba(201,168,76,0.65)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(201,168,76,0.35)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >Explore Academy →</a>
            </div>

            <div className="reveal">
              <TiltCard style={{ background: "rgba(201,168,76,0.03)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 24, padding: 48, display: "flex", flexDirection: "column", gap: 40 }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-exo2)", fontWeight: 700, fontSize: 20, color: "#F5F0E8", marginBottom: 12 }}>Production-Grade Curriculum</h3>
                  <p style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 12, color: "rgba(245,240,232,0.5)", lineHeight: 1.8 }}>Learn the exact skills used in production systems. Not simplified. Not watered down. Real engineering.</p>
                </div>

                <div style={{ height: 1, background: "rgba(201,168,76,0.1)" }} />

                <div>
                  <h3 style={{ fontFamily: "var(--font-exo2)", fontWeight: 700, fontSize: 20, color: "#F5F0E8", marginBottom: 12 }}>Employment Outcomes</h3>
                  <p style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 12, color: "rgba(245,240,232,0.5)", lineHeight: 1.8 }}>Graduates working at top tech companies. From course completion to first role. Real outcomes, not promises.</p>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){.academy-grid{grid-template-columns:1fr!important;gap:56px!important}}`}</style>
      </section>

      <GoldDivider />

      {/* ══ PROCESS ══ */}
      <section id="process" style={{ ...S, background: "#030303", position: "relative", overflow: "hidden" }}>
        <div style={{ ...MW }}>
          <SectionLabel>How We Work</SectionLabel>
          <h2 className="reveal" style={{ fontFamily: "var(--font-exo2)", fontWeight: 800, fontSize: "clamp(2rem,5vw,58px)", lineHeight: 1.08, letterSpacing: "-0.02em", color: "#F5F0E8", marginBottom: 72, maxWidth: 560 }}>
            Precision process.<br />
            <span style={{ background: "linear-gradient(90deg,#F0C040,#C9A84C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Guaranteed delivery.
            </span>
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 0, position: "relative" }}>
            {/* Connector line */}
            <div style={{ position: "absolute", top: 36, left: "12.5%", right: "12.5%", height: 1, background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.25),rgba(201,168,76,0.25),transparent)", pointerEvents: "none" }} className="process-line" />
            {[
              { n: "01", title: "Brief", desc: "You tell us what you need. We listen, ask the right questions, and understand the real problem before touching a keyboard." },
              { n: "02", title: "Scope", desc: "We define the work clearly. Realistic timelines. Honest deliverables. No scope creep, no surprises." },
              { n: "03", title: "Build", desc: "We do the work. Software gets built, systems get secured, solutions get shipped. No status theatre." },
              { n: "04", title: "Deliver", desc: "You receive something that works, is documented, and is ready for the real world. That is the FSLabs standard." },
            ].map((step, i) => (
              <div key={step.n} className="reveal" style={{ padding: "0 32px 0 0", animationDelay: `${i * 0.1}s` }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(201,168,76,0.06)", border: "2px solid rgba(201,168,76,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, position: "relative", zIndex: 1 }}>
                  <span style={{ fontFamily: "var(--font-exo2)", fontWeight: 900, fontSize: 18, color: "#C9A84C" }}>{step.n}</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-exo2)", fontWeight: 700, fontSize: 20, color: "#F5F0E8", marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 12, color: "rgba(245,240,232,0.38)", lineHeight: 1.9 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){.process-line{display:none}}`}</style>
      </section>

      <GoldDivider />

      {/* ══ ABOUT ══ */}
      <section id="about" style={{ ...S, background: "#050505", position: "relative", overflow: "hidden" }}>
        <div style={{ ...MW }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96, alignItems: "center" }} className="about-grid">
            <div>
              <SectionLabel>About FSLabs</SectionLabel>
              <h2 className="reveal" style={{ fontFamily: "var(--font-exo2)", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,52px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#F5F0E8", marginBottom: 28 }}>
                Built from Lagos.<br />
                <span style={{ background: "linear-gradient(90deg,#F0C040,#C9A84C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Engineered for scale.
                </span>
              </h2>
              <div style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 13, color: "rgba(245,240,232,0.45)", lineHeight: 1.95 }}>
                <p className="reveal" style={{ marginBottom: 20 }}>Folub and Samuel Labs is a technology and cybersecurity company incorporated in Nigeria. We are a two-founder company where both founders work directly on every client project. That is the model and that is the standard.</p>
                <p className="reveal">We do not hand off your work to junior contractors or offshore teams. When you engage FSLabs, you get Adeseko Samuel on the technical side and Akinbayo on strategy and delivery. Every single time.</p>
              </div>
            </div>

            <div className="reveal">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Company Type", value: "Limited Liability" },
                  { label: "RC Number", value: "9637480" },
                  { label: "Headquarters", value: "Lagos, Nigeria" },
                  { label: "Founded", value: "2026" },
                  { label: "Specialties", value: "Software & Security" },
                  { label: "Model", value: "Direct Delivery" },
                ].map(item => (
                  <div key={item.label} style={{ background: "rgba(201,168,76,0.03)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 14, padding: "20px 20px", transition: "border-color 0.2s, background 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.3)"; (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.06)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.1)"; (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.03)"; }}
                  >
                    <p style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(201,168,76,0.45)", marginBottom: 6 }}>{item.label}</p>
                    <p style={{ fontFamily: "var(--font-exo2)", fontSize: 15, fontWeight: 600, color: "#F5F0E8" }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){.about-grid{grid-template-columns:1fr!important;gap:56px!important}}`}</style>
      </section>

      <GoldDivider />

      {/* ══ TEAM ══ */}
      <section id="team" style={{ ...S, background: "#030303", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: 0, left: "30%", width: 600, height: 300, background: "radial-gradient(ellipse,rgba(201,168,76,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ ...MW }}>
          <SectionLabel>Founders</SectionLabel>
          <h2 className="reveal" style={{ fontFamily: "var(--font-exo2)", fontWeight: 800, fontSize: "clamp(2rem,5vw,58px)", lineHeight: 1.08, letterSpacing: "-0.02em", color: "#F5F0E8", marginBottom: 16 }}>
            Built by people who<br />
            <span style={{ background: "linear-gradient(90deg,#F0C040,#C9A84C,#8B6914)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              do the work.
            </span>
          </h2>
          <p className="reveal" style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 13, color: "rgba(245,240,232,0.38)", lineHeight: 1.9, maxWidth: 480, marginBottom: 64 }}>
            No account managers between you and the builders. Just two founders executing exactly what they said they would.
          </p>

          <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))", gap: 20 }}>
            {[
              {
                initial: "S", name: "Adeseko Samuel", role: "Co-Founder · Technical Lead",
                bio: "Samuel is the builder. A cybersecurity professional and full stack developer who carries the full technical weight of FSLabs. From system architecture and backend engineering to security implementation and product delivery. He thinks in systems, ships in weeks, and holds the standard that everything we release has to actually work, scale, and be secure from day one.",
                tags: ["Cybersecurity", "Full Stack", "System Architecture", "Security Ops", "ALX Graduate"],
              },
              {
                initial: "A", name: "Akinbayo", role: "Co-Founder · Business Lead",
                bio: "Akinbayo is the business engine behind FSLabs. He drives strategy, client relationships, partnerships, and the commercial growth of everything we build. If FSLabs is moving, Akinbayo is making sure it moves in the right direction.",
                tags: ["Strategy", "Operations", "Business Development", "Client Relations", "Cybersecurity"],
              },
            ].map(f => (
              <TiltCard key={f.name} style={{ background: "rgba(201,168,76,0.03)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 22, padding: 40 }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, background: "radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.05))", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "var(--font-exo2)", fontWeight: 900, fontSize: 26, color: "#C9A84C" }}>{f.initial}</span>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-exo2)", fontWeight: 700, fontSize: 20, color: "#F5F0E8", marginBottom: 4 }}>{f.name}</h3>
                      <p style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 10, letterSpacing: "0.1em", color: "rgba(201,168,76,0.6)", textTransform: "uppercase" }}>{f.role}</p>
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 12, color: "rgba(245,240,232,0.42)", lineHeight: 1.95, marginBottom: 28 }}>{f.bio}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {f.tags.map(t => (
                      <span key={t} style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 9, letterSpacing: "0.1em", padding: "5px 12px", borderRadius: 6, background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.18)", color: "rgba(201,168,76,0.65)", textTransform: "uppercase" }}>
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

      <GoldDivider />

      {/* ══ CONTACT ══ */}
      <section id="contact" style={{ ...S, background: "#030303", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: "-10%", right: "10%", width: 500, height: 400, background: "radial-gradient(ellipse,rgba(201,168,76,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ ...MW, position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96, alignItems: "start" }} className="contact-grid">

            <div>
              <SectionLabel>Start a Project</SectionLabel>
              <h2 className="reveal" style={{ fontFamily: "var(--font-exo2)", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,52px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#F5F0E8", marginBottom: 20 }}>
                Tell us what<br />
                <span style={{ background: "linear-gradient(90deg,#F0C040,#C9A84C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  you need built.
                </span>
              </h2>
              <p className="reveal" style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 13, color: "rgba(245,240,232,0.4)", lineHeight: 1.9, marginBottom: 48 }}>
                Whether it is a product, a security audit, or a digital solution, send us the brief and we will come back with a clear plan within 24 hours.
              </p>
              <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {[
                  { label: "Email", value: "admin@folubandsamuellabs.com" },
                  { label: "Location", value: "Lagos, Nigeria" },
                  { label: "RC Number", value: "9637480" },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 8, color: "#C9A84C", letterSpacing: "0.05em", fontWeight: 700 }}>{item.label.slice(0,2).toUpperCase()}</span>
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(201,168,76,0.4)", marginBottom: 4 }}>{item.label}</p>
                      <p style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 13, color: "rgba(245,240,232,0.65)", wordBreak: "break-all" }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal">
              <div style={{ background: "rgba(201,168,76,0.025)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 24, padding: 44, animation: "border-glow 4s ease-in-out infinite" }}>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){.contact-grid{grid-template-columns:1fr!important;gap:56px!important}}`}</style>
      </section>
    </>
  );
}
