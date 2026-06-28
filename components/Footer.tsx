import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#c9a84c]/10">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <Logo size={32} />
            <div>
              <div className="text-white font-bold text-sm tracking-wide leading-none">FOLUB & SAMUEL</div>
              <div className="text-[#c9a84c] font-light text-[10px] tracking-[0.25em] mt-0.5">LABS</div>
            </div>
          </div>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Building the future of technology — software, security, and consulting for businesses that demand excellence.
          </p>
        </div>

        <div>
          <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase mb-5">Navigation</p>
          <ul className="space-y-3">
            {[["Home","/"],["About","/about"],["Services","/services"],["Contact","/contact"]].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-white/60 text-sm hover:text-[#c9a84c] transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase mb-5">Contact</p>
          <ul className="space-y-3 text-sm text-white/60">
            <li>sekosamuel@gmail.com</li>
            <li>folubandsamuellabs.com</li>
            <li className="text-[#c9a84c]/70">Nigeria · Remote Worldwide</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#c9a84c]/5 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-white/20 text-xs">© {new Date().getFullYear()} Folub & Samuel Labs. All rights reserved.</p>
          <p className="text-white/20 text-xs tracking-widest uppercase">Technology · Security · Consulting</p>
        </div>
      </div>
    </footer>
  );
}
