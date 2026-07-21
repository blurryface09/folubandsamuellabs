"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolubLockup } from "@/components/folub/FolubLogo";

const links = [
  { href: "/folub/about", label: "About" },
  { href: "/folub/team", label: "Team" },
  { href: "/folub/contact", label: "Contact" },
];

export function FolubNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Solid (white) once scrolled; transparent over the navy hero at the top.
  const solid = scrolled || open;
  const linkColor = solid ? "text-[#334A5E]" : "text-[#D7DEE6]";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "bg-[#F7F4EE]/95 backdrop-blur border-b border-[#E2DCD0]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/folub" aria-label="FOLUB Builders home">
          <FolubLockup size={38} tone={solid ? "onLight" : "onDark"} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm tracking-wide transition-colors hover:text-[#C6A24A] ${linkColor}`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/folub/contact"
            className="rounded bg-[#C6A24A] px-5 py-2.5 text-sm font-semibold text-[#16283A] transition-colors hover:bg-[#D9BE7C]"
          >
            Get in touch
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className={`md:hidden ${solid ? "text-[#213A54]" : "text-[#F3ECDD]"}`}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-[#E2DCD0] bg-[#F7F4EE] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded px-2 py-3 text-[#334A5E] hover:bg-[#EFEAE0]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/folub/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded bg-[#C6A24A] px-5 py-3 text-center font-semibold text-[#16283A]"
            >
              Get in touch
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
