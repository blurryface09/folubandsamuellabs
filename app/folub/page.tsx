import Link from "next/link";
import { Reveal } from "@/components/folub/Reveal";

const stats = [
  { n: "240+", l: "Units delivered" },
  { n: "12", l: "Estates developed" },
  { n: "18 yrs", l: "Building trust" },
  { n: "100%", l: "In-house build" },
];

const services = [
  {
    k: "Build",
    t: "Property development",
    d: "We acquire land and develop residential and commercial projects end to end — designed, engineered, and finished in-house to a single, uncompromising standard.",
  },
  {
    k: "Buy",
    t: "Acquisition & sales",
    d: "We help clients buy and sell with a team that knows the market — handling valuation, documentation, and qualified buyers with complete transparency.",
  },
  {
    k: "Sell",
    t: "Facility management",
    d: "Our relationship doesn't end at handover. We manage and maintain properties long after the keys change hands, protecting your investment for the long term.",
  },
];

export default function FolubHome() {
  return (
    <>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative overflow-hidden bg-[#16283A] text-[#EFE9DC]">
        {/* ambient gold + blueprint texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            background:
              "radial-gradient(120% 90% at 85% -10%, rgba(198,162,74,0.18), transparent 55%), linear-gradient(180deg, #16283A 0%, #213A54 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#C6A24A 1px, transparent 1px), linear-gradient(90deg, #C6A24A 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-28 md:pt-36">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D9BE7C]">
              Build · Buy · Sell
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-5 max-w-[16ch] text-4xl font-medium leading-[1.05] md:text-6xl lg:text-7xl">
              Homes built to <em className="italic text-[#D9BE7C]">outlast</em> the years.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#C7CFD8] md:text-lg">
              FOLUB Builders develops, sells, and manages premium residential and
              commercial property — crafted for people who invest in permanence,
              not trends.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/folub/contact"
                className="rounded bg-[#C6A24A] px-7 py-3.5 text-sm font-semibold text-[#16283A] transition-colors hover:bg-[#D9BE7C]"
              >
                Get in touch
              </Link>
              <Link
                href="/folub/about"
                className="rounded border border-[#EAE3D4]/35 px-7 py-3.5 text-sm font-semibold text-[#EAE3D4] transition-colors hover:border-[#D9BE7C] hover:text-[#D9BE7C]"
              >
                About FOLUB
              </Link>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <dl className="mt-16 grid grid-cols-2 gap-x-10 gap-y-8 border-t border-white/10 pt-10 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.l}>
                  <dt className="font-display text-3xl text-[#D9BE7C] md:text-4xl">{s.n}</dt>
                  <dd className="mt-2 text-xs uppercase tracking-[0.14em] text-[#9FAAB5]">
                    {s.l}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────── SERVICES ─────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-[#6E6A5F]">
            What we do
            <span className="h-px flex-1 bg-[#E2DCD0]" />
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display mt-6 max-w-2xl text-3xl font-medium leading-tight text-[#1B2A38] md:text-4xl">
            One team for the whole journey — from ground to keys.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.k} delay={i * 100}>
              <div className="flex h-full flex-col rounded-lg border border-[#E2DCD0] bg-white p-8">
                <span className="font-display text-5xl text-[#C6A24A]">{s.k}</span>
                <h3 className="mt-5 text-lg font-semibold text-[#1B2A38]">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6E6A5F]">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────────── WHY FOLUB ───────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <Reveal>
            <div>
              <div className="h-[3px] w-14 bg-[#C6A24A]" />
              <blockquote className="font-display mt-7 text-2xl italic leading-snug text-[#1B2A38] md:text-3xl">
                Quiet confidence. Structure you can trust. A gold standard in
                every square metre.
              </blockquote>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-[#6E6A5F]">
                The standard you see in the showroom is the standard you get at
                handover. We design, build, and sell in-house — so nothing gets
                lost between the promise and the property.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="flex flex-col gap-6">
              {[
                {
                  h: "Built in-house",
                  p: "No sub-contracted shortcuts. From foundation to finish, one accountable team.",
                },
                {
                  h: "Transparent pricing",
                  p: "Clear figures and structured payment plans. No surprises at signing.",
                },
                {
                  h: "Prime locations",
                  p: "We build where value holds — established neighbourhoods and growth corridors.",
                },
                {
                  h: "After handover",
                  p: "Facility management and support that continues long after you get the keys.",
                },
              ].map((v) => (
                <div key={v.h} className="border-l-2 border-[#C6A24A] pl-5">
                  <h4 className="text-sm font-bold uppercase tracking-[0.08em] text-[#213A54]">
                    {v.h}
                  </h4>
                  <p className="mt-1.5 text-sm text-[#6E6A5F]">{v.p}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── CTA BAND ───────────────────── */}
      <section className="relative overflow-hidden bg-[#213A54]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            background:
              "radial-gradient(90% 120% at 15% 0%, rgba(198,162,74,0.20), transparent 60%)",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 py-20 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl font-medium text-[#F3ECDD] md:text-4xl">
              Let&apos;s build something that lasts.
            </h2>
            <p className="mt-3 max-w-lg text-[#C7CFD8]">
              Talk to our team about buying, selling, developing, or partnering
              with FOLUB Builders.
            </p>
          </div>
          <Link
            href="/folub/contact"
            className="shrink-0 rounded bg-[#C6A24A] px-8 py-4 text-sm font-semibold text-[#16283A] transition-colors hover:bg-[#D9BE7C]"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
