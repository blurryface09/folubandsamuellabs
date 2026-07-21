import type { Metadata } from "next";
import { FolubPageHeader } from "@/components/folub/FolubPageHeader";
import { PropertiesClient } from "./properties-client";
import { properties } from "@/lib/folub/properties";

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Browse available FOLUB Builders homes and off-plan opportunities across Lagos and Abuja — with transparent pricing and flexible payment plans.",
  alternates: { canonical: "/folub/properties" },
};

export default function PropertiesPage() {
  return (
    <>
      <FolubPageHeader
        eyebrow="Buy · Off-plan"
        title="Find where you belong."
        subtitle="Move-in-ready homes and off-plan opportunities, priced transparently. Filter by availability and book a private viewing whenever you're ready."
      />
      <PropertiesClient properties={properties} />
    </>
  );
}
