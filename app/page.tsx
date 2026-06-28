import Link from "next/link";

const services = [
  { icon: "01", title: "Software Development", desc: "Custom web, mobile, and enterprise software built to scale. From MVP to production." },
  { icon: "02", title: "Cybersecurity", desc: "Penetration testing, security audits, threat intelligence, and incident response." },
  { icon: "03", title: "IT Consulting", desc: "Strategic technology advisory aligned to your business objectives and growth." },
  { icon: "04", title: "Tech Outsourcing", desc: "On-demand engineering teams — skilled, vetted, ready to ship." },
];

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Clients Served" },
  { value: "5+", label: "Years Experience" },
  { value: "100%", label: "Commitment" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,_rgba(201,168,76,0.07)_0%,_transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-px w-8 bg-[#c9a84c]" />
              <span className="text-[#c9a84c] text-xs font-medium tracking-[0.25em] uppercase">Technology & Consulting</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-8">
              We Build<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5d060] via-[#c9a84c] to-[#9a7228]">
                What Matters.
              </span>
            </h1>

            <p className="text-white/50 text-lg md:text-xl max-w-xl leading-relaxed mb-12">
              Folub & Samuel Labs delivers world-class software, cybersecurity, and tech consulting for businesses that refuse to settle.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/services"
                className="px-8 py-4 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-sm tracking-wide hover:opacity-90 transition-opacity">
                Our Services
              </Link>
              <Link href="/contact"
                className="px-8 py-4 border border-white/15 text-white/70 font-medium text-sm tracking-wide hover:border-[#c9a84c]/50 hover:text-[#c9a84c] transition-all">
                Start a Project
              </Link>
            </div>
          </div>
        </div>

        {/* Floating stat in corner */}
        <div className="absolute right-8 bottom-12 hidden lg:flex flex-col items-end gap-1">
          <p className="text-[#c9a84c] text-4xl font-bold">50+</p>
          <p className="text-white/30 text-xs tracking-widest uppercase">Projects Shipped</p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-[#c9a84c]/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={s.label} className={`text-center ${i !== stats.length - 1 ? "md:border-r border-[#c9a84c]/10" : ""}`}>
              <p className="text-3xl font-bold text-[#c9a84c] mb-1">{s.value}</p>
              <p className="text-white/30 text-xs tracking-widest uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#c9a84c]" />
              <span className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase">What We Do</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Core Services</h2>
          </div>
          <Link href="/services" className="text-sm text-white/40 hover:text-[#c9a84c] transition-colors tracking-wide">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#c9a84c]/10">
          {services.map((s) => (
            <div key={s.title} className="group bg-[#080808] p-10 hover:bg-[#0e0c07] transition-colors relative overflow-hidden">
              <div className="absolute top-0 left-0 w-0 h-px bg-gradient-to-r from-[#c9a84c] to-[#e8d080] group-hover:w-full transition-all duration-500" />
              <p className="text-[#c9a84c]/30 text-xs font-mono mb-6">{s.icon}</p>
              <h3 className="text-white text-xl font-semibold mb-3 group-hover:text-[#c9a84c] transition-colors">{s.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
              <div className="mt-8 flex items-center gap-2 text-[#c9a84c]/50 text-xs group-hover:text-[#c9a84c] transition-colors">
                <span>Learn more</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="py-24 border-t border-[#c9a84c]/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#c9a84c]" />
              <span className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Built on trust.<br />Driven by results.
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-10">
              We combine deep technical expertise with genuine care for your business. Every engagement is a partnership — not a transaction.
            </p>
            <Link href="/about"
              className="inline-flex items-center gap-3 text-sm text-[#c9a84c] border-b border-[#c9a84c]/30 pb-1 hover:border-[#c9a84c] transition-colors tracking-wide">
              Meet the team →
            </Link>
          </div>

          <div className="space-y-0 border border-[#c9a84c]/10">
            {[
              { n: "01", t: "Expert Team", d: "Seasoned engineers, security pros, and consultants." },
              { n: "02", t: "Client-First", d: "Every solution is aligned to your goals, not just specs." },
              { n: "03", t: "Full Lifecycle", d: "Strategy to deployment — we own it end to end." },
              { n: "04", t: "Security Built In", d: "Cybersecurity isn't an add-on. It's in our DNA." },
            ].map((item, i) => (
              <div key={item.n} className={`flex gap-6 p-7 hover:bg-[#0e0c07] transition-colors group ${i !== 3 ? "border-b border-[#c9a84c]/10" : ""}`}>
                <span className="text-[#c9a84c]/20 text-xs font-mono pt-1 group-hover:text-[#c9a84c]/50 transition-colors">{item.n}</span>
                <div>
                  <p className="text-white font-semibold mb-1 group-hover:text-[#c9a84c] transition-colors">{item.t}</p>
                  <p className="text-white/35 text-sm">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="border border-[#c9a84c]/15 p-16 md:p-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.04)_0%,_transparent_70%)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />
          <div className="relative">
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">Ready to Build?</p>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">Let's create something<br />remarkable.</h2>
            <p className="text-white/40 text-base mb-12 max-w-md mx-auto">Tell us about your project and we'll get back to you within 24 hours.</p>
            <Link href="/contact"
              className="inline-block px-12 py-5 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
