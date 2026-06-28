const services = [
  {
    icon: "💻",
    title: "Software Development",
    tagline: "Custom-built. Production-ready.",
    desc: "We design and build web applications, mobile apps, APIs, and enterprise software tailored to your exact requirements. Our engineering team follows modern development practices to deliver reliable, scalable, and maintainable products.",
    items: ["Web & Mobile Applications", "API Development & Integration", "SaaS Product Development", "Legacy System Modernization"],
  },
  {
    icon: "🔒",
    title: "Cybersecurity",
    tagline: "Protect what matters most.",
    desc: "In today's threat landscape, security is non-negotiable. We help organizations identify vulnerabilities, respond to threats, and build a resilient security posture — from penetration testing to full security operations.",
    items: ["Penetration Testing & Vulnerability Assessments", "Security Audits & Compliance", "Threat Intelligence & Monitoring", "Incident Response & Recovery"],
  },
  {
    icon: "🧩",
    title: "IT Consulting",
    tagline: "Strategy meets execution.",
    desc: "We work alongside your leadership team to evaluate your technology landscape, identify opportunities, and build a roadmap that supports long-term growth. No jargon — just clear, actionable strategy.",
    items: ["Digital Transformation Strategy", "Technology Roadmapping", "IT Infrastructure Advisory", "Cloud Architecture Planning"],
  },
  {
    icon: "🌐",
    title: "Tech Outsourcing",
    tagline: "Scale your team. Not your costs.",
    desc: "Access skilled software engineers, QA specialists, DevOps engineers, and tech leads — on demand. Our outsourcing model gives you full-time expertise without the full-time overhead.",
    items: ["Dedicated Engineering Teams", "Staff Augmentation", "Project-Based Outsourcing", "DevOps & Cloud Management"],
  },
  {
    icon: "☁️",
    title: "Cloud Solutions",
    tagline: "Modern infrastructure, built right.",
    desc: "We help businesses migrate, manage, and optimize cloud environments across AWS, GCP, and Azure. From initial setup to cost optimization — we handle the complexity.",
    items: ["Cloud Migration", "Infrastructure as Code", "Cost Optimization", "Managed Cloud Services"],
  },
  {
    icon: "📊",
    title: "Data & Analytics",
    tagline: "Turn data into decisions.",
    desc: "Unlock the value in your data. We build pipelines, dashboards, and AI-powered analytics solutions that give your team clear insights to make better decisions faster.",
    items: ["Business Intelligence Dashboards", "Data Pipeline Engineering", "AI & ML Integration", "Reporting & KPI Systems"],
  },
];

export default function Services() {
  return (
    <>
      <section className="pt-32 pb-20 max-w-4xl mx-auto px-6 text-center">
        <p className="text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-3">Services</p>
        <h1 className="text-5xl font-bold text-white mb-6">What We Offer</h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          From building software to securing infrastructure, we provide the full spectrum of technology services your business needs to thrive.
        </p>
      </section>

      <section className="pb-24 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((s) => (
          <div
            key={s.title}
            className="p-8 rounded-2xl border border-cyan-900/30 bg-[#0a1220] hover:border-cyan-500/40 transition-all group"
          >
            <div className="text-4xl mb-4">{s.icon}</div>
            <h2 className="text-2xl font-bold text-white mb-1">{s.title}</h2>
            <p className="text-cyan-400 text-sm font-medium mb-4">{s.tagline}</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">{s.desc}</p>
            <ul className="space-y-2">
              {s.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#070d1a] border-t border-cyan-900/20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-4">Not Sure Where to Start?</h2>
          <p className="text-slate-400 mb-8">
            Book a free consultation and let our team assess your needs and recommend the right solution.
          </p>
          <a
            href="/contact"
            className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base transition-all hover:scale-105"
          >
            Book a Free Consultation
          </a>
        </div>
      </section>
    </>
  );
}
