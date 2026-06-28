import Link from "next/link";

const values = [
  { n: "01", title: "Innovation", desc: "We don't follow trends — we set them. Every solution we build pushes the boundary of what's possible." },
  { n: "02", title: "Ambition", desc: "We think big, move fast, and refuse to settle. Small thinking has no place here." },
  { n: "03", title: "Integrity", desc: "We say what we mean and deliver what we promise. No fluff, no shortcuts, no excuses." },
  { n: "04", title: "Impact", desc: "Technology is just a tool. What matters is what it changes — for our clients and for the world." },
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
        <p className="text-white/50 text-lg max-w-xl leading-relaxed">
          We are the bridge between technology and business — connecting companies to real talent, delivering world-class tech services, and building products that matter.
        </p>
      </section>

      {/* Founders */}
      <section className="border-t border-[#c9a84c]/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-px bg-[#c9a84c]/10">
          {[
            {
              initial: "F",
              name: "Folub",
              role: "Co-Founder & Lead Engineer",
              bio: "A cybersecurity specialist and software engineer with a sharp eye for building systems that are both powerful and secure. Folub leads the technical vision at FSLabs, turning complex problems into clean, scalable solutions.",
            },
            {
              initial: "S",
              name: "Samuel",
              role: "Co-Founder & Strategy Lead",
              bio: "A cybersecurity professional and business strategist who bridges the gap between technology and real-world outcomes. Samuel drives client relationships, product direction, and the overall growth of FSLabs.",
            },
          ].map((f) => (
            <div key={f.name} className="bg-[#050505] p-12 group hover:bg-[#0a0906] transition-colors">
              <div className="w-20 h-20 mb-8 flex items-center justify-center border border-[#c9a84c]/20 group-hover:border-[#c9a84c]/50 transition-colors">
                <span className="text-3xl font-bold text-[#c9a84c]">{f.initial}</span>
              </div>
              <h3 className="text-white text-2xl font-bold mb-1">{f.name}</h3>
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-6">{f.role}</p>
              <p className="text-white/45 text-sm leading-relaxed">{f.bio}</p>
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
          <h2 className="text-4xl font-bold text-white mb-8 leading-tight">
            Started in a classroom.<br />Built for the world.
          </h2>
          <div className="space-y-5 text-white/45 text-sm leading-relaxed">
            <p>
              Folub and Samuel met studying cybersecurity at university. Two people, same department, same mindset — obsessed with technology and what it could do in the right hands.
            </p>
            <p>
              They worked together, challenged each other, and quickly realized they were building something bigger than coursework. The conversations kept coming back to one thing: why settle for less when you can build something that actually changes things?
            </p>
            <p>
              So they did. Folub & Samuel Labs was born from that decision — a company where deep technical expertise meets real business ambition. Not just a service provider, but a technology partner built to help businesses grow, compete, and lead.
            </p>
            <p>
              Today FSLabs delivers software, cybersecurity, consulting, and outsourcing services to clients across industries. We have already built and launched our first product — TailorNow, a marketplace connecting clients to professional tailors across Africa. This is only the beginning.
            </p>
          </div>
        </div>

        <div className="border border-[#c9a84c]/10 p-10 space-y-6">
          {[
            { label: "Founded", val: "2024" },
            { label: "First Product", val: "TailorNow" },
            { label: "Expertise", val: "Cybersecurity + Software" },
            { label: "Reach", val: "Global" },
          ].map((s) => (
            <div key={s.label} className="flex justify-between items-center border-b border-[#c9a84c]/10 pb-5 last:border-0 last:pb-0">
              <p className="text-white/30 text-xs tracking-widest uppercase">{s.label}</p>
              <p className="text-[#c9a84c] font-semibold text-sm">{s.val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-[#c9a84c]/10 bg-[#050505] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-16">
            <div className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase">What Drives Us</span>
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

      {/* TailorNow callout */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="border border-[#c9a84c]/15 p-12 md:p-16 grid md:grid-cols-2 gap-10 items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />
          <div>
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Our First Product</p>
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">TailorNow — Fashion, on demand.</h2>
            <p className="text-white/40 text-sm leading-relaxed">
              TailorNow is our marketplace connecting clients to professional tailors across Africa. Order fashion design services online, get matched with skilled tailors, and bring your style to life. Built by FSLabs. Powered by real talent.
            </p>
          </div>
          <div className="flex md:justify-end">
            <Link href="/contact"
              className="inline-block px-10 py-4 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
              Work With Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
