import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { properties, getProperty } from "@/lib/folub/properties";

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) return { title: "Property not found" };
  return {
    title: property.name,
    description: `${property.name} — ${property.location}. ${property.price}. Book a private viewing with FOLUB Builders.`,
    alternates: { canonical: `/folub/properties/${slug}` },
  };
}

const statusLabel: Record<string, string> = {
  selling: "Selling now",
  "off-plan": "Off-plan",
  "sold-out": "Sold out",
};

const highlights = [
  "Built and finished in-house to a single standard",
  "Titled land with verified documentation",
  "Flexible, structured payment plans available",
  "24/7 gated security and managed facilities",
];

export default async function PropertyDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  const { name, location, price, status, beds, baths, area, image } = property;
  const specs = [
    beds != null ? { l: "Bedrooms", v: String(beds) } : null,
    baths != null ? { l: "Bathrooms", v: String(baths) } : null,
    area ? { l: "Size", v: area } : null,
    { l: "Status", v: statusLabel[status] ?? status },
  ].filter(Boolean) as { l: string; v: string }[];

  return (
    <>
      {/* Header / gallery */}
      <section className="relative overflow-hidden bg-[#16283A] text-[#EFE9DC]">
        <div className="relative mx-auto max-w-6xl px-6 pb-14 pt-32 md:pt-40">
          <Link
            href="/folub/properties"
            className="text-sm text-[#9FAAB5] transition-colors hover:text-[#D9BE7C]"
          >
            ← All properties
          </Link>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="rounded bg-[#C6A24A] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-[#16283A]">
                {statusLabel[status] ?? status}
              </span>
              <h1 className="font-display mt-4 text-4xl font-medium md:text-5xl">{name}</h1>
              <p className="mt-2 text-[#C7CFD8]">{location}</p>
            </div>
            <p className="font-display text-3xl text-[#D9BE7C] md:text-4xl">{price}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        {/* gallery placeholder */}
        <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
          <div
            className="h-64 rounded-lg bg-cover bg-center md:col-span-2 md:row-span-2 md:h-full"
            style={{
              backgroundImage: image ? `url(${image})` : "linear-gradient(135deg,#2C4A67,#16283A)",
            }}
          />
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="hidden h-40 rounded-lg md:block"
              style={{ background: "linear-gradient(135deg,#EFEAE0,#DDD5C6)" }}
            />
          ))}
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          {/* main */}
          <div>
            <div className="grid grid-cols-2 gap-6 border-y border-[#E2DCD0] py-8 sm:grid-cols-4">
              {specs.map((s) => (
                <div key={s.l}>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#9C978B]">{s.l}</p>
                  <p className="font-display mt-1 text-xl text-[#1B2A38]">{s.v}</p>
                </div>
              ))}
            </div>

            <h2 className="font-display mt-10 text-2xl text-[#1B2A38]">About this property</h2>
            <p className="mt-4 leading-relaxed text-[#4A5560]">
              {name} sits in {location}, one of the areas where value holds and
              keeps growing. Designed, engineered, and finished entirely in-house
              by FOLUB Builders, every detail — from the foundation to the fittings
              — is held to the same uncompromising standard you&apos;ll see the day
              you collect your keys.
            </p>
            <p className="mt-4 leading-relaxed text-[#4A5560]">
              Whether you&apos;re buying to live or to invest, our team walks you
              through pricing, documentation, and payment options with complete
              transparency — no surprises at signing.
            </p>

            <h3 className="mt-10 text-sm font-bold uppercase tracking-[0.12em] text-[#213A54]">
              Highlights
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-sm text-[#4A5560]">
                  <span className="mt-0.5 text-[#C6A24A]">◆</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* sidebar CTA */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-lg border border-[#E2DCD0] bg-white p-7 shadow-[0_18px_40px_-30px_rgba(22,40,58,0.5)]">
              <p className="font-display text-2xl text-[#213A54]">{price}</p>
              <p className="mt-1 text-sm text-[#6E6A5F]">{location}</p>
              <Link
                href={`/folub/contact?property=${encodeURIComponent(name)}`}
                className="mt-6 block rounded bg-[#C6A24A] px-5 py-3.5 text-center text-sm font-semibold text-[#16283A] transition-colors hover:bg-[#D9BE7C]"
              >
                Book a private viewing
              </Link>
              <a
                href="tel:+2340000000000"
                className="mt-3 block rounded border border-[#213A54]/25 px-5 py-3.5 text-center text-sm font-semibold text-[#213A54] transition-colors hover:border-[#C6A24A]"
              >
                Call our team
              </a>
              <p className="mt-5 text-center text-xs text-[#9C978B]">
                Typical response within 1 business day.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
