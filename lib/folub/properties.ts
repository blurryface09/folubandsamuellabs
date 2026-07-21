import type { Property } from "@/components/folub/PropertyCard";

/*
 * Real property listings go here. Empty until FOLUB provides real homes — the
 * UI shows a "coming soon" state while this array is empty, so no invented
 * properties are ever displayed.
 *
 * To add a listing, push an object matching the Property shape, e.g.:
 *   {
 *     slug: "the-cedar",           // unique, URL-safe
 *     name: "The Cedar — 4 Bed Detached",
 *     location: "Ikoyi, Lagos",
 *     price: "₦185M",
 *     status: "selling",           // "selling" | "off-plan" | "sold-out"
 *     beds: 4,
 *     baths: 4,
 *     area: "420 m²",
 *     image: "/folub/the-cedar.jpg", // optional; falls back to a navy panel
 *   }
 */
export const properties: Property[] = [];

export function getProperty(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}
