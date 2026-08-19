import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "FSLabs Academy | Self-Paced Learning Platform",
    template: "%s | FSLabs Academy",
  },
  description: "FSLabs Academy - Learn software development, cybersecurity, and digital skills through self-paced courses.",
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
