import Link from "next/link";

const services = [
  {
    n: "01",
    icon: "🏦",
    title: "Virtual Bank Accounts",
    desc: "Get a real USD, GBP, or EUR account number. Receive your freelance salary, client payments, and international transfers directly — no physical bank required.",
    tags: ["USD Account", "GBP Account", "SWIFT / ACH"],
  },
  {
    n: "02",
    icon: "₿",
    title: "Crypto Exchange",
    desc: "Buy and sell Bitcoin, USDT, ETH, and more at competitive rates. Fund subscriptions, receive payments, or hold value — fast and reliable.",
    tags: ["Bitcoin", "USDT", "Ethereum"],
  },
  {
    n: "03",
    icon: "🎮",
    title: "Gift Card Trading",
    desc: "Trade Steam, iTunes, Amazon, Google Play, and other gift cards instantly. Buy cards for personal use or sell cards you already own for naira.",
    tags: ["Steam", "iTunes", "Amazon", "Google Play"],
  },
  {
    n: "04",
    icon: "💸",
    title: "Bill Payments",
    desc: "Pay for international subscriptions — Netflix, Spotify, ChatGPT, Adobe, and more — using your crypto or local balance. No foreign card needed.",
    tags: ["Netflix", "Spotify", "ChatGPT", "Adobe"],
  },
];

const steps = [
  { n: "01", title: "Create Your Account", desc: "Sign up in minutes. Verify your identity and you're ready to go." },
  { n: "02", title: "Choose a Service", desc: "Virtual account, crypto swap, gift card trade — pick what you need." },
  { n: "03", title: "Transact Safely", desc: "Every transaction is reviewed, secured, and completed by our team." },
  { n: "04", title: "Receive Your Value", desc: "Get naira to your bank, crypto to your wallet, or your account funded." },
];

export default function Exchange() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,_rgba(201,168,76,0.08)_0%,_transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 w-full relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs font-medium tracking-[0.25em] uppercase">FSLabs Exchange</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-white leading-[0.93] tracking-tight mb-8 max-w-4xl">
            Your Money.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5d060] via-[#c9a84c] to-[#9a7228]">
              Any Currency.
            </span><br />
            Anywhere.
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-xl leading-relaxed mb-12">
            Virtual bank accounts, crypto exchange, gift card trading, and bill payments — built for freelancers, remote workers, and digital professionals across Africa.
          </p>

          <div className="flex flex-wrap gap-4 mb-20">
            <Link href="/contact"
              className="px-8 py-4 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-sm tracking-wide hover:opacity-90 transition-opacity">
              Get Started
            </Link>
            <a href="#services"
              className="px-8 py-4 border border-white/15 text-white/70 font-medium text-sm tracking-wide hover:border-[#c9a84c]/50 hover:text-[#c9a84c] transition-all">
              See Services
            </a>
          </div>

          {/* Trust bar */}
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            {["Secure Transactions", "Fast Processing", "Real Rates", "Human Support"].map((t, i) => (
              <div key={t} className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-[#c9a84c]" />
                <span className="text-white/35 text-xs tracking-widest uppercase">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-[#c9a84c]/10 bg-[#050505] py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase">What We Offer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">Exchange Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#c9a84c]/10">
            {services.map((s) => (
              <div key={s.title} className="bg-[#050505] p-10 group hover:bg-[#0a0906] transition-colors relative overflow-hidden">
                <div className="absolute top-0 left-0 w-0 h-px bg-gradient-to-r from-[#c9a84c] to-[#e8d080] group-hover:w-full transition-all duration-500" />
                <p className="text-[#c9a84c]/25 text-xs font-mono mb-5 group-hover:text-[#c9a84c]/50 transition-colors">{s.n}</p>
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="text-white text-xl font-semibold mb-3 group-hover:text-[#c9a84c] transition-colors">{s.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-6">{s.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map((tag) => (
                    <span key={tag} className="text-[10px] tracking-widest uppercase text-[#c9a84c]/40 border border-[#c9a84c]/15 px-3 py-1 group-hover:border-[#c9a84c]/30 group-hover:text-[#c9a84c]/60 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20 items-start">
          <div className="sticky top-32">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#c9a84c]" />
              <span className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase">How It Works</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Simple.<br />Secure.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5d060] via-[#c9a84c] to-[#9a7228]">Done.</span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed">
              No complicated forms. No hidden fees. Just straightforward financial services handled by real people who understand your needs.
            </p>
          </div>

          <div className="space-y-0 border border-[#c9a84c]/10">
            {steps.map((step, i) => (
              <div key={step.n} className={`p-8 hover:bg-[#0a0906] transition-colors group ${i !== steps.length - 1 ? "border-b border-[#c9a84c]/10" : ""}`}>
                <div className="flex gap-6 items-start">
                  <span className="text-[#c9a84c] text-xs font-mono pt-1 shrink-0">{step.n}</span>
                  <div>
                    <h3 className="text-white font-semibold mb-2 group-hover:text-[#c9a84c] transition-colors">{step.title}</h3>
                    <p className="text-white/35 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why FSLabs Exchange */}
      <section className="border-t border-[#c9a84c]/10 bg-[#050505] py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase">Why Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">Built by tech people.<br />For tech people.</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#c9a84c]/10">
            {[
              { title: "Real Rates", desc: "We don't bury fees in bad exchange rates. What you see is what you get." },
              { title: "Fast Turnaround", desc: "Most transactions are completed within minutes — not days." },
              { title: "Human Support", desc: "Real people on the other end. Reach us on WhatsApp, email, or chat." },
              { title: "Built on Trust", desc: "Backed by FSLabs, a registered technology company with a track record." },
              { title: "Freelancer-First", desc: "Designed for people who work globally and get paid in foreign currency." },
              { title: "Always Improving", desc: "We add new services as the digital economy evolves. You grow, we grow." },
            ].map((item) => (
              <div key={item.title} className="bg-[#050505] p-8 hover:bg-[#0a0906] transition-colors group">
                <div className="w-8 h-px bg-[#c9a84c]/30 mb-6 group-hover:bg-[#c9a84c]/70 transition-colors" />
                <h3 className="text-white font-semibold mb-3 group-hover:text-[#c9a84c] transition-colors">{item.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{item.desc}</p>
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
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">FSLabs Exchange</p>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to take control<br />of your finances?
            </h2>
            <p className="text-white/40 text-base mb-12 max-w-md mx-auto">
              Join FSLabs Exchange and access the global financial system from anywhere in Africa.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact"
                className="inline-block px-12 py-5 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
                Get Started Today
              </Link>
              <Link href="/contact"
                className="inline-block px-12 py-5 border border-[#c9a84c]/30 text-[#c9a84c] font-medium text-sm tracking-widest uppercase hover:border-[#c9a84c] transition-colors">
                Talk to Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
