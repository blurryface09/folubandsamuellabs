import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Two founders bridging technology and business — connecting companies to real talent and building products that matter. FSLabs, Lagos, Nigeria.",
  alternates: { canonical: "/about" },
};

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
              initial: "S",
              name: "Samuel",
              role: "Cofounder, Technical",
              bio: "Samuel is the builder. A cybersecurity professional and full stack developer who carries the full technical weight of FSLabs — from system architecture and backend engineering to security implementation and product delivery. He thinks in systems, ships in weeks, and holds the standard that everything we release has to actually work, scale, and be secure from day one.",
            },
            {
              initial: "A",
              name: "Akinbayo",
              role: "Cofounder, Business",
              bio: "Akinbayo is the business engine behind FSLabs. He drives strategy, client relationships, partnerships, and the commercial growth of everything we build. If FSLabs is moving, Akinbayo is making sure it moves in the right direction.",
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

      {/* CTA */}
      <section className="py-24 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-5">Ready to work together?</h2>
        <p className="text-white/40 mb-10 max-w-md mx-auto text-sm leading-relaxed">
          Tell us about your project and let us show you what FSLabs can do.
        </p>
        <Link href="/contact" className="inline-block px-12 py-4 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
          Contact Us
        </Link>
      </section>
    </>
  );
}
