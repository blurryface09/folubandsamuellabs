"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { pageTransition, fadeInUp } from "@/lib/motion/animations";

interface EnrolledCourse {
  id: string;
  courseId: string;
  status: string;
  enrolledAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
    description: string;
    modules: { lessons: { id: string }[] }[];
  };
  progress: { lessonId: string }[];
}

function computeProgress(enrollment: EnrolledCourse) {
  const totalLessons = enrollment.course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completed = enrollment.progress.length;
  if (totalLessons === 0) return 0;
  return Math.round((completed / totalLessons) * 100);
}

export default function DashboardPage() {
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await fetch("/api/enrollments");
        if (!res.ok) throw new Error("Failed to fetch enrollments");
        const data = await res.json();
        const paidEnrollments = (data.enrollments || []).filter(
          (e: EnrolledCourse & { paymentStatus: string }) => e.paymentStatus === "COMPLETED"
        );
        setEnrollments(paidEnrollments);
      } catch (err) {
        setError("Failed to load your courses");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  return (
    <motion.main
      initial="initial"
      animate="animate"
      style={{ background: "#050505", color: "#F5F0E8", minHeight: "100vh", padding: "132px 28px 60px" }}
    >
      <motion.div variants={pageTransition} style={{ maxWidth: 1320, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 60 }}>
          <div
            style={{
              fontSize: 12,
              fontFamily: "var(--font-roboto-mono)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(201,168,76,0.8)",
              marginBottom: 16,
            }}
          >
            My Learning
          </div>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              fontFamily: "var(--font-exo2)",
              marginBottom: 20,
              lineHeight: 1.2,
            }}
          >
            My Courses
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "rgba(245,240,232,0.6)",
              maxWidth: 600,
            }}
          >
            {enrollments.length === 0
              ? "Start your learning journey by enrolling in a course."
              : `You're enrolled in ${enrollments.length} course${enrollments.length !== 1 ? "s" : ""}.`}
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: 20,
              background: "#EF4444",
              color: "#FFF",
              borderRadius: 8,
              marginBottom: 32,
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "rgba(245,240,232,0.5)",
            }}
          >
            Loading your courses...
          </div>
        ) : enrollments.length === 0 ? (
          <motion.div variants={fadeInUp} style={{ textAlign: "center", padding: "60px 20px" }}>
            <div
              style={{
                fontSize: 16,
                color: "rgba(245,240,232,0.6)",
                marginBottom: 32,
              }}
            >
              You haven't enrolled in any courses yet.
            </div>
            <Link
              href="/academy/courses"
              style={{
                display: "inline-block",
                padding: "12px 32px",
                background: "linear-gradient(135deg, #C9A84C, #F0C040)",
                color: "#050505",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 700,
                fontFamily: "var(--font-roboto-mono)",
              }}
            >
              Browse Courses
            </Link>
          </motion.div>
        ) : (
          <motion.div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {enrollments.map((enrollment, index) => {
              const percent = computeProgress(enrollment);
              return (
              <motion.div
                key={enrollment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                style={{
                  background: "#0A0A0A",
                  border: "1px solid rgba(201,168,76,0.1)",
                  borderRadius: 12,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(201,168,76,0.2)" }}
              >
                <Link
                  href={`/academy/courses/${enrollment.course.slug}`}
                  style={{ textDecoration: "none", color: "inherit", flex: 1 }}
                >
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#F5F0E8",
                      fontFamily: "var(--font-exo2)",
                      marginBottom: 12,
                      lineHeight: 1.3,
                    }}
                  >
                    {enrollment.course.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "rgba(245,240,232,0.5)",
                      lineHeight: 1.5,
                    }}
                  >
                    {enrollment.course.description}
                  </p>
                </Link>

                {/* Progress Bar */}
                <div style={{ marginTop: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                      fontSize: 12,
                      color: "rgba(245,240,232,0.6)",
                    }}
                  >
                    <span>Progress</span>
                    <span>{percent}%</span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 6,
                      background: "rgba(201,168,76,0.1)",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${percent}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #C9A84C, #F0C040)",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/academy/courses/${enrollment.course.slug}`}
                  style={{
                    display: "inline-block",
                    padding: "10px 16px",
                    background: "rgba(201,168,76,0.1)",
                    color: "#C9A84C",
                    borderRadius: 6,
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: 12,
                    fontFamily: "var(--font-roboto-mono)",
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  Continue Learning
                </Link>
              </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Browse More */}
        {enrollments.length > 0 && (
          <motion.div
            variants={fadeInUp}
            style={{
              marginTop: 60,
              padding: "40px",
              background: "rgba(201,168,76,0.05)",
              border: "1px solid rgba(201,168,76,0.1)",
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: "var(--font-exo2)",
                marginBottom: 16,
              }}
            >
              Want to learn more?
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "rgba(245,240,232,0.6)",
                marginBottom: 24,
              }}
            >
              Explore our full catalog of courses
            </p>
            <Link
              href="/academy/courses"
              style={{
                display: "inline-block",
                padding: "12px 32px",
                background: "linear-gradient(135deg, #C9A84C, #F0C040)",
                color: "#050505",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 700,
                fontFamily: "var(--font-roboto-mono)",
              }}
            >
              Browse All Courses
            </Link>
          </motion.div>
        )}
      </motion.div>
    </motion.main>
  );
}
