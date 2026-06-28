import Link from "next/link";

const values = [
  { n: "01", title: "Integrity", desc: "Transparent communication and honest advice — always. No fluff, no shortcuts." },
  { n: "02", title: "Excellence", desc: "We hold our work to the highest standard. Good enough is never good enough." },
  { n: "03", title: "Innovation", desc: "We stay ahead so our clients benefit from what's next, not just what exists." },
  { n: "04", title: "Security", desc: "Every solution we build considers security from the ground up." },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-24 max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-8 bg-[#c9a84c]" />
          <span className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase">About Us</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-10 max-w-3xl">
          Two founders.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5d060] via-[#c9a84c] to-[#9a7228]">One mission.</span>
        </h1>
        <p className="text-white/40 text-lg max-w-xl leading-relaxed">
          Folub & Samuel Labs was built on a simple belief — great technology, in the right hands, can transform any business.
        </p>
      </section>

      {/* Founders */}
      <section className="border-t border-[#c9a84c]/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-px bg-[#c9a84c]/10">
          {[
            { initial: "F", name: "Folub", role: "Co-Founder & Lead Engineer", bio: "Folub drives the technical vision of the company — an engineer with deep expertise in software architecture, systems design, and scalable product development." },
            { initial: "S", name: "Samuel", role: "Co-Founder & Strategy Lead", bio: "Samuel leads client strategy and business development — translating complex technical solutions into measurable business outcomes for clients across industries." },
          ].map((f) => (
            <div key={f.name} className="bg-[#050505] p-12 group hover:bg-[#0a0906] transition-colors">
              <div className="w-20 h-20 mb-8 flex items-center justify-center border border-[#c9a84c]/20 group-hover:border-[#c9a84c]/50 transition-colors">
                <span className="text-3xl font-bold text-[#c9a84c]">{f.initial}</span>
              </div>
              <h3 className="text-white text-2xl font-bold mb-1">{f.name}</h3>
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-6">{f.role}</p>
              <p className="text-white/40 text-sm leading-relaxed">{f.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-32 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-start">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase">Our Story</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-8 leading-tight">Built by engineers,<br />for businesses.</h2>
          <div className="space-y-5 text-white/45 text-sm leading-relaxed">
            <p>Folub & Samuel Labs was founded with a clear purpose — to bridge the gap between cutting-edge technology and practical business outcomes.</p>
            <p>We noticed that too many companies struggled not from a lack of ambition, but from a lack of the right technical partner. Someone who could build, secure, and advise — all at once.</p>
            <p>Today we serve clients across industries, delivering software that works, security that protects, and consulting that creates real strategic value.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-[#c9a84c]/10 border border-[#c9a84c]/10">
          {[
            { val: "50+", lbl: "Projects" },
            { val: "30+", lbl: "Clients" },
            { val: "5+", lbl: "Years" },
            { val: "6", lbl: "Services" },
          ].map((s) => (
            <div key={s.lbl} className="bg-[#080808] p-10 text-center hover:bg-[#0e0c07] transition-colors">
              <p className="text-4xl font-bold text-[#c9a84c] mb-2">{s.val}</p>
              <p className="text-white/30 text-xs tracking-widest uppercase">{s.lbl}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-[#c9a84c]/10 bg-[#050505] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-16">
            <div className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase">Core Values</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#c9a84c]/10">
            {values.map((v) => (
              <div key={v.title} className="bg-[#050505] p-10 hover:bg-[#0a0906] transition-colors group">
                <p className="text-[#c9a84c]/25 text-xs font-mono mb-6 group-hover:text-[#c9a84c]/50 transition-colors">{v.n}</p>
                <h3 className="text-white text-xl font-semibold mb-3 group-hover:text-[#c9a84c] transition-colors">{v.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-5">Ready to work together?</h2>
        <p className="text-white/40 mb-10 max-w-md mx-auto text-sm leading-relaxed">Let's talk about your project and how we can help you build something exceptional.</p>
        <Link href="/contact" className="inline-block px-12 py-4 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
          Contact Us
        </Link>
      </section>
    </>
  );
}
