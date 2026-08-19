import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training",
  description: "FSLabs Training — 3-month intensive tech bootcamps in Full Stack Development, Cybersecurity, Machine Learning, and more. Based in Lagos, Nigeria.",
  alternates: { canonical: "/training" },
};

const courses = [
  {
    id: "fullstack",
    n: "01",
    title: "Full Stack Development",
    tag: "Frontend · Backend · DevOps",
    desc: "The complete package — build end-to-end web applications from UI to database to deployment. The most comprehensive track we offer.",
    price: 79000,
    originalPrice: 79000,
    topics: ["HTML, CSS, JavaScript, React", "Node.js, Express, PostgreSQL", "Git, CI/CD, Cloud Deployment", "3 Real-World Portfolio Projects"],
    featured: true,
  },
  {
    id: "ethical-hacking",
    n: "02",
    title: "Ethical Hacking Fundamentals",
    tag: "Cybersecurity · Penetration Testing",
    desc: "Learn to think like an attacker. Master the tools and techniques used by professional penetration testers and security engineers.",
    price: 75000,
    originalPrice: 75000,
    topics: ["Networking & Security Basics", "Kali Linux, Nmap, Metasploit", "Web App & Network Pentesting", "CTF Challenges + Report Writing"],
    featured: true,
  },
  {
    id: "machine-learning",
    n: "03",
    title: "Machine Learning Foundations",
    tag: "AI · Data Science · Python",
    desc: "From Python basics to building and training your own ML models. A practical introduction to artificial intelligence for builders.",
    price: 75000,
    originalPrice: 75000,
    topics: ["Python, NumPy, Pandas", "Supervised & Unsupervised Learning", "Neural Networks Introduction", "Hands-On ML Projects"],
    featured: false,
  },
  {
    id: "backend",
    n: "04",
    title: "Backend Development",
    tag: "Server · APIs · Databases",
    desc: "Build the invisible engine behind great products. Design robust APIs, manage databases, and deploy scalable server-side applications.",
    price: 69000,
    originalPrice: 69000,
    topics: ["Node.js, Express, NestJS", "REST APIs & Authentication (JWT)", "PostgreSQL & MongoDB", "Cloud Deployment (AWS / GCP)"],
    featured: false,
  },
  {
    id: "frontend",
    n: "05",
    title: "Frontend Development",
    tag: "UI · React · Responsive Design",
    desc: "Craft beautiful, fast, and accessible user interfaces. Master the modern web stack used by top product teams globally.",
    price: 65000,
    originalPrice: 65000,
    topics: ["HTML5, CSS3, JavaScript", "React.js & Next.js", "Responsive & Accessible UI", "Component-Based Architecture"],
    featured: false,
  },
  {
    id: "prompt-engineering",
    n: "06",
    title: "Prompt Engineering",
    tag: "AI Tools · LLMs · Automation",
    desc: "The skill no one taught in school. Learn to design, chain, and deploy prompts that turn LLMs into powerful business tools and products.",
    price: 40000,
    originalPrice: 40000,
    topics: ["LLM Fundamentals & APIs", "Prompt Design & Chaining", "RAG, Agents & Tool Use", "Build AI-Powered Products"],
    featured: false,
  },
];

function fmt(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export default function Training() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-24 max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-8 bg-[#c9a84c]" />
          <span className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase font-mono">Training</span>
        </div>
        <div className="flex items-end justify-between flex-wrap gap-8 mb-10">
          <h1 className="text-6xl md:text-8xl font-bold text-white leading-[0.95] tracking-tight">
            Build Skills.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5d060] via-[#c9a84c] to-[#9a7228]">Launch Careers.</span>
          </h1>
          <p className="text-white/40 text-base max-w-sm leading-relaxed">
            3-month intensive, project-based programmes taught by practicing FSLabs engineers. Online-first — live sessions available on request.
          </p>
        </div>

        {/* Key badges */}
        <div className="flex flex-wrap gap-3">
          {["3 Months", "Online · Live on Request", "Certificate Issued", "Cohort-Based", "Portfolio Projects"].map(b => (
            <span key={b} className="px-4 py-2 text-xs font-semibold tracking-wider uppercase text-[#c9a84c] border border-[#c9a84c]/25 bg-[#c9a84c]/06 rounded-full font-mono">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* Pricing intro banner */}
      <section className="border-y border-[#c9a84c]/10 bg-[#c9a84c]/[0.03] py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-[#c9a84c] rounded-full animate-pulse" />
            <p className="text-white/60 text-sm">
              <span className="text-white font-semibold">Introductory Pricing Active</span> — Enrol now at launch rates before prices return to normal.
            </p>
          </div>
          <a href="/FSLabs-Training-Brochure.pdf" download className="flex items-center gap-2 px-5 py-2.5 border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-semibold tracking-widest uppercase rounded hover:bg-[#c9a84c]/08 transition-colors font-mono">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download Brochure
          </a>
        </div>
      </section>

      {/* Course grid */}
      <section className="border-b border-[#c9a84c]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#c9a84c]/10">
          {courses.map((c) => (
            <div key={c.id} className={`group relative bg-[#080808] px-8 py-10 hover:bg-[#0e0c07] transition-colors overflow-hidden flex flex-col ${c.featured ? "lg:col-span-1" : ""}`}>
              {/* top rule on hover */}
              <div className="absolute top-0 left-0 w-0 h-px bg-gradient-to-r from-[#c9a84c] to-[#e8d080] group-hover:w-full transition-all duration-500" />

              {/* Featured glow */}
              {c.featured && (
                <div className="absolute top-0 right-0 w-px h-16 bg-gradient-to-b from-[#c9a84c]/60 to-transparent" />
              )}

              <p className="text-[#c9a84c]/25 text-xs font-mono mb-6 group-hover:text-[#c9a84c]/50 transition-colors">{c.n}</p>

              <h2 className="text-xl font-bold text-white mb-1 group-hover:text-[#c9a84c] transition-colors">{c.title}</h2>
              <p className="text-[#c9a84c]/50 text-xs tracking-wide mb-4 font-mono uppercase">{c.tag}</p>
              <p className="text-white/30 text-sm leading-relaxed mb-6 flex-1">{c.desc}</p>

              {/* Topics */}
              <ul className="space-y-2 mb-8">
                {c.topics.map(t => (
                  <li key={t} className="flex items-center gap-3 text-sm text-white/40">
                    <span className="w-1 h-1 bg-[#c9a84c] flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>

              {/* Pricing */}
              <div className="border-t border-[#c9a84c]/10 pt-6">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-2xl font-black text-[#c9a84c]">{fmt(c.price)}</span>
                </div>
                <p className="text-white/25 text-xs font-mono mb-5">Self-paced · one-time payment</p>
                <Link href="/contact"
                  className="block w-full text-center py-3 border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-bold tracking-widest uppercase rounded hover:bg-[#c9a84c] hover:text-[#0A0804] transition-all duration-200 font-mono">
                  Enrol Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Professional certs on request */}
      <section className="py-16 border-b border-[#c9a84c]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-10 border border-dashed border-[#c9a84c]/20 p-10 rounded">
            <div className="flex-shrink-0 text-5xl">🎓</div>
            <div className="flex-1">
              <p className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase font-mono mb-3">On Request</p>
              <h2 className="text-2xl font-bold text-white mb-3">Professional Certification Prep</h2>
              <p className="text-white/35 text-sm leading-relaxed max-w-xl">
                We can train you towards industry certifications including <strong className="text-white/60">CompTIA A+, Network+, Security+, CySA+</strong>, CEH, and more.
                These are tailored, one-on-one or small-group programmes. Pricing and duration vary by certification — reach out to discuss your goals.
              </p>
            </div>
            <Link href="/contact"
              className="flex-shrink-0 px-8 py-4 border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-bold tracking-widest uppercase rounded hover:bg-[#c9a84c]/10 transition-colors font-mono whitespace-nowrap">
              Enquire Now
            </Link>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-20 border-b border-[#c9a84c]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase font-mono">Every Student Gets</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🎥", title: "Live Sessions", desc: "Real-time instruction from practicing FSLabs engineers" },
              { icon: "🗂️", title: "Portfolio Projects", desc: "3+ real projects you own and can show employers" },
              { icon: "📜", title: "Certificate", desc: "FSLabs-verified certificate of completion" },
              { icon: "🤝", title: "Mentorship", desc: "1-on-1 sessions throughout the programme" },
              { icon: "🔁", title: "Session Recordings", desc: "Rewatch every class at your own pace" },
              { icon: "👥", title: "Alumni Community", desc: "Lifetime access to the FSLabs builder network" },
              { icon: "💼", title: "Job Support", desc: "Placement referrals and career guidance" },
              { icon: "🌍", title: "Online-First", desc: "Attend from anywhere · live in-person on request" },
            ].map(item => (
              <div key={item.title} className="group bg-[#080808] border border-[#c9a84c]/08 p-6 hover:border-[#c9a84c]/25 transition-colors rounded">
                <div className="text-2xl mb-4">{item.icon}</div>
                <h3 className="text-sm font-bold text-white mb-2 group-hover:text-[#c9a84c] transition-colors">{item.title}</h3>
                <p className="text-white/30 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment plans */}
      <section className="py-20 border-b border-[#c9a84c]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase font-mono">Flexible Payment</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#c9a84c]/06 border border-[#c9a84c]/30 p-8 rounded text-center">
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-mono mb-4">Full Payment</p>
              <p className="text-3xl font-black text-white mb-2">Pay Once</p>
              <p className="text-white/35 text-sm">Pay the full course fee upfront. Best value.</p>
            </div>
            <div className="bg-[#080808] border border-[#c9a84c]/12 p-8 rounded text-center">
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-mono mb-4">2-Part Payment</p>
              <p className="text-3xl font-black text-white mb-2">50% × 2</p>
              <p className="text-white/35 text-sm">Split across two months. Easy on the wallet.</p>
            </div>
            <div className="bg-[#080808] border border-[#c9a84c]/12 p-8 rounded text-center">
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-mono mb-4">Monthly Instalment</p>
              <p className="text-3xl font-black text-white mb-2">3 Months</p>
              <p className="text-white/35 text-sm">Pay as you learn — one third each month.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="border border-[#c9a84c]/15 p-16 md:p-24 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.04)_0%,_transparent_70%)]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />
            <div className="relative">
              <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6 font-mono">Enrolment Open</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to start?</h2>
              <p className="text-white/35 text-sm mb-12 max-w-md mx-auto leading-relaxed">
                Cohort sizes are limited. Secure your spot at the introductory price before it expires.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact"
                  className="inline-block px-12 py-5 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
                  Enrol Now
                </Link>
                <a href="/FSLabs-Training-Brochure.pdf" download
                  className="inline-flex items-center gap-2 px-10 py-5 border border-[#c9a84c]/30 text-[#c9a84c] font-bold text-sm tracking-widest uppercase hover:bg-[#c9a84c]/08 transition-colors font-mono">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2v8M5 7l3 3 3-3M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download Brochure
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
