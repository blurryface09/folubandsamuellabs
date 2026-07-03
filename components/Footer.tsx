import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#04040A", padding: "60px 24px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 56 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #6366F1, #8B5CF6)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: 13, color: "#fff" }}>FS</span>
              </div>
              <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: 15, color: "#F1F5F9" }}>FSLabs</span>
            </div>
            <p style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 13, color: "rgba(241,245,249,0.45)", lineHeight: 1.7, maxWidth: 220 }}>
              Technology built to move fast. Cybersecurity built to hold tight.
            </p>
            <p style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 11, color: "rgba(241,245,249,0.25)", marginTop: 12 }}>RC No. 9637480</p>
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 600, fontSize: 13, color: "rgba(241,245,249,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Company</p>
            {["About", "Team", "Careers", "Blog"].map((t) => (
              <Link key={t} href={`#${t.toLowerCase()}`} style={{ display: "block", fontFamily: "var(--font-ibm-plex-sans)", fontSize: 14, color: "rgba(241,245,249,0.55)", textDecoration: "none", marginBottom: 10, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F1F5F9")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(241,245,249,0.55)")}
              >{t}</Link>
            ))}
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 600, fontSize: 13, color: "rgba(241,245,249,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Services</p>
            {["Software Development", "Cybersecurity", "FS Exchange", "Consulting"].map((t) => (
              <Link key={t} href="#services" style={{ display: "block", fontFamily: "var(--font-ibm-plex-sans)", fontSize: 14, color: "rgba(241,245,249,0.55)", textDecoration: "none", marginBottom: 10, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F1F5F9")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(241,245,249,0.55)")}
              >{t}</Link>
            ))}
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 600, fontSize: 13, color: "rgba(241,245,249,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Contact</p>
            <p style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 14, color: "rgba(241,245,249,0.55)", marginBottom: 8 }}>Lagos, Nigeria</p>
            <a href="mailto:admin@folubandsamuellabs.com" style={{ display: "block", fontFamily: "var(--font-ibm-plex-sans)", fontSize: 13, color: "rgba(99,102,241,0.8)", textDecoration: "none", wordBreak: "break-all" }}>
              admin@folubandsamuellabs.com
            </a>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 28, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <p style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 13, color: "rgba(241,245,249,0.3)" }}>
            &copy; {new Date().getFullYear()} Folub &amp; Samuel Labs Limited. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Service"].map((t) => (
              <Link key={t} href="#" style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 13, color: "rgba(241,245,249,0.3)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(241,245,249,0.7)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(241,245,249,0.3)")}
              >{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
