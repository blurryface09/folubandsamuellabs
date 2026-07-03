"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#process", label: "Process" },
  { href: "/#team", label: "Team" },
  { href: "/exchange", label: "Exchange", highlight: true },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "py-3 bg-white/90 backdrop-blur-md border-b border-[#E5E0D8] shadow-sm" : "py-5 bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-[#4F46E5] flex items-center justify-center rounded-sm">
            <span className="text-white text-xs font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>FS</span>
          </div>
          <div>
            <div className="text-[#1A1714] font-semibold text-sm leading-none tracking-wide" style={{ fontFamily: "var(--font-space-grotesk)" }}>FSLabs</div>
            <div className="text-[#4F46E5] text-[9px] tracking-[0.15em] mt-0.5" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>RC 9637480</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href}
              className={`text-xs tracking-wide transition-colors font-medium ${
                l.highlight
                  ? "text-[#0891B2] hover:text-[#1A1714] border border-[#0891B2]/30 hover:border-[#0891B2] px-3 py-1.5 rounded-sm"
                  : "text-[#7A746D] hover:text-[#1A1714]"
              }`}
              style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
              {l.label}
            </Link>
          ))}
          <Link href="/#contact"
            className="px-5 py-2 bg-[#4F46E5] text-white text-xs font-semibold tracking-wide rounded-sm hover:bg-[#4338CA] transition-colors"
            style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
            Start Project
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-[#7A746D] hover:text-[#1A1714] transition-colors" aria-label="Menu">
          {open
            ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/></svg>
            : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16"/></svg>
          }
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-[#E5E0D8] px-6 py-6 flex flex-col gap-5 shadow-lg">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-xs tracking-wide text-[#7A746D] hover:text-[#1A1714] transition-colors"
              style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
              {l.label}
            </Link>
          ))}
          <Link href="/#contact" onClick={() => setOpen(false)}
            className="mt-2 px-5 py-3 bg-[#4F46E5] text-white text-xs font-semibold tracking-wide text-center rounded-sm hover:bg-[#4338CA] transition-colors"
            style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
            Start Project
          </Link>
        </div>
      )}
    </nav>
  );
}
