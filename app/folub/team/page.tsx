import type { Metadata } from "next";
import Link from "next/link";
import { FolubPageHeader } from "@/components/folub/FolubPageHeader";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the people behind FOLUB Builders. The leadership and specialists who stay accountable for every project, from the first day on site to the day you get your keys.",
  alternates: { canonical: "/folub/team" },
};

/*
 * Leadership. These are role-based placeholders — replace `name` with the real
 * person, add a `photo` path (e.g. "/folub/team/managing-director.jpg"), and
 * flesh out `bio` when FOLUB provides real details. The layout adapts to any
 * number of members.
 */
type Member = {
  name: string;
  role: string;
  bio: string;
  photo?: string;
};

const leadership: Member[] = [
  {
    name: "Adefolu Akinbayo",
    role: "CEO & Founder",
    bio: "Founder of FOLUB Builders. The name itself comes from Adefolu. He sets the vision and the standard, and leads strategy and development from the ground up.",
  },
  {
    name: "Adeseko Samuel",
    role: "Co-Founder & Chief Technology Officer",
    bio: "Leads technology and systems across FOLUB, building the platforms and processes that keep every project transparent, efficient, and accountable. He is also involved in the operations and administration that keep projects moving.",
  },
];

const departments = [
  {
    t: "Development",
    d: "Acquisition, design, and planning that turns land into homes worth living in.",
  },
  {
    t: "Construction",
    d: "Our own engineers and site teams who build to last, with no shortcuts and no strangers on site.",
  },
  {
    t: "Sales & Client Care",
    d: "The people you will actually talk to, from your first enquiry through to handover.",
  },
  {
    t: "Facility Management",
    d: "Ongoing maintenance and support that protects your investment long after handover.",
  },
];

export default function TeamPage() {
  return (
    <>
      <FolubPageHeader
        eyebrow="Our team"
        title="The people who build it."
        subtitle="FOLUB is a team of developers, engineers, and specialists who take one project as seriously as the next, and stay accountable from the first day on site to the day you get your keys."
      />

      {/* leadership */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-[#6E6A5F]">
          Leadership
          <span className="h-px flex-1 bg-[#E2DCD0]" />
        </p>
        <div className="mt-12 grid max-w-3xl gap-8 sm:grid-cols-2">
          {leadership.map((m) => (
            <div
              key={m.role}
              className="flex flex-col overflow-hidden rounded-lg border border-[#E2DCD0] bg-white"
            >
              <div
                className="h-56 bg-cover bg-center"
                style={{
                  backgroundImage: m.photo
                    ? `url(${m.photo})`
                    : "linear-gradient(135deg,#2C4A67,#16283A)",
                }}
              />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold text-[#1B2A38]">{m.name}</h3>
                <p className="text-sm font-medium text-[#A9863A]">{m.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-[#6E6A5F]">{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* departments */}
      <section className="bg-[#EFEAE0]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl text-[#1B2A38] md:text-4xl">
            One team, four disciplines.
          </h2>
          <p className="mt-3 max-w-xl text-[#6E6A5F]">
            Every FOLUB project is delivered end to end by people under one roof.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((d, i) => (
              <div key={d.t} className="rounded-lg border border-[#E2DCD0] bg-white p-7">
                <span className="font-display text-3xl text-[#C6A24A]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-base font-semibold text-[#1B2A38]">{d.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6E6A5F]">{d.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* careers CTA */}
      <section className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-2xl text-[#1B2A38] md:text-3xl">
            Want to build with us?
          </h2>
          <p className="mt-2 max-w-lg text-[#6E6A5F]">
            We&apos;re always glad to hear from talented people who take pride in
            building things that last.
          </p>
        </div>
        <Link
          href="/folub/contact"
          className="shrink-0 rounded bg-[#213A54] px-7 py-3.5 text-sm font-semibold text-[#F3ECDD] transition-colors hover:bg-[#2C4A67]"
        >
          Get in touch
        </Link>
      </section>
    </>
  );
}
