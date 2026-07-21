import Link from "next/link";

export type PropertyStatus = "selling" | "off-plan" | "sold-out";

export type Property = {
  slug: string;
  name: string;
  location: string;
  price: string;
  status: PropertyStatus;
  beds?: number;
  baths?: number;
  area?: string;
  /* Optional hero image path once real photos are added, e.g. "/folub/the-cedar.jpg" */
  image?: string;
};

const statusStyles: Record<PropertyStatus, string> = {
  selling: "bg-[#C6A24A] text-[#16283A]",
  "off-plan": "bg-[#2C4A67] text-[#F1EADB]",
  "sold-out": "bg-[#6E6A5F] text-[#F1EADB]",
};

const statusLabel: Record<PropertyStatus, string> = {
  selling: "Selling",
  "off-plan": "Off-plan",
  "sold-out": "Sold out",
};

export function PropertyCard({ property }: { property: Property }) {
  const { slug, name, location, price, status, beds, baths, area, image } = property;
  return (
    <Link
      href={`/folub/properties/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-[#E2DCD0] bg-white transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(22,40,58,0.45)]"
    >
      <div
        className="relative h-52 bg-cover bg-center"
        style={{
          backgroundImage: image
            ? `url(${image})`
            : "linear-gradient(135deg, #2C4A67, #16283A)",
        }}
      >
        <span
          className={`absolute left-4 top-4 rounded px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider ${statusStyles[status]}`}
        >
          {statusLabel[status]}
        </span>
        <span className="font-display absolute bottom-4 left-5 text-2xl text-[#F1EADB]">
          {price}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-[#1B2A38] transition-colors group-hover:text-[#A9863A]">
          {name}
        </h3>
        <p className="mt-1 text-sm text-[#6E6A5F]">{location}</p>
        <div className="mt-auto flex gap-5 border-t border-[#EFEAE0] pt-4 text-xs tracking-wide text-[#6E6A5F]">
          {beds != null && <span>{beds} Beds</span>}
          {baths != null && <span>{baths} Baths</span>}
          {area && <span>{area}</span>}
        </div>
      </div>
    </Link>
  );
}
