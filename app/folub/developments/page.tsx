import type { Metadata } from "next";
import Link from "next/link";
import { FolubPageHeader } from "@/components/folub/FolubPageHeader";
import { ComingSoon } from "@/components/folub/ComingSoon";

export const metadata: Metadata = {
  title: "Developments",
  description:
    "Explore FOLUB Builders' estates and mixed-use developments — completed, under construction, and now selling across Lagos and Abuja.",
  alternates: { canonical: "/folub/developments" },
};

type Phase = "completed" | "under-construction" | "selling";

/*
 * Real developments go here. Empty until FOLUB provides real projects — the
 * page shows a "coming soon" state while this array is empty. To add one, push
 * an object matching the shape below (phase: "completed" | "under-construction"
 * | "selling", progress: 0–100).
 */
const developments: {
  name: string;
  location: string;
  phase: Phase;
  units: string;
  progress: number;
  blurb: string;
}[] = [];

const phaseMeta: Record<Phase, { label: string; className: string }> = {
  completed: { label: "Completed", className: "bg-[#6E6A5F] text-[#F1EADB]" },
  "under-construction": { label: "Under construction", className: "bg-[#2C4A67] text-[#F1EADB]" },
  selling: { label: "Selling now", className: "bg-[#C6A24A] text-[#16283A]" },
};

export default function DevelopmentsPage() {
  return (
    <>
      <FolubPageHeader
        eyebrow="Build"
        title="Estates and developments, ground to keys."
        subtitle="Every FOLUB development is acquired, designed, built, and sold in-house — from private residences to gated estates and mixed-use projects."
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        {developments.length === 0 ? (
          <ComingSoon
            title="Our next developments are taking shape."
            message="We're planning our upcoming estates and mixed-use projects. Register your interest to be the first to hear when they launch."
          />
        ) : (
        <div className="flex flex-col gap-14">
          {developments.map((d, i) => {
            const meta = phaseMeta[d.phase];
            return (
              <div
                key={d.name}
                className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
              >
                <div
                  className={`h-64 rounded-lg md:h-72 ${i % 2 === 1 ? "md:order-2" : ""}`}
                  style={{ background: "linear-gradient(135deg,#2C4A67,#16283A)" }}
                />
                <div>
                  <span
                    className={`inline-block rounded px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider ${meta.className}`}
                  >
                    {meta.label}
                  </span>
                  <h2 className="font-display mt-4 text-3xl text-[#1B2A38]">{d.name}</h2>
                  <p className="mt-1 text-sm text-[#6E6A5F]">
                    {d.location} · {d.units}
                  </p>
                  <p className="mt-4 leading-relaxed text-[#4A5560]">{d.blurb}</p>

                  <div className="mt-6 max-w-sm">
                    <div className="flex items-center justify-between text-xs text-[#6E6A5F]">
                      <span className="uppercase tracking-[0.12em]">Build progress</span>
                      <span className="font-semibold text-[#213A54]">{d.progress}%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E2DCD0]">
                      <div
                        className="h-full rounded-full bg-[#C6A24A]"
                        style={{ width: `${d.progress}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    href="/folub/contact"
                    className="mt-7 inline-block text-sm font-semibold text-[#213A54] underline-offset-4 hover:text-[#A9863A] hover:underline"
                  >
                    Enquire about {d.name} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </section>

      {/* CTA band */}
      <section className="bg-[#213A54]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl text-[#F3ECDD]">Building something of your own?</h2>
            <p className="mt-2 max-w-lg text-[#C7CFD8]">
              We take on select joint-venture and bespoke development projects. Let&apos;s talk.
            </p>
          </div>
          <Link
            href="/folub/contact"
            className="shrink-0 rounded bg-[#C6A24A] px-7 py-3.5 text-sm font-semibold text-[#16283A] transition-colors hover:bg-[#D9BE7C]"
          >
            Start a conversation
          </Link>
        </div>
      </section>
    </>
  );
}
