import Link from "next/link";

const services = [
  {
    n: "01",
    title: "Software Development",
    tagline: "Custom-built. Production-ready.",
    desc: "We design and build web apps, mobile apps, APIs, and enterprise software tailored exactly to your requirements — scalable, maintainable, and shipped on time.",
    items: ["Web & Mobile Applications", "API Development & Integration", "SaaS Product Development", "Legacy System Modernization"],
  },
  {
    n: "02",
    title: "Cybersecurity",
    tagline: "Protect what matters most.",
    desc: "In today's threat landscape, security is non-negotiable. From penetration testing to full security operations, we build resilient security postures that hold.",
    items: ["Penetration Testing & Assessments", "Security Audits & Compliance", "Threat Intelligence & Monitoring", "Incident Response & Recovery"],
  },
  {
    n: "03",
    title: "IT Consulting",
    tagline: "Strategy meets execution.",
    desc: "We work alongside your leadership to evaluate your tech landscape, identify opportunities, and build a roadmap that supports sustainable long-term growth.",
    items: ["Digital Transformation Strategy", "Technology Roadmapping", "IT Infrastructure Advisory", "Cloud Architecture Planning"],
  },
  {
    n: "04",
    title: "Tech Outsourcing",
    tagline: "Scale your team, not your costs.",
    desc: "Access skilled engineers, QA specialists, DevOps leads, and technical managers on demand — without the overhead of full-time hiring.",
    items: ["Dedicated Engineering Teams", "Staff Augmentation", "Project-Based Outsourcing", "DevOps & Cloud Management"],
  },
  {
    n: "05",
    title: "Cloud Solutions",
    tagline: "Modern infrastructure, built right.",
    desc: "We help businesses migrate, manage, and optimize cloud environments across AWS, GCP, and Azure — from initial setup to cost optimization.",
    items: ["Cloud Migration", "Infrastructure as Code", "Cost Optimization", "Managed Cloud Services"],
  },
  {
    n: "06",
    title: "Data & Analytics",
    tagline: "Turn data into decisions.",
    desc: "Unlock the value in your data. We build pipelines, dashboards, and AI-powered analytics solutions that give your team clear, actionable insights.",
    items: ["BI Dashboards", "Data Pipeline Engineering", "AI & ML Integration", "KPI Reporting Systems"],
  },
];

export default function Services() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-24 max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-8 bg-[#c9a84c]" />
          <span className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase">Services</span>
        </div>
        <div className="flex items-end justify-between flex-wrap gap-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white leading-[0.95] tracking-tight">
            What We<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5d060] via-[#c9a84c] to-[#9a7228]">Deliver.</span>
          </h1>
          <p className="text-white/40 text-base max-w-sm leading-relaxed">
            End-to-end technology services for startups, SMEs, and enterprises that want to move fast and build right.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="border-t border-[#c9a84c]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-[#c9a84c]/10">
          {services.map((s) => (
            <div key={s.title} className="group bg-[#080808] px-10 py-12 hover:bg-[#0e0c07] transition-colors relative overflow-hidden">
              <div className="absolute top-0 left-0 w-0 h-px bg-gradient-to-r from-[#c9a84c] to-[#e8d080] group-hover:w-full transition-all duration-500" />
              <p className="text-[#c9a84c]/25 text-xs font-mono mb-8 group-hover:text-[#c9a84c]/60 transition-colors">{s.n}</p>
              <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-[#c9a84c] transition-colors">{s.title}</h2>
              <p className="text-[#c9a84c]/60 text-xs tracking-wide mb-6">{s.tagline}</p>
              <p className="text-white/35 text-sm leading-relaxed mb-8">{s.desc}</p>
              <ul className="space-y-2.5">
                {s.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/50">
                    <span className="w-1 h-1 bg-[#c9a84c] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="border border-[#c9a84c]/15 p-16 md:p-24 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.04)_0%,_transparent_70%)]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />
            <div className="relative">
              <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">Free Consultation</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Not sure where to start?</h2>
              <p className="text-white/35 text-sm mb-12 max-w-sm mx-auto leading-relaxed">Book a free consultation. Our team will assess your needs and recommend the right approach.</p>
              <Link href="/contact"
                className="inline-block px-12 py-5 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
