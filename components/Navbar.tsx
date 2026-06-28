"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#080808]/95 backdrop-blur-md border-b border-[#c9a84c]/10 py-3" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Logo size={36} />
          <div className="hidden sm:block">
            <div className="text-white font-bold text-sm tracking-wide leading-none">FOLUB & SAMUEL</div>
            <div className="text-[#c9a84c] font-light text-[10px] tracking-[0.25em] mt-0.5">LABS</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium tracking-wide transition-colors relative group ${
                pathname === l.href ? "text-[#c9a84c]" : "text-white/70 hover:text-white"
              }`}
            >
              {l.label}
              {pathname === l.href && (
                <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-[#c9a84c] to-[#e8d080]" />
              )}
            </Link>
          ))}
          <Link
            href="/contact"
            className="px-6 py-2.5 text-sm font-semibold tracking-wide border border-[#c9a84c]/60 text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black transition-all duration-200 rounded-sm"
          >
            Get Started
          </Link>
        </div>

        <button className="md:hidden text-white/70 hover:text-[#c9a84c] transition-colors" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          )}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#080808] border-t border-[#c9a84c]/10 px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`text-sm font-medium tracking-wide ${pathname === l.href ? "text-[#c9a84c]" : "text-white/70"}`}>
              {l.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)}
            className="mt-2 px-6 py-3 text-sm font-semibold text-center border border-[#c9a84c]/60 text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black transition-all">
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
