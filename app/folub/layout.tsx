import type { Metadata } from "next";
import { FolubNav } from "@/components/folub/FolubNav";
import { FolubFooter } from "@/components/folub/FolubFooter";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "FOLUB Builders | Build. Buy. Sell.",
    template: "%s | FOLUB Builders",
  },
  description:
    "FOLUB Builders develops, sells, and manages premium residential and commercial property. Homes built to outlast the years.",
  alternates: { canonical: "/folub" },
  openGraph: {
    title: "FOLUB Builders | Build. Buy. Sell.",
    description:
      "Premium residential and commercial real estate, developed, sold, and managed by our own team.",
    url: `${SITE_URL}/folub`,
    siteName: "FOLUB Builders",
    locale: "en_NG",
    type: "website",
  },
};

export default function FolubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="folub flex min-h-screen flex-col">
      <FolubNav />
      <main className="flex-1">{children}</main>
      <FolubFooter />
    </div>
  );
}
