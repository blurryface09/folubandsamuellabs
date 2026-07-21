import type { Property } from "@/components/folub/PropertyCard";

/*
 * Sample catalogue. Swap for real listings (or wire to Prisma) later — the
 * shape is all the UI depends on. `image` is optional; cards fall back to a
 * navy gradient until real photography is dropped into /public/folub.
 */
export const properties: Property[] = [
  {
    slug: "the-cedar",
    name: "The Cedar — 4 Bed Detached",
    location: "Ikoyi, Lagos",
    price: "₦185M",
    status: "selling",
    beds: 4,
    baths: 4,
    area: "420 m²",
  },
  {
    slug: "aurora-terraces",
    name: "Aurora Terraces — 3 Bed",
    location: "Gwarinpa, Abuja",
    price: "₦92M",
    status: "off-plan",
    beds: 3,
    baths: 3,
    area: "280 m²",
  },
  {
    slug: "emerald-court",
    name: "Emerald Court — Gated Estate",
    location: "Lekki Phase 1, Lagos",
    price: "From ₦140M",
    status: "selling",
    beds: 5,
    baths: 5,
    area: "24 units",
  },
  {
    slug: "the-maple",
    name: "The Maple — 2 Bed Apartment",
    location: "Oniru, Lagos",
    price: "₦64M",
    status: "off-plan",
    beds: 2,
    baths: 2,
    area: "160 m²",
  },
  {
    slug: "palm-heights",
    name: "Palm Heights — Penthouse",
    location: "Victoria Island, Lagos",
    price: "₦310M",
    status: "selling",
    beds: 4,
    baths: 5,
    area: "520 m²",
  },
  {
    slug: "the-grove",
    name: "The Grove — Estate Phase I",
    location: "Ibeju-Lekki, Lagos",
    price: "Sold out",
    status: "sold-out",
    beds: 3,
    baths: 3,
    area: "36 units",
  },
];

export function getProperty(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}
