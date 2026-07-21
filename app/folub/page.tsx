import Link from "next/link";
import { Reveal } from "@/components/folub/Reveal";
import { HouseScene } from "@/components/folub/HouseScene";

const promises = [
  { t: "One team, start to finish", d: "From the first block to the front door, the same people stay accountable." },
  { t: "Built to last", d: "Materials and workmanship chosen for the decades, not the photos." },
  { t: "Honest pricing", d: "Clear figures and clear paperwork. You always know what you are paying for." },
  { t: "Here after handover", d: "We look after what we build long after the keys change hands." },
];

const services = [
  {
    k: "Build",
    t: "We develop",
    d: "We find the right land and raise homes on it that people are proud to live in, designed and built by our own team to one exacting standard.",
  },
  {
    k: "Buy",
    t: "We sell",
    d: "We guide buyers and sellers through the whole journey with honest advice, clear documentation, and none of the usual guesswork.",
  },
  {
    k: "Keep",
    t: "We manage",
    d: "Our work does not stop at handover. We maintain and care for the properties we build so your investment keeps its value for years.",
  },
];

export default function FolubHome() {
  return (
    <>
      {/* ───────────────────────── HERO (3D) ───────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-[#16283A] text-[#EFE9DC]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(180deg, #101F2C 0%, #16283A 55%, #1D3348 100%)" }}
        />
        <HouseScene />
        {/* legibility scrim on the left */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgba(16,31,44,0.92) 0%, rgba(16,31,44,0.55) 40%, rgba(16,31,44,0) 70%)" }}
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#D9BE7C]">
              FOLUB Builders
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="font-display mt-6 max-w-[15ch] text-4xl font-medium leading-[1.03] md:text-6xl lg:text-7xl">
              Homes worth <em className="italic text-[#D9BE7C]">coming home</em> to.
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-[#C7CFD8] md:text-lg">
              We design, build, and sell beautiful property across Nigeria. The
              standard you see the day you collect your keys is the standard you
              live with for years after.
            </p>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/folub/contact"
                className="rounded bg-[#C6A24A] px-8 py-4 text-sm font-semibold text-[#16283A] transition-colors hover:bg-[#D9BE7C]"
              >
                Start a conversation
              </Link>
              <Link
                href="/folub/team"
                className="rounded border border-[#EAE3D4]/35 px-8 py-4 text-sm font-semibold text-[#EAE3D4] transition-colors hover:border-[#D9BE7C] hover:text-[#D9BE7C]"
              >
                Meet the team
              </Link>
            </div>
          </Reveal>
        </div>

        {/* scroll cue */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[#9FAAB5]">
          <span className="text-[0.62rem] uppercase tracking-[0.3em]">Scroll</span>
          <span className="h-10 w-px bg-gradient-to-b from-[#D9BE7C] to-transparent" />
        </div>
      </section>

      {/* ───────────────────── PROMISES STRIP ───────────────────── */}
      <section className="border-b border-[#E2DCD0] bg-[#F7F4EE]">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((p, i) => (
            <Reveal key={p.t} delay={i * 80}>
              <div>
                <div className="h-[3px] w-8 bg-[#C6A24A]" />
                <h3 className="mt-4 text-sm font-bold uppercase tracking-[0.08em] text-[#213A54]">
                  {p.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6E6A5F]">{p.d}</p>
              </div>
            </Reveal>
          ))}
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
            One team, from the first block to the front door.
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
      <section className="bg-[#EFEAE0]">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-2">
          <Reveal>
            <div>
              <div className="h-[3px] w-14 bg-[#C6A24A]" />
              <blockquote className="font-display mt-7 text-2xl italic leading-snug text-[#1B2A38] md:text-3xl">
                Quiet confidence. Structure you can trust. A standard you can feel
                in every room.
              </blockquote>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-[#6E6A5F]">
                What you see when you first walk through is exactly what you get on
                the day you move in. We design, build, and sell with our own team,
                so nothing is lost between the promise and the property.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="flex flex-col gap-6">
              {[
                { h: "Built by our own hands", p: "No shortcuts and no strangers on site. One team you can hold to account." },
                { h: "Nothing hidden", p: "Clear prices, verified titles, and paperwork you can actually read." },
                { h: "The right places", p: "We build where value grows, in neighbourhoods people want to stay in." },
                { h: "For the long run", p: "Care and maintenance that carries on well past the day you settle in." },
              ].map((v) => (
                <div key={v.h} className="border-l-2 border-[#C6A24A] pl-5">
                  <h4 className="text-sm font-bold uppercase tracking-[0.08em] text-[#213A54]">{v.h}</h4>
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
          style={{ background: "radial-gradient(90% 120% at 15% 0%, rgba(198,162,74,0.20), transparent 60%)" }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 py-20 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl font-medium text-[#F3ECDD] md:text-4xl">
              Let us build something that lasts.
            </h2>
            <p className="mt-3 max-w-lg text-[#C7CFD8]">
              Whether you want to buy, sell, develop, or partner with us, our team
              would love to hear from you.
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
