"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ─── Floating particle canvas ─── */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const count = 55;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.4 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,158,11,${p.o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ─── Counter animation ─── */
function StatItem({ value, label }: { value: string; label: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`flex flex-col items-center py-8 px-4 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <span className="text-3xl md:text-4xl font-bold text-[#F59E0B] mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>{value}</span>
      <span className="text-[10px] tracking-[0.25em] uppercase text-white/30" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>{label}</span>
    </div>
  );
}

const services = [
  {
    n: "01", title: "Crypto Trading", emoji: "₿",
    desc: "Buy and sell Bitcoin, USDT, and Ethereum at real market rates. Fast settlements, no hidden charges.",
    items: ["Bitcoin (BTC)", "Tether (USDT)", "Ethereum (ETH)", "Litecoin (LTC)"],
    href: "/exchange/trade/crypto", cta: "Trade Now",
    glow: "rgba(245,158,11,0.15)",
  },
  {
    n: "02", title: "Gift Card Exchange", emoji: "🎁",
    desc: "Turn unused gift cards into naira instantly. All major brands accepted at competitive rates.",
    items: ["Steam", "iTunes / Apple", "Amazon", "Google Play", "Visa Gift"],
    href: "/exchange/trade/giftcard", cta: "Sell Cards",
    glow: "rgba(251,191,36,0.12)",
  },
  {
    n: "03", title: "Virtual Bank Accounts", emoji: "🏦",
    desc: "Get verified US payment accounts. Receive freelance income, international transfers, and more.",
    items: ["CashApp", "Zelle", "PayPal", "Venmo", "Chime", "SoFi"],
    href: "/exchange/accounts", cta: "Get Account",
    glow: "rgba(245,158,11,0.1)",
  },
  {
    n: "04", title: "Traditional Bank Accounts", emoji: "🌍",
    desc: "Real USD and GBP bank accounts with SWIFT and ACH support for international wire transfers.",
    items: ["USD Account", "GBP Account", "SWIFT Transfers", "ACH / Wires"],
    href: "/exchange/accounts", cta: "Open Account",
    glow: "rgba(251,191,36,0.08)",
  },
];

const steps = [
  { n: "01", t: "Create Account", d: "Sign up free in under 2 minutes. No paperwork." },
  { n: "02", t: "Submit Request", d: "Choose your service, fill in the details, and hit send." },
  { n: "03", t: "We Process", d: "Our team reviews and processes your request within 30 minutes." },
  { n: "04", t: "Receive Value", d: "Get naira to your bank, crypto to your wallet, or account credentials." },
];

export function ExchangeLandingClient() {
  return (
    <div className="bg-[#09090F] min-h-screen text-white" style={{ fontFamily: "var(--font-ibm-plex-sans)" }}>

      {/* ══════ HERO ══════ */}
      <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-16 overflow-hidden">

        {/* Aurora background layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)", animation: "orb-drift 18s ease-in-out infinite" }} />
          <div className="absolute -bottom-60 right-0 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #FBBF24 0%, transparent 70%)", animation: "orb-drift-2 22s ease-in-out infinite" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full opacity-5"
            style={{ background: "radial-gradient(ellipse, #F59E0B 0%, transparent 60%)" }} />
        </div>

        <ParticleCanvas />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />

        <div className="relative max-w-7xl mx-auto px-6 w-full z-10">

          {/* Logo + badge */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-[#4F46E5] rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>FS</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-[#F59E0B] text-[11px] tracking-[0.3em] uppercase font-medium" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>FSLabs Exchange</span>
          </div>

          {/* Headline */}
          <h1 className="font-bold leading-[0.92] tracking-tight mb-8 max-w-5xl"
            style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(3.5rem,9vw,108px)" }}>
            <span className="block text-white/90">Trade.</span>
            <span className="block" style={{ WebkitTextStroke: "1px rgba(245,158,11,0.3)", color: "transparent", backgroundImage: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 40%, #D97706 100%)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>
              Exchange.
            </span>
            <span className="block text-white/40">Get Paid.</span>
          </h1>

          <p className="text-white/45 text-lg md:text-xl max-w-lg leading-relaxed mb-12">
            Crypto, gift cards, and real payment accounts — built for Nigerian freelancers and digital professionals who move money globally.
          </p>

          <div className="flex flex-wrap gap-4 mb-20">
            <Link href="/exchange/signup"
              className="group relative px-10 py-4 font-bold text-sm tracking-wide text-black overflow-hidden"
              style={{ background: "linear-gradient(135deg, #FBBF24, #F59E0B)" }}>
              <span className="relative z-10">Create Free Account</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "linear-gradient(135deg, #FCD34D, #FBBF24)" }} />
            </Link>
            <Link href="/exchange/login"
              className="px-10 py-4 border border-white/10 text-white/50 text-sm tracking-wide hover:border-[#F59E0B]/40 hover:text-[#F59E0B] transition-all">
              Sign In →
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 border border-white/5 divide-x divide-y md:divide-y-0 divide-white/5"
            style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)" }}>
            {[
              { value: "₦ / $", label: "Real Rates" },
              { value: "~30min", label: "Avg. Processing" },
              { value: "6+", label: "Payment Platforms" },
              { value: "24/7", label: "Support Available" },
            ].map(s => <StatItem key={s.label} value={s.value} label={s.label} />)}
          </div>
        </div>
      </section>

      {/* ══════ SERVICES BENTO ══════ */}
      <section className="py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-6 bg-[#F59E0B]" />
            <span className="text-[#F59E0B] text-[10px] tracking-[0.3em] uppercase font-medium" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>Our Services</span>
          </div>
          <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Everything you need.<br />
              <span className="text-[#F59E0B]">One platform.</span>
            </h2>
            <Link href="/exchange/signup" className="text-sm text-white/25 hover:text-[#F59E0B] transition-colors tracking-wide" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
              Get started →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((s) => (
              <Link key={s.title} href={s.href}
                className="group relative p-8 border border-white/5 overflow-hidden transition-all duration-300 hover:border-[#F59E0B]/20 cursor-pointer block"
                style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(8px)" }}>

                {/* Glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 30% 30%, ${s.glow}, transparent 70%)` }} />

                {/* Top accent line */}
                <div className="absolute top-0 left-0 w-0 h-px group-hover:w-full transition-all duration-500"
                  style={{ background: "linear-gradient(90deg, #F59E0B, transparent)" }} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-[#F59E0B]/20 text-xs font-medium group-hover:text-[#F59E0B]/50 transition-colors" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>{s.n}</span>
                    <span className="text-2xl">{s.emoji}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-[#F59E0B] transition-colors" style={{ fontFamily: "var(--font-space-grotesk)" }}>{s.title}</h3>
                  <p className="text-white/35 text-sm leading-relaxed mb-6">{s.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {s.items.map(item => (
                      <span key={item} className="text-[10px] tracking-wider px-2.5 py-1 border border-white/5 text-white/30 group-hover:border-[#F59E0B]/15 group-hover:text-[#F59E0B]/50 transition-all"
                        style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
                        {item}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[#F59E0B]/40 group-hover:text-[#F59E0B] transition-colors"
                    style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
                    {s.cta} <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section className="py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-start">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-6 bg-[#F59E0B]" />
                <span className="text-[#F59E0B] text-[10px] tracking-[0.3em] uppercase font-medium" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>How It Works</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Simple steps.<br />
                <span style={{ backgroundImage: "linear-gradient(135deg, #FBBF24, #F59E0B)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                  Fast results.
                </span>
              </h2>
              <p className="text-white/35 text-base leading-relaxed mb-10">
                No complicated verification loops. No endless waiting. Submit your request and our team handles the rest, fast, private, and reliable.
              </p>
              <Link href="/exchange/signup"
                className="inline-block px-10 py-4 font-bold text-sm tracking-wide text-black"
                style={{ background: "linear-gradient(135deg, #FBBF24, #F59E0B)" }}>
                Get Started Free
              </Link>
            </div>

            <div className="border border-white/5" style={{ background: "rgba(255,255,255,0.01)" }}>
              {steps.map((s, i) => (
                <div key={s.n}
                  className={`group p-7 hover:bg-[#F59E0B]/3 transition-colors flex gap-5 ${i < steps.length - 1 ? "border-b border-white/5" : ""}`}>
                  <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#F59E0B]/20 group-hover:border-[#F59E0B]/50 transition-colors"
                    style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: "10px", color: "#F59E0B" }}>
                    {s.n}
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1 group-hover:text-[#F59E0B] transition-colors" style={{ fontFamily: "var(--font-space-grotesk)" }}>{s.t}</p>
                    <p className="text-white/30 text-sm leading-relaxed">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative overflow-hidden border border-[#F59E0B]/10 p-16 md:p-24 text-center"
            style={{ background: "rgba(245,158,11,0.03)" }}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, #F59E0B, transparent)" }} />
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-15"
                style={{ background: "radial-gradient(circle, #F59E0B, transparent 70%)" }} />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 border border-[#F59E0B]/20 px-4 py-1.5 mb-8"
                style={{ background: "rgba(245,158,11,0.05)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                <span className="text-[#F59E0B] text-[10px] tracking-[0.3em] uppercase font-medium" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>Open to Everyone</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Your global financial<br />access starts here.
              </h2>
              <p className="text-white/35 text-base mb-12 max-w-md mx-auto leading-relaxed">
                Join FSLabs Exchange. Trade crypto, sell gift cards, and get real US payment accounts from Nigeria.
              </p>
              <Link href="/exchange/signup"
                className="inline-block px-14 py-5 font-bold text-sm tracking-wide text-black"
                style={{ background: "linear-gradient(135deg, #FBBF24, #F59E0B)" }}>
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
