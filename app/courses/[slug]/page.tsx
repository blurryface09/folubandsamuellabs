"use client";

import Link from "next/link";
import { use } from "react";
import { motion } from "framer-motion";
import { mockCourses } from "@/lib/academy/mock-data";
import { ProgressBar } from "@/components/academy/progress-bar";
import { fadeInUp, pageTransition, scrollReveal } from "@/lib/motion/animations";
import {
  formatPrice,
  calculateDiscountedPrice,
  formatDuration,
  getTotalCourseDuration,
} from "@/lib/academy/utils";

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = use(params);
  const course = mockCourses.find((c) => c.slug === slug);

  if (!course) {
    return (
      <main style={{ background: "#050505", color: "#F5F0E8", minHeight: "100vh" }}>
        <div style={{ padding: "160px 28px", textAlign: "center", maxWidth: 1320, margin: "0 auto" }}>
          <h1 style={{ fontSize: 32, fontFamily: "var(--font-exo2)", marginBottom: 12 }}>
            Course not found
          </h1>
          <p style={{ color: "rgba(245,240,232,0.6)", marginBottom: 32 }}>
            The course you're looking for doesn't exist.
          </p>
          <Link
            href="/courses"
            style={{
              display: "inline-block",
              padding: "12px 32px",
              background: "linear-gradient(135deg,#C9A84C,#8B6914)",
              color: "#050505",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 700,
              fontFamily: "var(--font-roboto-mono)",
            }}
          >
            Back to courses
          </Link>
        </div>
      </main>
    );
  }

  const discount = course.discount ? Math.round(course.discount) : 0;
  const discountedPrice = calculateDiscountedPrice(course.price, discount);
  const duration = getTotalCourseDuration(course.duration);
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <motion.main initial="initial" animate="animate" style={{ background: "#050505", color: "#F5F0E8", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <motion.div variants={pageTransition}
        style={{
          padding: "20px 28px",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
          background: "#0A0A0A",
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <Link
            href="/courses"
            style={{
              color: "rgba(201,168,76,0.8)",
              textDecoration: "none",
              fontSize: 12,
              fontFamily: "var(--font-roboto-mono)",
              letterSpacing: "0.1em",
            }}
          >
            ← Back to courses
          </Link>
        </div>
      </motion.div>

      {/* Hero */}
      <motion.section variants={pageTransition}
        style={{
          padding: "60px 28px",
          background: "linear-gradient(135deg,rgba(201,168,76,0.08),rgba(139,105,20,0.04))",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 60,
              alignItems: "start",
            }}
          >
            {/* Left: Content */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(201,168,76,0.08)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  padding: "6px 18px",
                  borderRadius: 100,
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-roboto-mono)",
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(201,168,76,0.8)",
                  }}
                >
                  {course.level.toUpperCase()}
                </span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(2rem,5vw,48px)",
                  fontWeight: 800,
                  fontFamily: "var(--font-exo2)",
                  lineHeight: 1.15,
                  marginBottom: 20,
                  letterSpacing: "-0.02em",
                }}
              >
                {course.title}
              </h1>

              <p
                style={{
                  fontSize: 16,
                  color: "rgba(245,240,232,0.7)",
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}
              >
                {course.longDescription}
              </p>

              {/* Stats */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 24,
                  fontSize: 14,
                  marginBottom: 24,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "#C9A84C" }}>⭐ {course.rating}</div>
                  <div style={{ fontSize: 12, color: "rgba(245,240,232,0.5)" }}>
                    {course.reviewCount} reviews
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#C9A84C" }}>
                    {course.studentCount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(245,240,232,0.5)" }}>
                    Students enrolled
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#C9A84C" }}>
                    {duration.hours}h {duration.mins}m
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(245,240,232,0.5)" }}>
                    Total duration
                  </div>
                </div>
              </div>

              {/* Instructor */}
              <div
                style={{
                  padding: "20px",
                  background: "rgba(201,168,76,0.05)",
                  border: "1px solid rgba(201,168,76,0.1)",
                  borderRadius: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#C9A84C,#8B6914)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#050505",
                    }}
                  >
                    {course.instructor.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      {course.instructor.name}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(245,240,232,0.5)" }}>
                      {course.instructor.title}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "rgba(245,240,232,0.6)", lineHeight: 1.5 }}>
                  {course.instructor.bio}
                </p>
              </div>
            </div>

            {/* Right: Sticky Card */}
            <div
              style={{
                position: "sticky",
                top: 20,
              }}
            >
              <div
                style={{
                  background: "#0A0A0A",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: 12,
                  padding: "32px",
                  textAlign: "center",
                }}
              >
                {/* Price */}
                <div style={{ marginBottom: 32 }}>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 700,
                      fontFamily: "var(--font-roboto-mono)",
                      marginBottom: 8,
                    }}
                  >
                    {formatPrice(discountedPrice)}
                  </div>
                  {discount > 0 && (
                    <div
                      style={{
                        fontSize: 14,
                        color: "rgba(245,240,232,0.4)",
                        textDecoration: "line-through",
                      }}
                    >
                      {formatPrice(course.price)}
                    </div>
                  )}
                  {discount > 0 && (
                    <div
                      style={{
                        marginTop: 8,
                        display: "inline-block",
                        background: "#EF4444",
                        color: "#FFF",
                        padding: "4px 12px",
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Save {discount}% now
                    </div>
                  )}
                </div>

                {/* Enroll Button */}
                <button
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "linear-gradient(135deg,#C9A84C,#8B6914)",
                    color: "#050505",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 14,
                    fontFamily: "var(--font-roboto-mono)",
                    cursor: "pointer",
                    marginBottom: 16,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 8px 32px rgba(201,168,76,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  Enroll Now
                </button>

                <button
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "transparent",
                    color: "#C9A84C",
                    border: "1px solid rgba(201,168,76,0.3)",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 13,
                    fontFamily: "var(--font-roboto-mono)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    marginBottom: 24,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(201,168,76,0.6)";
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(201,168,76,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(201,168,76,0.3)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  Share Course
                </button>

                {/* Divider */}
                <div
                  style={{
                    height: 1,
                    background: "rgba(201,168,76,0.1)",
                    marginBottom: 24,
                  }}
                />

                {/* What's Included */}
                <div style={{ textAlign: "left" }}>
                  <h4
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "var(--font-exo2)",
                      textTransform: "uppercase",
                      marginBottom: 12,
                      color: "#C9A84C",
                    }}
                  >
                    This course includes
                  </h4>

                  <div style={{ fontSize: 13, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ color: "rgba(245,240,232,0.7)" }}>
                      📹 {course.includes.videos} hours of video
                    </div>
                    <div style={{ color: "rgba(245,240,232,0.7)" }}>
                      🏗️ {course.includes.projects} hands-on projects
                    </div>
                    <div style={{ color: "rgba(245,240,232,0.7)" }}>
                      🎓 Completion certificate
                    </div>
                    <div style={{ color: "rgba(245,240,232,0.7)" }}>
                      ♾️ Lifetime access
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* What You'll Learn */}
      <motion.section variants={scrollReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} style={{ padding: "80px 28px", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              fontFamily: "var(--font-exo2)",
              marginBottom: 40,
            }}
          >
            What you'll learn
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {course.whatYouLearn.map((item, idx) => (
              <div key={idx} style={{ display: "flex", gap: 16 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    background: "rgba(201,168,76,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#C9A84C",
                  }}
                >
                  ✓
                </div>
                <p style={{ fontSize: 14, color: "rgba(245,240,232,0.7)", lineHeight: 1.6 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Curriculum */}
      <motion.section variants={scrollReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} style={{ padding: "80px 28px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              fontFamily: "var(--font-exo2)",
              marginBottom: 40,
            }}
          >
            Course curriculum
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {course.modules.map((module, idx) => (
              <div key={module.id}>
                <div
                  style={{
                    padding: "20px",
                    background: "rgba(201,168,76,0.05)",
                    border: "1px solid rgba(201,168,76,0.1)",
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={(e) => {
                    const details = (e.currentTarget.nextElementSibling as HTMLElement | null);
                    if (details) {
                      details.style.display =
                        details.style.display === "none" ? "block" : "none";
                    }
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      Module {idx + 1}: {module.title}
                    </h4>
                    <p
                      style={{
                        fontSize: 12,
                        color: "rgba(245,240,232,0.5)",
                      }}
                    >
                      {module.lessons.length} lessons
                    </p>
                  </div>
                  <span style={{ fontSize: 16 }}>▼</span>
                </div>

                <div
                  style={{
                    display: "none",
                    background: "#0A0A0A",
                    borderLeft: "2px solid rgba(201,168,76,0.2)",
                    paddingLeft: 0,
                  }}
                >
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      style={{
                        padding: "12px 20px",
                        borderBottom: "1px solid rgba(201,168,76,0.05)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 13,
                      }}
                    >
                      <span>
                        ▶ {lesson.title}
                      </span>
                      <span style={{ color: "rgba(245,240,232,0.4)" }}>
                        {formatDuration(lesson.duration)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              marginTop: 24,
              fontSize: 13,
              color: "rgba(245,240,232,0.5)",
              textAlign: "center",
            }}
          >
            Total: {totalLessons} lessons • {duration.hours}h {duration.mins}m
          </p>
        </div>
      </motion.section>
    </motion.main>
  );
}
