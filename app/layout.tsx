import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://fslabs.tech"),
  title: {
    default: "Folub & Samuel Labs | Technology & Cybersecurity",
    template: "%s | FSLabs",
  },
  description: "FSLabs — software development, cybersecurity, and digital solutions from Lagos, Nigeria. RC No. 9637480.",
  keywords: "software development Lagos, cybersecurity Nigeria, IT consulting, tech outsourcing, penetration testing Nigeria, FSLabs",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: "Folub & Samuel Labs | Technology & Cybersecurity",
    description: "Software development, cybersecurity, IT consulting, and tech outsourcing from Lagos, Nigeria.",
    url: "https://fslabs.tech",
    siteName: "Folub & Samuel Labs",
    locale: "en_NG",
    type: "website",
    images: [{ url: "/fslabs-logo.PNG", alt: "Folub & Samuel Labs" }],
  },
  twitter: {
    card: "summary",
    title: "Folub & Samuel Labs",
    description: "Software development, cybersecurity, IT consulting, and tech outsourcing from Lagos, Nigeria.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Folub & Samuel Labs",
  alternateName: "FSLabs",
  url: "https://fslabs.tech",
  logo: "https://fslabs.tech/fslabs-logo.PNG",
  description: "Software development, cybersecurity, IT consulting, and tech outsourcing company based in Lagos, Nigeria.",
  address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#050505] text-[#F5F0E8] antialiased">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
