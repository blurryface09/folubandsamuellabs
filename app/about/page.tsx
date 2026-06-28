const values = [
  { icon: "🎯", title: "Mission-Driven", desc: "We exist to help businesses harness technology to grow, compete, and secure their digital future." },
  { icon: "🤝", title: "Integrity", desc: "Transparent communication, honest advice, and no shortcuts — ever." },
  { icon: "⚡", title: "Innovation", desc: "We stay ahead of the curve so our clients benefit from what's next, not just what's current." },
  { icon: "🛡️", title: "Security-First", desc: "Every solution we build considers security from the ground up, not as an afterthought." },
];

const team = [
  { name: "Foluband", role: "CEO & Lead Consultant", initials: "F" },
  { name: "Samuel", role: "CTO & Software Lead", initials: "S" },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 max-w-4xl mx-auto px-6 text-center">
        <p className="text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-3">About Us</p>
        <h1 className="text-5xl font-bold text-white mb-6">Who We Are</h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          FolubandSamuel Labs is a technology company built on the belief that great software and strong security should be accessible to every business — from startups to enterprises.
        </p>
      </section>

      {/* Story */}
      <section className="py-16 bg-[#070d1a] border-y border-cyan-900/20">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-3">Our Story</p>
            <h2 className="text-3xl font-bold text-white mb-4">Built by Engineers, for Businesses</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              FolubandSamuel Labs was founded with a clear purpose: to bridge the gap between cutting-edge technology and practical business outcomes. We noticed that too many companies struggled not from lack of ambition, but from lack of the right technical partner.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Today, we serve clients across industries — delivering software that works, security that protects, and consulting that creates real strategic value. We're proud to be a trusted technology partner for businesses that want to grow with confidence.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { val: "50+", lbl: "Projects" },
              { val: "30+", lbl: "Clients" },
              { val: "5+", lbl: "Years" },
              { val: "4", lbl: "Core Services" },
            ].map((s) => (
              <div key={s.lbl} className="p-6 rounded-2xl border border-cyan-900/30 bg-[#0a1220] text-center">
                <p className="text-3xl font-bold text-cyan-400">{s.val}</p>
                <p className="text-slate-400 text-sm mt-1">{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-3">What We Stand For</p>
          <h2 className="text-4xl font-bold text-white">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.title} className="p-6 rounded-2xl border border-cyan-900/30 bg-[#0a1220] hover:border-cyan-500/40 transition-all">
              <div className="text-3xl mb-4">{v.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{v.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-[#070d1a] border-t border-cyan-900/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-3">The Team</p>
          <h2 className="text-4xl font-bold text-white mb-12">Meet the Founders</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {team.map((m) => (
              <div key={m.name} className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-bold text-white mb-4">
                  {m.initials}
                </div>
                <p className="text-white font-semibold text-lg">{m.name}</p>
                <p className="text-cyan-400 text-sm">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
