"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { mockCourses } from "@/lib/academy/mock-data";
import { pageTransition } from "@/lib/motion/animations";

type PageProps = {
  params: Promise<{
    slug: string;
    moduleId: string;
    lessonId: string;
  }>;
};

export default function LessonPage({ params }: PageProps) {
  const { slug, moduleId, lessonId } = use(params);

  // Find course
  const course = mockCourses.find((c) => c.slug === slug);
  if (!course) {
    return (
      <div style={{ padding: "60px 28px", textAlign: "center", color: "#F5F0E8" }}>
        Course not found
      </div>
    );
  }

  // Find module
  const module = course.modules.find((m) => m.id === moduleId);
  if (!module) {
    return (
      <div style={{ padding: "60px 28px", textAlign: "center", color: "#F5F0E8" }}>
        Module not found
      </div>
    );
  }

  // Find lesson
  const lesson = module.lessons.find((l) => l.id === lessonId);
  if (!lesson) {
    return (
      <div style={{ padding: "60px 28px", textAlign: "center", color: "#F5F0E8" }}>
        Lesson not found
      </div>
    );
  }

  // Find prev/next lessons
  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleId: m.id }))
  );
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Calculate progress
  const totalLessons = allLessons.length;
  const completedLessons = currentIndex;
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);

  return (
    <motion.main
      initial="initial"
      animate="animate"
      style={{ background: "#050505", color: "#F5F0E8", minHeight: "100vh" }}
    >
      {/* Top Navigation */}
      <motion.div variants={pageTransition} style={{ borderBottom: "1px solid rgba(201,168,76,0.1)", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link
            href={`/courses/${slug}`}
            style={{
              color: "rgba(201,168,76,0.8)",
              textDecoration: "none",
              fontSize: 12,
              fontFamily: "var(--font-roboto-mono)",
              letterSpacing: "0.1em",
            }}
          >
            ← Back to course
          </Link>
          <div style={{ fontSize: 12, color: "rgba(245,240,232,0.5)" }}>
            {completedLessons + 1} of {totalLessons}
          </div>
        </div>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 0 }}>
        {/* Sidebar */}
        <motion.aside
          variants={pageTransition}
          style={{
            background: "#0A0A0A",
            borderRight: "1px solid rgba(201,168,76,0.1)",
            padding: "40px 20px",
            maxHeight: "calc(100vh - 60px)",
            overflowY: "auto",
          }}
        >
          <h3
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              color: "#C9A84C",
              marginBottom: 20,
              fontFamily: "var(--font-exo2)",
            }}
          >
            Course Progress
          </h3>

          {/* Progress Bar */}
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                height: 4,
                background: "rgba(201,168,76,0.1)",
                borderRadius: 2,
                overflow: "hidden",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progressPercent}%`,
                  background: "linear-gradient(90deg, #C9A84C, #F0C040)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: "rgba(245,240,232,0.5)" }}>
              {progressPercent}% complete
            </div>
          </div>

          {/* Modules & Lessons */}
          {course.modules.map((m) => (
            <div key={m.id} style={{ marginBottom: 24 }}>
              <h4
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(245,240,232,0.8)",
                  marginBottom: 10,
                  paddingBottom: 8,
                  borderBottom: "1px solid rgba(201,168,76,0.1)",
                }}
              >
                Module {m.order}: {m.title}
              </h4>
              {m.lessons.map((l) => (
                <Link
                  key={l.id}
                  href={`/courses/${slug}/modules/${m.id}/lessons/${l.id}`}
                  style={{
                    display: "block",
                    padding: "8px 0",
                    fontSize: 12,
                    color: l.id === lessonId ? "#C9A84C" : "rgba(245,240,232,0.5)",
                    textDecoration: "none",
                    borderLeft: l.id === lessonId ? "2px solid #C9A84C" : "2px solid transparent",
                    paddingLeft: 10,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (l.id !== lessonId) {
                      (e.currentTarget as HTMLElement).style.color = "rgba(201,168,76,0.8)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (l.id !== lessonId) {
                      (e.currentTarget as HTMLElement).style.color = "rgba(245,240,232,0.5)";
                    }
                  }}
                >
                  {l.id === lessonId && "▶ "}
                  {l.title}
                </Link>
              ))}
            </div>
          ))}
        </motion.aside>

        {/* Main Content */}
        <motion.div
          variants={pageTransition}
          style={{
            padding: "60px 40px",
            maxWidth: "900px",
          }}
        >
          {/* Breadcrumb */}
          <div style={{ marginBottom: 40 }}>
            <div
              style={{
                fontSize: 11,
                color: "rgba(201,168,76,0.6)",
                fontFamily: "var(--font-roboto-mono)",
                marginBottom: 12,
              }}
            >
              {course.title} → Module {module.order} → Lesson
            </div>
            <h1
              style={{
                fontSize: 40,
                fontWeight: 800,
                fontFamily: "var(--font-exo2)",
                marginBottom: 16,
              }}
            >
              {lesson.title}
            </h1>
            <div
              style={{
                fontSize: 13,
                color: "rgba(245,240,232,0.5)",
              }}
            >
              {lesson.duration ? `${lesson.duration} minutes` : ""}
            </div>
          </div>

          {/* Video Section */}
          {lesson.videoUrl && (
            <div
              style={{
                marginBottom: 48,
                background: "#0A0A0A",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid rgba(201,168,76,0.1)",
                aspectRatio: "16/9",
              }}
            >
              <iframe
                src={lesson.videoUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                allowFullScreen
              />
            </div>
          )}

          {/* Content */}
          {lesson.content && (
            <div
              style={{
                marginBottom: 48,
                fontSize: 15,
                lineHeight: 1.8,
                color: "rgba(245,240,232,0.8)",
              }}
            >
              {lesson.content}
            </div>
          )}

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: 16,
              padding: "32px",
              background: "rgba(201,168,76,0.05)",
              borderRadius: 12,
              border: "1px solid rgba(201,168,76,0.1)",
            }}
          >
            <button
              style={{
                flex: 1,
                padding: "12px 24px",
                background: "linear-gradient(135deg, #C9A84C, #F0C040)",
                color: "#050505",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 14,
                fontFamily: "var(--font-roboto-mono)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 20px rgba(201,168,76,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              ✓ Mark as Complete
            </button>
          </div>

          {/* Navigation */}
          {(prevLesson || nextLesson) && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginTop: 40,
              }}
            >
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/modules/${prevLesson.moduleId}/lessons/${prevLesson.id}`}
                  style={{
                    padding: 16,
                    background: "rgba(201,168,76,0.05)",
                    border: "1px solid rgba(201,168,76,0.1)",
                    borderRadius: 8,
                    textDecoration: "none",
                    color: "#C9A84C",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.3)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.1)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.05)";
                  }}
                >
                  <div style={{ fontSize: 11, color: "rgba(201,168,76,0.6)" }}>← Previous</div>
                  <div style={{ fontWeight: 600, marginTop: 4 }}>{prevLesson.title}</div>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/courses/${slug}/modules/${nextLesson.moduleId}/lessons/${nextLesson.id}`}
                  style={{
                    padding: 16,
                    background: "rgba(201,168,76,0.05)",
                    border: "1px solid rgba(201,168,76,0.1)",
                    borderRadius: 8,
                    textDecoration: "none",
                    color: "#C9A84C",
                    textAlign: "right",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.3)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.1)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.05)";
                  }}
                >
                  <div style={{ fontSize: 11, color: "rgba(201,168,76,0.6)" }}>Next →</div>
                  <div style={{ fontWeight: 600, marginTop: 4 }}>{nextLesson.title}</div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          )}
        </motion.div>
      </div>
    </motion.main>
  );
}
