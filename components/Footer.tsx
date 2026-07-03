export default function Footer() {
  return (
    <footer className="border-t border-[#E5E0D8] bg-[#F2EFE9] py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-[#4F46E5] rounded-sm flex items-center justify-center">
              <span className="text-white text-[9px] font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>FS</span>
            </div>
            <span className="text-[#1A1714] font-semibold text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>FSLabs</span>
          </div>
          <div className="text-[#7A746D] text-[11px]" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
            © 2026 Folub & Samuel Labs
          </div>
          <div className="text-[#7A746D]/60 text-[10px] mt-0.5" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
            RC No. 9637480 · Incorporated June 2026 · Lagos, Nigeria
          </div>
        </div>
        <div className="flex items-center gap-6">
          {[
            { label: "Services", href: "/#services" },
            { label: "Exchange", href: "/exchange" },
            { label: "Contact", href: "/#contact" },
          ].map(l => (
            <a key={l.label} href={l.href}
              className="text-[#7A746D] hover:text-[#4F46E5] transition-colors text-[11px] tracking-wide"
              style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
