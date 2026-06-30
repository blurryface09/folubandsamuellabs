import Link from "next/link";

const quickLinks = [
  { href: "/exchange/trade/crypto", label: "Trade Crypto", icon: "₿", desc: "Buy or sell BTC, USDT, ETH and more" },
  { href: "/exchange/trade/giftcard", label: "Sell Gift Card", icon: "🎁", desc: "Steam, iTunes, Amazon, Google Play & more" },
  { href: "/exchange/accounts", label: "Get an Account", icon: "🏦", desc: "CashApp, Zelle, PayPal, bank accounts" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-6 bg-[#c9a84c]" />
          <span className="text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase">FSLabs Exchange</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">What do you need today?</h1>
        <p className="text-white/30 text-sm mb-14">Choose a service below. Fill in your details and our team will process your request.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#c9a84c]/10 mb-16">
          {quickLinks.map((l) => (
            <Link key={l.href} href={l.href}
              className="bg-[#080808] hover:bg-[#0b0906] transition-colors p-8 group flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-0 h-px bg-gradient-to-r from-[#c9a84c] to-[#e8d080] group-hover:w-full transition-all duration-500" />
              <p className="text-3xl mb-5">{l.icon}</p>
              <p className="text-white font-bold mb-2 group-hover:text-[#c9a84c] transition-colors">{l.label}</p>
              <p className="text-white/30 text-xs leading-relaxed mb-6">{l.desc}</p>
              <span className="text-[#c9a84c]/40 group-hover:text-[#c9a84c] group-hover:translate-x-1 transition-all text-sm mt-auto">→</span>
            </Link>
          ))}
        </div>

        <div className="border border-[#c9a84c]/10 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-6 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase">How We Work</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { n: "01", t: "Submit Request", d: "Fill out the form for the service you need." },
              { n: "02", t: "We Review", d: "Our team reviews within 30 minutes." },
              { n: "03", t: "We Contact You", d: "We reach out via email or WhatsApp." },
              { n: "04", t: "Done", d: "Transaction completed, value delivered." },
            ].map((s) => (
              <div key={s.n}>
                <p className="text-[#c9a84c] text-xs font-mono mb-3">{s.n}</p>
                <p className="text-white font-semibold text-sm mb-1">{s.t}</p>
                <p className="text-white/25 text-xs leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/20 text-xs">Questions? Contact us at{" "}
            <a href="mailto:sekosamuel@gmail.com" className="text-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors">sekosamuel@gmail.com</a>
            {" "}or WhatsApp us directly.
          </p>
        </div>

      </div>
    </div>
  );
}
