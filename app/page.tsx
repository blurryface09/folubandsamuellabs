import Link from "next/link";

const services = [
  {
    icon: "💻",
    title: "Software Development",
    desc: "Custom software, web, and mobile applications built to scale with your business.",
  },
  {
    icon: "🔒",
    title: "Cybersecurity",
    desc: "Protect your assets with penetration testing, audits, threat intelligence, and security operations.",
  },
  {
    icon: "🧩",
    title: "IT Consulting",
    desc: "Strategic tech advisory that aligns technology decisions with your business objectives.",
  },
  {
    icon: "🌐",
    title: "Tech Outsourcing",
    desc: "Skilled engineering teams on demand — extend your capacity without the overhead.",
  },
];

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "100%", label: "Client Satisfaction" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.08)_0%,_transparent_70%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Tech Services & Consulting
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
            Engineering Solutions{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              That Drive Growth
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            FolubandSamuel Labs partners with businesses to build powerful software, secure digital infrastructure, and deliver expert tech consulting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services"
              className="px-8 py-4 rounded-full bg-cyan-500 hover:bg-cyan-400 text-[#060b14] font-bold text-base transition-all hover:scale-105"
            >
              Explore Services
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 font-semibold text-base transition-all"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-cyan-900/20 bg-[#070d1a]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-bold text-cyan-400 mb-1">{s.value}</p>
              <p className="text-slate-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-3">What We Do</p>
          <h2 className="text-4xl font-bold text-white mb-4">Our Core Services</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            End-to-end tech solutions tailored for startups, SMEs, and enterprises.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="group p-6 rounded-2xl border border-cyan-900/30 bg-[#0a1220] hover:border-cyan-500/50 hover:bg-[#0d1826] transition-all"
            >
              <div className="text-3xl mb-4">{s.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
          >
            View all services →
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-[#070d1a] border-y border-cyan-900/20">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-3">Why Us</p>
            <h2 className="text-4xl font-bold text-white mb-6">Built on Trust, Driven by Results</h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              We combine deep technical expertise with a clear understanding of business needs. Our team of engineers, consultants, and security professionals are committed to delivering measurable outcomes.
            </p>
            <Link
              href="/about"
              className="px-6 py-3 rounded-full border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 font-medium transition-all"
            >
              Learn About Us
            </Link>
          </div>
          <ul className="space-y-5">
            {[
              { title: "Expert Team", desc: "Seasoned professionals across software, security, and consulting." },
              { title: "Client-First Approach", desc: "We align every solution to your business goals, not just tech specs." },
              { title: "End-to-End Delivery", desc: "From strategy to deployment — we own the full lifecycle." },
              { title: "Proven Security", desc: "Cybersecurity baked into everything we build." },
            ].map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="mt-1 w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Ready to Build Something Great?</h2>
        <p className="text-slate-400 mb-8 text-lg">
          Let's talk about your project. Our team is ready to help you move fast and build right.
        </p>
        <Link
          href="/contact"
          className="px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base transition-all hover:scale-105 inline-block"
        >
          Get in Touch
        </Link>
      </section>
    </>
  );
}
