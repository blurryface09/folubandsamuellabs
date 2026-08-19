"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { mockCourses } from "@/lib/academy/mock-data";
import { pageTransition } from "@/lib/motion/animations";

export default function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; moduleId: string; lessonId: string }>;
}) {
  const { slug, moduleId, lessonId } = use(params);

  const course = mockCourses.find((c) => c.slug === slug);
  const module = course?.modules.find((m) => m.id === moduleId);
  const lesson = module?.lessons.find((l) => l.id === lessonId);

  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    if (!course) return;
    fetch(`/api/progress?courseId=${course.id}`)
      .then((res) => (res.ok ? res.json() : { completedLessonIds: [] }))
      .then((data: { completedLessonIds: string[] }) => {
        setCompletedLessonIds(new Set(data.completedLessonIds));
      })
      .catch(() => {});
  }, [course]);

  const dbLessonId = course && lesson ? `${course.id}-${lesson.id}` : null;
  const isComplete = dbLessonId ? completedLessonIds.has(dbLessonId) : false;

  const handleToggleComplete = async () => {
    if (!course || !dbLessonId) return;
    setMarking(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          lessonId: dbLessonId,
          completed: !isComplete,
        }),
      });

      if (res.ok) {
        setCompletedLessonIds((prev) => {
          const next = new Set(prev);
          if (isComplete) {
            next.delete(dbLessonId);
          } else {
            next.add(dbLessonId);
          }
          return next;
        });
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
    } finally {
      setMarking(false);
    }
  };

  if (!course || !module || !lesson) {
    return (
      <div
        style={{
          background: "#050505",
          color: "#F5F0E8",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Lesson not found</h1>
          <Link href={`/academy/courses/${slug}`} style={{ color: "#C9A84C" }}>
            ← Back to course
          </Link>
        </div>
      </div>
    );
  }

  const allLessons = module.lessons;
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <motion.main initial="initial" animate="animate" style={{ background: "#050505", color: "#F5F0E8", minHeight: "100vh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 40, maxWidth: 1400, margin: "0 auto" }}>
        {/* Main Content */}
        <motion.section variants={pageTransition} style={{ padding: "132px 28px 60px" }}>
          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              gap: 8,
              fontSize: 12,
              color: "rgba(245,240,232,0.5)",
              marginBottom: 32,
              fontFamily: "var(--font-roboto-mono)",
            }}
          >
            <Link href="/academy/courses" style={{ color: "rgba(245,240,232,0.5)" }}>
              Courses
            </Link>
            <span>/</span>
            <Link href={`/academy/courses/${slug}`} style={{ color: "rgba(245,240,232,0.5)" }}>
              {course.title}
            </Link>
            <span>/</span>
            <Link href={`/academy/courses/${slug}`} style={{ color: "rgba(245,240,232,0.5)" }}>
              {module.title}
            </Link>
            <span>/</span>
            <span style={{ color: "#C9A84C" }}>{lesson.title}</span>
          </div>

          {/* Lesson Title */}
          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              fontFamily: "var(--font-exo2)",
              marginBottom: 40,
              lineHeight: 1.2,
            }}
          >
            {lesson.title}
          </h1>

          {/* Video */}
          {lesson.videoUrl && (
            <div
              style={{
                marginBottom: 60,
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid rgba(201,168,76,0.1)",
              }}
            >
              <iframe
                width="100%"
                height={500}
                src={lesson.videoUrl}
                title={lesson.title}
                style={{ display: "block" }}
                allowFullScreen
              />
            </div>
          )}

          {/* Lesson Content */}
          <div
            style={{
              background: "#0A0A0A",
              border: "1px solid rgba(201,168,76,0.1)",
              borderRadius: 12,
              padding: 40,
              marginBottom: 60,
            }}
          >
            <div
              style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: "rgba(245,240,232,0.8)",
              }}
              dangerouslySetInnerHTML={{ __html: lesson.content || "" }}
            />
          </div>

          {/* Mark Complete */}
          <button
            onClick={handleToggleComplete}
            disabled={marking}
            style={{
              width: "100%",
              padding: "16px 24px",
              marginBottom: 24,
              background: isComplete ? "rgba(16,185,129,0.1)" : "rgba(201,168,76,0.1)",
              border: `1px solid ${isComplete ? "rgba(16,185,129,0.4)" : "rgba(201,168,76,0.3)"}`,
              borderRadius: 8,
              color: isComplete ? "#10B981" : "#C9A84C",
              fontWeight: 700,
              fontSize: 14,
              cursor: marking ? "not-allowed" : "pointer",
              opacity: marking ? 0.6 : 1,
              transition: "all 0.2s",
            }}
          >
            {marking ? "Saving..." : isComplete ? "✓ Completed" : "Mark as Complete"}
          </button>

          {/* Navigation */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {prevLesson ? (
              <Link
                href={`/academy/courses/${slug}/modules/${moduleId}/lessons/${prevLesson.id}`}
                style={{
                  padding: "16px 24px",
                  background: "rgba(201,168,76,0.05)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: 8,
                  color: "#C9A84C",
                  textDecoration: "none",
                  fontSize: 14,
                  transition: "all 0.2s",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.05)";
                }}
              >
                ← {prevLesson.title}
              </Link>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <Link
                href={`/academy/courses/${slug}/modules/${moduleId}/lessons/${nextLesson.id}`}
                style={{
                  padding: "16px 24px",
                  background: "linear-gradient(135deg, #C9A84C, #F0C040)",
                  border: "none",
                  borderRadius: 8,
                  color: "#050505",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 700,
                  textAlign: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(201,168,76,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {nextLesson.title} →
              </Link>
            ) : (
              <div />
            )}
          </div>
        </motion.section>

        {/* Sidebar - Course Progress */}
        <aside style={{ padding: "132px 28px 60px" }}>
          <div
            style={{
              background: "#0A0A0A",
              border: "1px solid rgba(201,168,76,0.1)",
              borderRadius: 12,
              padding: 24,
              position: "sticky",
              top: "80px",
            }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: "#C9A84C" }}>{module.title}</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {module.lessons.map((l, idx) => {
                const lDone = course ? completedLessonIds.has(`${course.id}-${l.id}`) : false;
                return (
                  <Link
                    key={l.id}
                    href={`/academy/courses/${slug}/modules/${moduleId}/lessons/${l.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 12px",
                      background: l.id === lesson.id ? "rgba(201,168,76,0.1)" : "transparent",
                      borderLeft: `2px solid ${l.id === lesson.id ? "#C9A84C" : "transparent"}`,
                      borderRadius: 4,
                      color: l.id === lesson.id ? "#F5F0E8" : "rgba(245,240,232,0.6)",
                      textDecoration: "none",
                      fontSize: 12,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (l.id !== lesson.id) {
                        (e.currentTarget as HTMLElement).style.color = "rgba(245,240,232,0.8)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (l.id !== lesson.id) {
                        (e.currentTarget as HTMLElement).style.color = "rgba(245,240,232,0.6)";
                      }
                    }}
                  >
                    <span style={{ color: lDone ? "#10B981" : "inherit", flexShrink: 0 }}>
                      {lDone ? "✓" : `${idx + 1}.`}
                    </span>
                    {l.title}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </motion.main>
  );
}
