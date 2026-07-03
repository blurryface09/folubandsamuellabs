"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#services", label: "Services" },
    { href: "#about", label: "About" },
    { href: "#team", label: "Team" },
    { href: "/exchange", label: "FS Exchange" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(5,5,5,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(201,168,76,0.12)" : "1px solid transparent",
      transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease",
    }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
          <Image src="/fslabs-logo.svg" alt="FSLabs mark" width={40} height={40} priority style={{ flexShrink: 0 }} />
          {/* Gold vertical divider */}
          <div style={{ width: 1, height: 34, background: "linear-gradient(180deg, transparent, #C9A84C, transparent)", flexShrink: 0 }} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <span style={{ fontFamily: "var(--font-exo2)", fontWeight: 800, fontSize: 15, letterSpacing: "0.06em", color: "#FFFFFF" }}>
              FOLUB &amp; SAMUEL LABS
            </span>
            <span style={{ fontFamily: "var(--font-roboto-mono)", fontWeight: 400, fontSize: 8, letterSpacing: "0.22em", color: "rgba(201,168,76,0.55)", textTransform: "uppercase", marginTop: 2 }}>
              Technology &amp; Cybersecurity
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="fs-nav-links" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontFamily: "var(--font-roboto-mono)", fontSize: 12, fontWeight: 500,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "rgba(245,240,232,0.5)", textDecoration: "none",
              padding: "8px 16px", borderRadius: 8,
              transition: "color 0.2s, background 0.2s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#C9A84C"; (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.07)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(245,240,232,0.5)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >{l.label}</Link>
          ))}
          <Link href="#contact" style={{
            marginLeft: 12, padding: "10px 24px",
            background: "linear-gradient(135deg,#C9A84C,#8B6914)",
            color: "#050505", borderRadius: 10,
            fontFamily: "var(--font-roboto-mono)", fontWeight: 700, fontSize: 11,
            letterSpacing: "0.12em", textTransform: "uppercase",
            textDecoration: "none",
            boxShadow: "0 0 24px rgba(201,168,76,0.3)",
            transition: "box-shadow 0.25s, transform 0.2s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(201,168,76,0.6)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(201,168,76,0.3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >Get Started</Link>
        </div>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)} className="fs-hamburger"
          style={{ background: "none", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, cursor: "pointer", padding: "8px 10px", color: "#C9A84C" }}
          aria-label="Toggle menu">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {open ? (
              <><line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></>
            ) : (
              <><line x1="2" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="2" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "rgba(5,5,5,0.98)", backdropFilter: "blur(24px)", borderTop: "1px solid rgba(201,168,76,0.1)", padding: "20px 28px 32px" }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              display: "block", padding: "14px 0",
              fontFamily: "var(--font-roboto-mono)", fontSize: 13, fontWeight: 500,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "rgba(245,240,232,0.6)", textDecoration: "none",
              borderBottom: "1px solid rgba(201,168,76,0.08)",
            }}>{l.label}</Link>
          ))}
          <Link href="#contact" onClick={() => setOpen(false)} style={{
            display: "block", marginTop: 20, padding: "14px",
            background: "linear-gradient(135deg,#C9A84C,#8B6914)",
            color: "#050505", borderRadius: 10, textAlign: "center",
            fontFamily: "var(--font-roboto-mono)", fontWeight: 700, fontSize: 12,
            letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none",
          }}>Get Started</Link>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) { .fs-hamburger { display: none !important; } }
        @media (max-width: 767px) { .fs-nav-links { display: none !important; } }
      `}</style>
    </nav>
  );
}
