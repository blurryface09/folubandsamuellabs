"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─── Scramble hook ─── */
const GLYPHS = "!@#$%^&*<>?/|\\[]{}01ΩΨΔΦλπ∑∂≠≡±∞αβγδεζ";
function useScramble(text: string, delay = 400) {
  const [display, setDisplay] = useState(() => text.replace(/\S/g, "█"));
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
      entries => entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── Floating glyph ─── */
function GlyphParticle({ left, top, delay, dur, ch }: { left: string; top: string; delay: number; dur: number; ch: string }) {
  return (
    <span className="absolute select-none pointer-events-none text-[10px] text-[#2FA3A3]/15 font-mono"
      style={{ left, top, animation: `float-up ${dur}s ${delay}s linear infinite` }}>
      {ch}
    </span>
  );
}

/* ─── Circuit bg (services) ─── */
function CircuitBg() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="circuit" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M0 40 H28 M52 40 H80 M40 0 V28 M40 52 V80" stroke="#2FA3A3" strokeWidth="0.4" fill="none" opacity="0.18" strokeDasharray="2 5"/>
          <circle cx="40" cy="40" r="3.5" fill="none" stroke="#C99A3B" strokeWidth="0.5" opacity="0.12"/>
          <circle cx="0" cy="40" r="1.5" fill="#2FA3A3" opacity="0.12"/>
          <circle cx="80" cy="40" r="1.5" fill="#2FA3A3" opacity="0.12"/>
          <circle cx="40" cy="0" r="1.5" fill="#2FA3A3" opacity="0.12"/>
          <circle cx="40" cy="80" r="1.5" fill="#2FA3A3" opacity="0.12"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" style={{ animation: "circuit-pulse 5s ease-in-out infinite" }}/>
    </svg>
  );
}

/* ─── Orb bg (process) ─── */
function OrbBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute w-[700px] h-[700px] rounded-full bg-[#2FA3A3]/5 blur-3xl -top-60 -left-60"
        style={{ animation: "orb-drift 14s ease-in-out infinite" }}/>
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#C99A3B]/5 blur-3xl -bottom-40 -right-40"
        style={{ animation: "orb-drift-2 18s ease-in-out infinite" }}/>
      <div className="absolute w-[350px] h-[350px] rounded-full bg-[#D8432E]/3 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ animation: "orb-drift 22s ease-in-out infinite reverse" }}/>
    </div>
  );
}

/* ─── Mesh bg (team) ─── */
function MeshBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(rgba(47,163,163,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(47,163,163,0.05) 1px,transparent 1px)",
        backgroundSize: "60px 60px",
        animation: "grid-shimmer 10s linear infinite",
      }}/>
  );
}

/* ─── Radar bg (contact) ─── */
function RadarBg() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {[0,1,2,3,4,5].map(i => (
        <div key={i} className="absolute rounded-full border border-[#C99A3B]/8"
          style={{ width:`${(i+1)*16}%`, height:`${(i+1)*16}%`, animation:`radar-pulse 5s ease-out ${i*0.9}s infinite` }}/>
      ))}
    </div>
  );
}

export default function Home() {
  useReveal();
  const headline = useScramble("We vet the talent.\nYou get the outcome.", 600);

  const CHARS = ["01","λ","∑","Ψ","//","{}","ΔΦ",">>","0x","∞","≠","±"];
  const [mounted, setMounted] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 14,
      dur: 10 + Math.random() * 14,
      ch: CHARS[Math.floor(Math.random() * CHARS.length)],
    }))
  );
  useEffect(() => setMounted(true), []);

  return (
    <>
      {/* ══════ HERO ══════ */}
      <section className="relative min-h-screen flex flex-col justify-center pt-28 pb-20 overflow-hidden bg-[#0E1116]">
        {mounted && particles.map((p, i) => <GlyphParticle key={i} left={p.left} top={p.top} delay={p.delay} dur={p.dur} ch={p.ch}/>)}
        <div className="scanline"/>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(47,163,163,0.07)_0%,transparent_70%)] pointer-events-none"/>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_85%_15%,rgba(201,154,59,0.05)_0%,transparent_60%)] pointer-events-none"/>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2FA3A3]/20 to-transparent"/>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C99A3B]/15 to-transparent"/>

        <div className="relative max-w-6xl mx-auto px-6 w-full z-10">
          <div className="flex items-center gap-4 mb-10 reveal">
            <div className="h-px w-8 bg-[#2FA3A3]"/>
            <span className="text-[#2FA3A3] text-[10px] tracking-[0.3em] uppercase" style={{fontFamily:"var(--font-ibm-plex-mono)"}}>
              RC 9637480 · LAGOS, NIGERIA · INCORPORATED 2026
            </span>
          </div>

          <h1 className="font-bold leading-[1.05] tracking-tight mb-8 max-w-4xl whitespace-pre-line reveal"
            style={{fontFamily:"var(--font-space-grotesk)", fontSize:"clamp(2.8rem,7vw,84px)", color:"#F1ECE1"}}>
            {headline.split("\n").map((line, i) => (
              <span key={i} className={`block ${i === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-[#C99A3B] via-[#e8c05a] to-[#C99A3B]" : ""}`}>
                {line}
              </span>
            ))}
          </h1>

          <p className="text-[#F1ECE1]/45 text-lg md:text-xl max-w-xl leading-relaxed mb-12 reveal"
            style={{fontFamily:"var(--font-ibm-plex-sans)"}}>
            FSLabs aggregates vetted specialist talent: software engineers, security professionals, and digital experts deployed to solve real business problems.
          </p>

          <div className="flex flex-wrap gap-4 mb-20 reveal">
            <a href="/#contact"
              className="px-8 py-4 bg-[#C99A3B] text-[#0E1116] font-bold text-sm tracking-widest uppercase hover:bg-[#e8c05a] transition-colors"
              style={{fontFamily:"var(--font-ibm-plex-mono)"}}>
              Start a Project
            </a>
            <a href="/#services"
              className="px-8 py-4 border border-[#F1ECE1]/10 text-[#F1ECE1]/55 text-sm tracking-wide hover:border-[#2FA3A3]/50 hover:text-[#2FA3A3] transition-all"
              style={{fontFamily:"var(--font-ibm-plex-mono)"}}>
              See What We Do →
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 reveal">
            {[
              {v:"2026", l:"Founded"},
              {v:"3", l:"Service Lines"},
              {v:"50/50", l:"Founder Equity"},
              {v:"100%", l:"Vetted Talent"},
            ].map(s => (
              <div key={s.l} className="bg-[#0E1116] px-6 py-5 hover:bg-[#141820] transition-colors">
                <p className="text-[#C99A3B] text-2xl font-bold mb-1" style={{fontFamily:"var(--font-space-grotesk)"}}>{s.v}</p>
                <p className="text-[#F1ECE1]/25 text-[10px] tracking-widest uppercase" style={{fontFamily:"var(--font-ibm-plex-mono)"}}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SERVICES ══════ */}
      <section id="services" className="relative py-32 border-t border-white/5 overflow-hidden bg-[#0a0d11]">
        <CircuitBg/>
        <div className="relative max-w-6xl mx-auto px-6 z-10">
          <div className="flex items-center gap-3 mb-4 reveal">
            <div className="h-px w-8 bg-[#C99A3B]"/>
            <span className="text-[#C99A3B] text-[10px] tracking-[0.3em] uppercase" style={{fontFamily:"var(--font-ibm-plex-mono)"}}>What We Do</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F1ECE1] mb-4 reveal" style={{fontFamily:"var(--font-space-grotesk)"}}>
            Three service lines.<br/>
            <span className="text-[#2FA3A3]">One quality standard.</span>
          </h2>
          <p className="text-[#F1ECE1]/40 max-w-lg mb-16 leading-relaxed reveal" style={{fontFamily:"var(--font-ibm-plex-sans)"}}>
            Every engagement runs through the same vetting pipeline. Specialist output, not generalist guesswork.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 reveal">
            {[
              { n:"01", title:"Software Development", color:"#2FA3A3",
                desc:"Web apps, mobile apps, APIs, and enterprise systems built by engineers we have verified technically and professionally.",
                tags:["Full Stack","Mobile","APIs","Architecture"] },
              { n:"02", title:"Cybersecurity", color:"#C99A3B",
                desc:"Penetration testing, security audits, threat modelling, and SOC level monitoring from CEH certified professionals.",
                tags:["Pen Testing","Audits","Threat Intel","Compliance"] },
              { n:"03", title:"Digital Solutions", color:"#D8432E",
                desc:"UI and UX design, digital transformation consulting, product strategy, and technology integration for modern businesses.",
                tags:["UI UX","Strategy","Integration","Consulting"] },
            ].map(s => (
              <div key={s.title} className="bg-[#0a0d11] p-10 group hover:bg-[#0f1318] transition-colors relative overflow-hidden">
                <div className="absolute top-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500" style={{background:s.color}}/>
                <p className="text-[10px] tracking-[0.25em] mb-6" style={{fontFamily:"var(--font-ibm-plex-mono)", color:`${s.color}45`}}>{s.n}</p>
                <h3 className="text-lg font-semibold text-[#F1ECE1] mb-3 group-hover:text-white transition-colors" style={{fontFamily:"var(--font-space-grotesk)"}}>{s.title}</h3>
                <p className="text-[#F1ECE1]/35 text-sm leading-relaxed mb-6" style={{fontFamily:"var(--font-ibm-plex-sans)"}}>{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map(t => (
                    <span key={t} className="text-[9px] tracking-widest uppercase px-2 py-0.5 border"
                      style={{fontFamily:"var(--font-ibm-plex-mono)", color:`${s.color}55`, borderColor:`${s.color}18`}}>
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
      <section id="process" className="relative py-32 border-t border-white/5 overflow-hidden bg-[#0E1116]">
        <OrbBg/>
        <div className="relative max-w-6xl mx-auto px-6 z-10">
          <div className="flex items-center gap-3 mb-4 reveal">
            <div className="h-px w-8 bg-[#2FA3A3]"/>
            <span className="text-[#2FA3A3] text-[10px] tracking-[0.3em] uppercase" style={{fontFamily:"var(--font-ibm-plex-mono)"}}>The Model</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F1ECE1] mb-4 reveal" style={{fontFamily:"var(--font-space-grotesk)"}}>
            The aggregation<br/><span className="text-[#C99A3B]">model.</span>
          </h2>
          <p className="text-[#F1ECE1]/40 max-w-lg mb-16 leading-relaxed reveal" style={{fontFamily:"var(--font-ibm-plex-sans)"}}>
            We don't guess who's good. We build a verified network and match the right people to the right problems, every time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/5 reveal">
            {[
              {n:"01", title:"Source", color:"#2FA3A3", desc:"We continuously identify specialist talent across software, security, and digital disciplines."},
              {n:"02", title:"Vet", color:"#C99A3B", desc:"Technical assessments, background checks, reference verification, and live skill validation."},
              {n:"03", title:"Match", color:"#D8432E", desc:"We map your project requirements to the right specialists, not the closest available."},
              {n:"04", title:"Deliver", color:"#2FA3A3", desc:"Specialists execute under FSLabs quality standards. You get outcomes, not effort reports."},
            ].map((step, i) => (
              <div key={step.n} className="bg-[#0E1116] p-8 group hover:bg-[#131820] transition-colors relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{background:`radial-gradient(ellipse at 50% 0%,${step.color}08,transparent 70%)`}}/>
                <p className="text-3xl font-bold mb-4" style={{fontFamily:"var(--font-ibm-plex-mono)", color:step.color}}>{step.n}</p>
                <h3 className="text-base font-semibold text-[#F1ECE1] mb-2" style={{fontFamily:"var(--font-space-grotesk)"}}>{step.title}</h3>
                <p className="text-[#F1ECE1]/30 text-sm leading-relaxed" style={{fontFamily:"var(--font-ibm-plex-sans)"}}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TEAM ══════ */}
      <section id="team" className="relative py-32 border-t border-white/5 overflow-hidden bg-[#0a0d11]">
        <MeshBg/>
        <div className="relative max-w-6xl mx-auto px-6 z-10">
          <div className="flex items-center gap-3 mb-4 reveal">
            <div className="h-px w-8 bg-[#C99A3B]"/>
            <span className="text-[#C99A3B] text-[10px] tracking-[0.3em] uppercase" style={{fontFamily:"var(--font-ibm-plex-mono)"}}>Founders</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F1ECE1] mb-16 reveal" style={{fontFamily:"var(--font-space-grotesk)"}}>
            Built by people who<br/><span className="text-[#2FA3A3]">do the work.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 reveal">
            {[
              { initial:"S", name:"Adeseko Samuel", role:"Co-Founder and Technical Lead", color:"#2FA3A3",
                bio:"Samuel is the builder. A cybersecurity professional and full stack developer who carries the full technical weight of FSLabs. From system architecture and backend engineering to security implementation and product delivery. He thinks in systems, ships in weeks, and holds the standard that everything we release has to actually work, scale, and be secure from day one.",
                tags:["Cybersecurity","Full Stack","System Architecture","Security Ops","ALX Graduate"] },
              { initial:"A", name:"Akinbayo", role:"Co-Founder and Business Lead", color:"#C99A3B",
                bio:"Akinbayo is the business engine behind FSLabs. He drives strategy, client relationships, partnerships, and the commercial growth of everything we build. If FSLabs is moving, Akinbayo is making sure it moves in the right direction.",
                tags:["Strategy","Operations","Business Development","Client Relations"] },
            ].map(f => (
              <div key={f.name} className="bg-[#0a0d11] p-10 group hover:bg-[#0f1318] transition-colors relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{background:`linear-gradient(to bottom,transparent,${f.color},transparent)`}}/>
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-14 h-14 border flex-shrink-0 flex items-center justify-center"
                    style={{borderColor:`${f.color}25`, background:`${f.color}08`}}>
                    <span className="text-xl font-bold" style={{color:f.color, fontFamily:"var(--font-space-grotesk)"}}>{f.initial}</span>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-base font-semibold text-[#F1ECE1] mb-1" style={{fontFamily:"var(--font-space-grotesk)"}}>{f.name}</h3>
                    <p className="text-[10px] tracking-widest uppercase" style={{fontFamily:"var(--font-ibm-plex-mono)", color:f.color}}>{f.role}</p>
                  </div>
                </div>
                <p className="text-[#F1ECE1]/38 text-sm leading-relaxed mb-6" style={{fontFamily:"var(--font-ibm-plex-sans)"}}>{f.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.tags.map(t => (
                    <span key={t} className="text-[9px] tracking-widest uppercase px-2 py-0.5 border"
                      style={{fontFamily:"var(--font-ibm-plex-mono)", color:`${f.color}55`, borderColor:`${f.color}15`}}>
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
      <section id="contact" className="relative py-40 border-t border-white/5 overflow-hidden bg-[#0E1116]">
        <RadarBg/>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(201,154,59,0.05),transparent_70%)] pointer-events-none"/>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C99A3B]/30 to-transparent"/>
        <div className="relative max-w-3xl mx-auto px-6 text-center z-10">
          <p className="text-[#C99A3B] text-[10px] tracking-[0.4em] uppercase mb-8 reveal" style={{fontFamily:"var(--font-ibm-plex-mono)"}}>
            Ready to Build?
          </p>
          <h2 className="text-4xl md:text-6xl font-bold text-[#F1ECE1] mb-8 leading-tight reveal" style={{fontFamily:"var(--font-space-grotesk)"}}>
            Tell us what<br/>you need built.
          </h2>
          <p className="text-[#F1ECE1]/35 text-base max-w-sm mx-auto mb-12 leading-relaxed reveal" style={{fontFamily:"var(--font-ibm-plex-sans)"}}>
            We respond within 24 hours with a clear plan. No vague proposals, no inflated timelines.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal">
            <a href="mailto:admin@folubandsamuellabs.com"
              className="px-8 py-4 bg-[#C99A3B] text-[#0E1116] font-bold text-sm tracking-wide uppercase hover:bg-[#e8c05a] transition-colors"
              style={{fontFamily:"var(--font-ibm-plex-mono)"}}>
              admin@folubandsamuellabs.com
            </a>
            <Link href="/exchange"
              className="px-8 py-4 border border-[#2FA3A3]/30 text-[#2FA3A3] text-sm tracking-wide hover:border-[#2FA3A3] transition-colors"
              style={{fontFamily:"var(--font-ibm-plex-mono)"}}>
              FSLabs Exchange →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
