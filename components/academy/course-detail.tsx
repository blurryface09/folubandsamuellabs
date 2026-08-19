"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { pageTransition, fadeInUp } from "@/lib/motion/animations";
import type { Course } from "@/lib/academy/types";

interface CourseDetailProps {
  course: Course;
}

export default function CourseDetail({ course }: CourseDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrollError, setEnrollError] = useState("");
  const [weeklyModules, setWeeklyModules] = useState<{ id: string; title: string }[]>([]);

  const paymentStatus = searchParams.get("payment");

  useEffect(() => {
    if (!isEnrolled) return;
    fetch(`/api/courses/${course.id}/content`)
      .then((res) => (res.ok ? res.json() : { modules: [] }))
      .then((data: { modules: { id: string; title: string }[] }) => setWeeklyModules(data.modules || []))
      .catch(() => {});
  }, [isEnrolled, course.id]);

  // Check enrollment status
  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const res = await fetch("/api/enrollments");
        if (res.ok) {
          const data = await res.json();
          const enrolled = data.enrollments.some(
            (e: any) => e.courseId === course.id && e.paymentStatus === "COMPLETED"
          );
          setIsEnrolled(enrolled);
        }
      } catch (error) {
        console.error("Failed to check enrollment:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      checkEnrollment();
    } else {
      setLoading(false);
    }
  }, [session, course.id]);

  const handleEnroll = async () => {
    if (!session?.user) {
      router.push("/academy/login");
      return;
    }

    setIsEnrolling(true);
    setEnrollError("");
    try {
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });

      if (res.status === 401) {
        router.push("/academy/login");
        return;
      }

      if (res.ok) {
        const { authorizationUrl } = await res.json();
        window.location.href = authorizationUrl;
        return;
      }

      const error = await res.json();
      setEnrollError(error.error || "Failed to start payment. Please try again.");
    } catch (error) {
      setEnrollError("Failed to start payment. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  const totalLessons = course.modules.reduce(
    (acc, mod) => acc + mod.lessons.length,
    0
  );

  return (
    <motion.main
      initial="initial"
      animate="animate"
      style={{ background: "#050505", color: "#F5F0E8", minHeight: "100vh" }}
    >
      {/* Hero Section */}
      <motion.section
        variants={pageTransition}
        style={{
          padding: "132px 28px 60px",
          background: "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(139,105,20,0.04) 100%)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
            <span style={{ color: "#C9A84C" }}>{course.title}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 60, alignItems: "start" }}>
            <div>
              <h1
                style={{
                  fontSize: "clamp(2rem, 5vw, 56px)",
                  fontWeight: 800,
                  fontFamily: "var(--font-exo2)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  marginBottom: 20,
                }}
              >
                {course.title}
              </h1>

              <p
                style={{
                  fontSize: 18,
                  color: "rgba(245,240,232,0.7)",
                  lineHeight: 1.6,
                  marginBottom: 32,
                }}
              >
                {course.description}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 32,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontSize: 12, color: "rgba(201,168,76,0.6)", textTransform: "uppercase", marginBottom: 4 }}>
                    Track
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{course.category}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "rgba(201,168,76,0.6)", textTransform: "uppercase", marginBottom: 4 }}>
                    Modules
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{course.modules.length}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "rgba(201,168,76,0.6)", textTransform: "uppercase", marginBottom: 4 }}>
                    Lessons
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{totalLessons}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "rgba(201,168,76,0.6)", textTransform: "uppercase", marginBottom: 4 }}>
                    Pace
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Self-paced</div>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <motion.div
              variants={fadeInUp}
              style={{
                background: "#0A0A0A",
                border: "1px solid rgba(201,168,76,0.1)",
                borderRadius: 12,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>₦{course.price.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: "rgba(245,240,232,0.5)" }}>One-time payment</div>
              </div>

              {paymentStatus === "failed" && (
                <div style={{ fontSize: 13, color: "#F87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, padding: "10px 14px" }}>
                  Payment didn&apos;t go through. Please try again.
                </div>
              )}
              {paymentStatus === "error" && (
                <div style={{ fontSize: 13, color: "#F87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, padding: "10px 14px" }}>
                  Something went wrong verifying your payment. If you were charged, contact us.
                </div>
              )}
              {enrollError && (
                <div style={{ fontSize: 13, color: "#F87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, padding: "10px 14px" }}>
                  {enrollError}
                </div>
              )}

              {!isEnrolled ? (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  style={{
                    padding: "14px 24px",
                    background: "linear-gradient(135deg, #C9A84C, #F0C040)",
                    color: "#050505",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: isEnrolling ? "not-allowed" : "pointer",
                    opacity: isEnrolling ? 0.6 : 1,
                  }}
                >
                  {isEnrolling ? "Redirecting to payment..." : "Enroll Now"}
                </button>
              ) : (
                <Link
                  href={`/academy/courses/${course.slug}`}
                  style={{
                    padding: "14px 24px",
                    background: "rgba(201,168,76,0.1)",
                    color: "#C9A84C",
                    border: "1px solid rgba(201,168,76,0.3)",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  Enrolled
                </Link>
              )}

              <div style={{ paddingTop: 20, borderTop: "1px solid rgba(201,168,76,0.1)" }}>
                <div style={{ fontSize: 12, color: "rgba(201,168,76,0.6)", textTransform: "uppercase", marginBottom: 16 }}>
                  What's included
                </div>
                <ul
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <li style={{ fontSize: 13, color: "rgba(245,240,232,0.8)" }}>✓ {totalLessons} lessons</li>
                  <li style={{ fontSize: 13, color: "rgba(245,240,232,0.8)" }}>✓ {course.modules.length} modules</li>
                  <li style={{ fontSize: 13, color: "rgba(245,240,232,0.8)" }}>✓ Lifetime access</li>
                  <li style={{ fontSize: 13, color: "rgba(245,240,232,0.8)" }}>✓ Certificate</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Course Content Section */}
      {isEnrolled && (
        <motion.section
          variants={pageTransition}
          style={{
            padding: "80px 28px 100px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: 36,
              fontWeight: 800,
              fontFamily: "var(--font-exo2)",
              marginBottom: 24,
            }}
          >
            Course Content
          </h2>
          {weeklyModules.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {weeklyModules.map((m) => (
                <Link
                  key={m.id}
                  href={`/academy/courses/${course.slug}/weeks/${m.id}`}
                  style={{
                    display: "block",
                    padding: "18px 24px",
                    background: "#0A0A0A",
                    border: "1px solid rgba(201,168,76,0.15)",
                    borderRadius: 10,
                    color: "#F5F0E8",
                    textDecoration: "none",
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  {m.title} →
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ color: "rgba(245,240,232,0.5)", fontSize: 14 }}>
              The first week of content hasn&apos;t been published yet. Check back soon.
            </p>
          )}
        </motion.section>
      )}
    </motion.main>
  );
}
