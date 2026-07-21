import Link from "next/link";
import { FolubMark } from "@/components/folub/FolubLogo";

const columns = [
  {
    title: "Company",
    links: [
      { href: "/folub", label: "Home" },
      { href: "/folub/about", label: "About us" },
      { href: "/folub/team", label: "Our team" },
      { href: "/folub/contact", label: "Contact" },
    ],
  },
  {
    title: "What we do",
    links: [
      { href: "/folub/about", label: "Property development" },
      { href: "/folub/about", label: "Buying & selling" },
      { href: "/folub/about", label: "Facility management" },
      { href: "/folub/contact", label: "Work with us" },
    ],
  },
];

export function FolubFooter() {
  return (
    <footer className="mt-auto bg-[#16283A] text-[#C6CDD6]">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <FolubMark size={40} tone="onDark" />
            <span className="flex flex-col leading-none">
              <span className="text-lg font-semibold tracking-[0.18em] text-[#F3ECDD]">FOLUB</span>
              <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.42em] text-[#D9BE7C]">
                Builders
              </span>
            </span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#95A2AE]">
            We build, buy, and sell property made to outlast the years, from
            private homes to mixed use developments.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9BE7C]">
              {col.title}
            </h4>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="transition-colors hover:text-[#F3ECDD]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9BE7C]">Get in touch</h4>
          <ul className="mt-5 flex flex-col gap-3 text-sm">
            <li>Lagos, Nigeria</li>
            <li>
              <a href="mailto:hello@folubbuilders.com" className="transition-colors hover:text-[#F3ECDD]">
                hello@folubbuilders.com
              </a>
            </li>
            <li>
              <a href="tel:+2340000000000" className="transition-colors hover:text-[#F3ECDD]">
                +234 000 000 0000
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#22384F]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-[#7E8B98] md:flex-row">
          <p>© {new Date().getFullYear()} FOLUB Builders. All rights reserved.</p>
          <p className="tracking-wide">Build · Buy · Sell</p>
        </div>
      </div>
    </footer>
  );
}
