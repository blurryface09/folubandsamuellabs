import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Self-paced courses in Full Stack Development, Frontend, Backend, Machine Learning, Ethical Hacking, and Prompt Engineering. Starting from ₦40,000.",
  alternates: { canonical: "/academy/courses" },
  openGraph: {
    title: "Courses | FSLabs Academy",
    description:
      "Self-paced courses in Full Stack Development, Frontend, Backend, Machine Learning, Ethical Hacking, and Prompt Engineering. Starting from ₦40,000.",
    url: "/academy/courses",
    type: "website",
    images: [{ url: "/fslabs-logo.PNG", alt: "FSLabs Academy" }],
  },
  twitter: {
    card: "summary",
    title: "Courses | FSLabs Academy",
    description: "Self-paced courses starting from ₦40,000.",
  },
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
