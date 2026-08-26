import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetail from "@/components/academy/course-detail";
import { mockCourses } from "@/lib/academy/mock-data";

export async function generateStaticParams() {
  return mockCourses.map((course) => ({
    slug: course.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = mockCourses.find((c) => c.slug === slug);
  if (!course) return {};

  const title = `${course.title} Course`;
  const description = `${course.longDescription || course.description} Self-paced, ${course.level} level, starting at ₦${course.price.toLocaleString()}.`;

  return {
    title,
    description,
    alternates: { canonical: `/academy/courses/${course.slug}` },
    openGraph: {
      title: `${course.title} | FSLabs Academy`,
      description: course.description,
      url: `/academy/courses/${course.slug}`,
      type: "website",
      images: [{ url: "/fslabs-logo.PNG", alt: course.title }],
    },
    twitter: {
      card: "summary",
      title: `${course.title} | FSLabs Academy`,
      description: course.description,
    },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = mockCourses.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.longDescription || course.description,
    provider: {
      "@type": "Organization",
      name: "FSLabs Academy",
      sameAs: "https://fslabs.tech/academy",
    },
    offers: {
      "@type": "Offer",
      price: course.price,
      priceCurrency: course.currency,
      availability: "https://schema.org/InStock",
      url: `https://fslabs.tech/academy/courses/${course.slug}`,
    },
    ...(course.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: course.rating,
            reviewCount: course.reviewCount,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <Suspense fallback={null}>
        <CourseDetail course={course} />
      </Suspense>
    </>
  );
}
