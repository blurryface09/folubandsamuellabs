"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer style={{ background: "#030303", borderTop: "1px solid rgba(201,168,76,0.1)", position: "relative", overflow: "hidden" }}>
      {/* Giant watermark */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "var(--font-exo2)", fontWeight: 900, fontSize: "clamp(120px,20vw,280px)", color: "rgba(201,168,76,0.025)", letterSpacing: "-0.05em", pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>
        FSLABS
      </div>

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "72px 28px 36px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }} className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <Image src="/fslabs-logo.svg" alt="FSLabs" width={40} height={40} />
              <div>
                <div style={{ fontFamily: "var(--font-exo2)", fontWeight: 800, fontSize: 14, letterSpacing: "0.06em", background: "linear-gradient(135deg,#F0C040,#C9A84C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>FOLUB &amp; SAMUEL</div>
                <div style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 8, letterSpacing: "0.25em", color: "rgba(201,168,76,0.4)", textTransform: "uppercase" }}>Labs Limited</div>
              </div>
            </div>
            <p style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 12, color: "rgba(245,240,232,0.35)", lineHeight: 1.9, maxWidth: 260 }}>
              Technology built to move fast. Cybersecurity built to hold tight. Registered in Nigeria.
            </p>
            <p style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 10, color: "rgba(201,168,76,0.3)", marginTop: 16, letterSpacing: "0.1em" }}>RC No. 9637480</p>

            {/* Gold divider */}
            <div style={{ marginTop: 24, height: 1, width: 48, background: "linear-gradient(90deg,#C9A84C,transparent)" }} />
          </div>

          {[
            { title: "Company", links: [{ label: "About", href: "#about" }, { label: "Team", href: "#team" }, { label: "Services", href: "#services" }, { label: "Contact", href: "#contact" }] },
            { title: "Services", links: [{ label: "Software Dev", href: "#services" }, { label: "Cybersecurity", href: "#services" }, { label: "Digital Solutions", href: "#services" }, { label: "FS Exchange", href: "/exchange" }] },
            { title: "Contact", links: [{ label: "Lagos, Nigeria", href: "#" }, { label: "admin@folubandsamuellabs.com", href: "mailto:admin@folubandsamuellabs.com" }] },
          ].map(col => (
            <div key={col.title}>
              <p style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: 20, fontWeight: 700 }}>{col.title}</p>
              {col.links.map(l => (
                <Link key={l.label} href={l.href} style={{ display: "block", fontFamily: "var(--font-roboto-mono)", fontSize: 12, color: "rgba(245,240,232,0.4)", textDecoration: "none", marginBottom: 12, transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,240,232,0.4)")}
                >{l.label}</Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(201,168,76,0.08)", paddingTop: 28, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <p style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 11, color: "rgba(245,240,232,0.2)", letterSpacing: "0.05em" }}>
            &copy; {new Date().getFullYear()} Folub &amp; Samuel Labs Limited. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Service"].map(t => (
              <Link key={t} href="#" style={{ fontFamily: "var(--font-roboto-mono)", fontSize: 11, color: "rgba(245,240,232,0.2)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,240,232,0.2)")}
              >{t}</Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 540px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
