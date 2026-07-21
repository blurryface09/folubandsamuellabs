"use client";

import { useMemo, useState } from "react";
import { PropertyCard, type Property, type PropertyStatus } from "@/components/folub/PropertyCard";

type Filter = "all" | PropertyStatus;

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "selling", label: "Selling" },
  { key: "off-plan", label: "Off-plan" },
  { key: "sold-out", label: "Sold out" },
];

export function PropertiesClient({ properties }: { properties: Property[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    return properties.filter((p) => {
      const matchesStatus = filter === "all" || p.status === filter;
      const matchesQuery =
        query.trim() === "" ||
        `${p.name} ${p.location}`.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [properties, filter, query]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-[#213A54] text-[#F3ECDD]"
                  : "border border-[#E2DCD0] bg-white text-[#6E6A5F] hover:border-[#C6A24A] hover:text-[#213A54]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative md:w-72">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or location"
            aria-label="Search properties"
            className="w-full rounded-md border border-[#E2DCD0] bg-white px-4 py-2.5 text-sm text-[#1B2A38] placeholder:text-[#9C978B] focus:border-[#C6A24A] focus:outline-none"
          />
        </div>
      </div>

      <p className="mt-6 text-sm text-[#6E6A5F]">
        {results.length} {results.length === 1 ? "property" : "properties"}
      </p>

      {results.length > 0 ? (
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <PropertyCard key={p.slug} property={p} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-lg border border-dashed border-[#D8D1C3] bg-white p-12 text-center">
          <p className="font-display text-xl text-[#213A54]">Nothing matches that yet.</p>
          <p className="mt-2 text-sm text-[#6E6A5F]">
            Try a different filter, or tell us what you&apos;re looking for and we&apos;ll find it.
          </p>
        </div>
      )}
    </section>
  );
}
