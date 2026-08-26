import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "FSLabs Academy | Self-Paced Learning Platform",
    template: "%s | FSLabs Academy",
  },
  description: "FSLabs Academy - Learn software development, cybersecurity, and digital skills through self-paced courses.",
  alternates: { canonical: "/academy" },
  openGraph: {
    title: "FSLabs Academy | Self-Paced Learning Platform",
    description: "Learn software development, cybersecurity, and digital skills through self-paced courses. Starting from ₦40,000.",
    url: "/academy",
    siteName: "FSLabs Academy",
    locale: "en_NG",
    type: "website",
    images: [{ url: "/fslabs-logo.PNG", alt: "FSLabs Academy" }],
  },
  twitter: {
    card: "summary",
    title: "FSLabs Academy",
    description: "Learn software development, cybersecurity, and digital skills through self-paced courses.",
  },
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
