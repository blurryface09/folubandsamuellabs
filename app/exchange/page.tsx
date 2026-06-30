import Link from "next/link";

const services = [
  {
    n: "01",
    title: "Crypto Trading",
    desc: "Buy and sell Bitcoin, USDT, Ethereum and more at real market rates. Fast settlements, no hidden charges.",
    items: ["Bitcoin (BTC)", "Tether (USDT)", "Ethereum (ETH)", "Litecoin (LTC)"],
    href: "/exchange/trade/crypto",
    cta: "Trade Crypto",
  },
  {
    n: "02",
    title: "Gift Card Exchange",
    desc: "Sell your unused gift cards for naira instantly. We accept all major cards at competitive rates.",
    items: ["Steam", "iTunes / Apple", "Amazon", "Google Play", "Visa / Mastercard Gift"],
    href: "/exchange/trade/giftcard",
    cta: "Trade Gift Cards",
  },
  {
    n: "03",
    title: "Virtual Bank Accounts",
    desc: "Get a verified account on major US payment platforms. Receive freelance payments, international transfers, and more.",
    items: ["CashApp", "Zelle", "PayPal", "Venmo", "Chime", "SoFi"],
    href: "/exchange/accounts",
    cta: "Get an Account",
  },
  {
    n: "04",
    title: "Traditional Bank Accounts",
    desc: "We help you set up real USD, GBP, and EUR bank accounts. Receive international wire transfers and SWIFT payments.",
    items: ["USD Account", "GBP Account", "SWIFT / ACH Transfers", "International Wires"],
    href: "/exchange/accounts",
    cta: "Get a Bank Account",
  },
];

const steps = [
  { n: "01", t: "Create Account", d: "Sign up free in under 2 minutes. No paperwork, no waiting." },
  { n: "02", t: "Submit Request", d: "Choose your service, fill in the details, and submit your trade or account request." },
  { n: "03", t: "We Verify & Process", d: "Our team reviews your request and processes it — typically within 30 minutes during business hours." },
  { n: "04", t: "Receive Your Value", d: "Get naira to your bank, crypto to your wallet, or your new account credentials." },
];

export default function ExchangeLanding() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-5%,_rgba(201,168,76,0.1)_0%,_transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_60%,_rgba(201,168,76,0.04)_0%,_transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 w-full relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-[11px] font-medium tracking-[0.3em] uppercase">FSLabs Exchange</span>
          </div>

          <h1 className="text-6xl md:text-[88px] font-bold text-white leading-[0.92] tracking-tight mb-8 max-w-4xl">
            Trade.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5d060] via-[#c9a84c] to-[#9a7228]">
              Exchange.
            </span><br />
            Get Paid.
          </h1>

          <p className="text-white/45 text-lg md:text-xl max-w-lg leading-relaxed mb-14">
            Crypto trading, gift card exchange, and real payment accounts — all in one place. Built for freelancers, remote workers, and digital professionals across Africa.
          </p>

          <div className="flex flex-wrap gap-4 mb-24">
            <Link href="/exchange/dashboard"
              className="px-10 py-4 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
              Create Free Account
            </Link>
            <Link href="/exchange/dashboard"
              className="px-10 py-4 border border-white/10 text-white/60 font-medium text-sm tracking-wide hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-all">
              Sign In
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#c9a84c]/10">
            {[
              { v: "₦ / $", l: "Real Rates" },
              { v: "~30min", l: "Avg. Processing" },
              { v: "6+", l: "Payment Platforms" },
              { v: "24/7", l: "Support Available" },
            ].map((s) => (
              <div key={s.l} className="bg-[#080808] px-8 py-6">
                <p className="text-[#c9a84c] text-2xl font-bold mb-1">{s.v}</p>
                <p className="text-white/30 text-xs tracking-widest uppercase">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-[#c9a84c]/10 bg-[#050505] py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-[11px] tracking-[0.3em] uppercase">Our Services</span>
          </div>
          <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Everything you need.</h2>
            <Link href="/exchange/dashboard" className="text-sm text-white/30 hover:text-[#c9a84c] transition-colors tracking-wide">
              Get started →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#c9a84c]/10">
            {services.map((s) => (
              <div key={s.title} className="bg-[#050505] p-10 group hover:bg-[#0b0906] transition-colors relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-0 h-px bg-gradient-to-r from-[#c9a84c] to-[#e8d080] group-hover:w-full transition-all duration-500" />
                <p className="text-[#c9a84c]/20 text-xs font-mono mb-6 group-hover:text-[#c9a84c]/50 transition-colors">{s.n}</p>
                <h3 className="text-white text-xl font-bold mb-3 group-hover:text-[#c9a84c] transition-colors">{s.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed mb-6">{s.desc}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {s.items.map((item) => (
                    <span key={item} className="text-[10px] tracking-widest uppercase text-[#c9a84c]/40 border border-[#c9a84c]/10 px-3 py-1 group-hover:border-[#c9a84c]/25 transition-colors">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-auto">
                  <Link href={s.href}
                    className="inline-flex items-center gap-2 text-sm text-[#c9a84c]/50 group-hover:text-[#c9a84c] transition-colors font-medium tracking-wide">
                    {s.cta} <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-24 items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#c9a84c]" />
              <span className="text-[#c9a84c] text-[11px] tracking-[0.3em] uppercase">How It Works</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Simple process.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5d060] via-[#c9a84c] to-[#9a7228]">Real results.</span>
            </h2>
            <p className="text-white/35 text-base leading-relaxed mb-10">
              No complicated verification loops. No endless waiting. Submit your request and our team handles the rest — fast, private, and reliable.
            </p>
            <Link href="/exchange/dashboard"
              className="inline-block px-10 py-4 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
              Get Started Free
            </Link>
          </div>

          <div className="border border-[#c9a84c]/10">
            {steps.map((s, i) => (
              <div key={s.n} className={`p-8 group hover:bg-[#0b0906] transition-colors ${i !== steps.length - 1 ? "border-b border-[#c9a84c]/10" : ""}`}>
                <div className="flex gap-6">
                  <span className="text-[#c9a84c] text-xs font-mono shrink-0 pt-1">{s.n}</span>
                  <div>
                    <p className="text-white font-semibold mb-1.5 group-hover:text-[#c9a84c] transition-colors">{s.t}</p>
                    <p className="text-white/30 text-sm leading-relaxed">{s.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#c9a84c]/10 bg-[#050505] py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="border border-[#c9a84c]/15 p-16 md:p-24 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.05)_0%,_transparent_70%)]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent" />
            <div className="relative">
              <p className="text-[#c9a84c] text-[11px] tracking-[0.35em] uppercase mb-6">Start Today</p>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Your global financial<br />access starts here.
              </h2>
              <p className="text-white/35 text-base mb-12 max-w-md mx-auto leading-relaxed">
                Join FSLabs Exchange and trade crypto, exchange gift cards, and access real payment accounts — all from Nigeria.
              </p>
              <Link href="/exchange/dashboard"
                className="inline-block px-14 py-5 bg-gradient-to-r from-[#c9a84c] to-[#e8d080] text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
