import type { Metadata } from "next";
import Link from "next/link";
import { FolubPageHeader } from "@/components/folub/FolubPageHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "FOLUB Builders develops, buys, and sells premium property with our own team, from foundation to finish. Our story, our standard, and the people behind it.",
  alternates: { canonical: "/folub/about" },
};

const stats = [
  { n: "18 yrs", l: "Building experience" },
  { n: "240+", l: "Units delivered" },
  { n: "12", l: "Estates developed" },
  { n: "100%", l: "Built by our own team" },
];

const principles = [
  {
    t: "We build what we sell",
    d: "No shortcuts and no middlemen. FOLUB designs, engineers, and finishes every project with one accountable team, so the standard never slips between the promise and the property.",
  },
  {
    t: "Transparency by default",
    d: "Clear pricing, verified titles, and structured payment plans. You'll always know exactly what you're paying for, and exactly what you're getting.",
  },
  {
    t: "We build for permanence",
    d: "We choose locations where value holds and materials that last. A FOLUB home is an investment in something that outlives trends.",
  },
];

export default function AboutPage() {
  return (
    <>
      <FolubPageHeader
        eyebrow="Our story"
        title="A gold standard in every square metre."
        subtitle="FOLUB Builders is a property developer that builds, buys, and sells homes from start to finish, made for people who invest in permanence, not trends."
      />

      {/* narrative */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-14 md:grid-cols-2">
          <div>
            <div className="h-[3px] w-14 bg-[#C6A24A]" />
            <h2 className="font-display mt-6 text-3xl text-[#1B2A38] md:text-4xl">
              Founded on one idea: build it like you&apos;ll live in it.
            </h2>
          </div>
          <div className="space-y-4 text-[#4A5560]">
            <p className="leading-relaxed">
              FOLUB Builders began with a simple frustration. Too many homes looked
              the part on viewing day and fell short by the time you moved in. We set
              out to close that gap by keeping the whole process under one roof:
              acquisition, design, construction, and sale.
            </p>
            <p className="leading-relaxed">
              Today we develop residential and commercial property across Lagos and
              Abuja, from private residences to gated estates and mixed use
              developments, and we manage many of them long after the keys change
              hands.
            </p>
          </div>
        </div>
      </section>

      {/* stats band */}
      <section className="bg-[#213A54]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-6 py-16 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l}>
              <p className="font-display text-4xl text-[#D9BE7C]">{s.n}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#9FAAB5]">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* principles */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-[#6E6A5F]">
          What we stand for
          <span className="h-px flex-1 bg-[#E2DCD0]" />
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {principles.map((p, i) => (
            <div key={p.t} className="rounded-lg border border-[#E2DCD0] bg-white p-8">
              <span className="font-display text-3xl text-[#C6A24A]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[#1B2A38]">{p.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#6E6A5F]">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* team preview */}
      <section className="bg-[#EFEAE0]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-20 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-3xl text-[#1B2A38] md:text-4xl">The people behind FOLUB</h2>
            <p className="mt-3 max-w-xl text-[#6E6A5F]">
              A team that stays accountable for every project, from the first day on site to the day you get your keys.
            </p>
          </div>
          <Link
            href="/folub/team"
            className="rounded border border-[#213A54]/25 px-6 py-3.5 text-sm font-semibold text-[#213A54] transition-colors hover:border-[#C6A24A]"
          >
            Meet the team →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
        <h2 className="font-display text-2xl text-[#1B2A38] md:text-3xl">
          Want to build, buy, or sell with us?
        </h2>
        <Link
          href="/folub/contact"
          className="rounded bg-[#213A54] px-7 py-3.5 text-sm font-semibold text-[#F3ECDD] transition-colors hover:bg-[#2C4A67]"
        >
          Talk to our team
        </Link>
      </section>
    </>
  );
}
