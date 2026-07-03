"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease",
        background: scrolled ? "rgba(4,4,10,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg, #6366F1, #8B5CF6)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(99,102,241,0.5)" }}>
            <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: 14, color: "#fff", letterSpacing: "-0.5px" }}>FS</span>
          </div>
          <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: 16, color: "#F1F5F9", letterSpacing: "-0.3px" }}>
            Folub <span style={{ opacity: 0.4 }}>&amp;</span> Samuel Labs
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="fs-nav-links">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 14, fontWeight: 500, color: "rgba(241,245,249,0.65)", textDecoration: "none", padding: "8px 14px", borderRadius: 8, transition: "color 0.2s, background 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#F1F5F9"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(241,245,249,0.65)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="#contact"
            style={{ marginLeft: 8, padding: "9px 20px", background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#fff", borderRadius: 10, fontFamily: "var(--font-ibm-plex-sans)", fontSize: 14, fontWeight: 600, textDecoration: "none", boxShadow: "0 0 20px rgba(99,102,241,0.35)", transition: "box-shadow 0.2s, transform 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(99,102,241,0.6)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(99,102,241,0.35)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            Get Started
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="fs-hamburger"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "#F1F5F9" }}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {open ? (
              <>
                <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div style={{ background: "rgba(4,4,10,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 24px 24px" }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ display: "block", padding: "12px 0", color: "rgba(241,245,249,0.8)", textDecoration: "none", fontSize: 15, fontFamily: "var(--font-ibm-plex-sans)", fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {l.label}
            </Link>
          ))}
          <Link href="#contact" onClick={() => setOpen(false)} style={{ display: "block", marginTop: 16, padding: "12px 20px", background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#fff", borderRadius: 10, fontFamily: "var(--font-ibm-plex-sans)", fontSize: 14, fontWeight: 600, textDecoration: "none", textAlign: "center" }}>
            Get Started
          </Link>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) { .fs-hamburger { display: none !important; } }
        @media (max-width: 767px) { .fs-nav-links { display: none !important; } }
      `}</style>
    </nav>
  );
}
