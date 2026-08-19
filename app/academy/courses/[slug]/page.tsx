import { Suspense } from "react";
import { notFound } from "next/navigation";
import CourseDetail from "@/components/academy/course-detail";
import { mockCourses } from "@/lib/academy/mock-data";

export async function generateStaticParams() {
  return mockCourses.map((course) => ({
    slug: course.slug,
  }));
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = mockCourses.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  return (
    <Suspense fallback={null}>
      <CourseDetail course={course} />
    </Suspense>
  );
}
