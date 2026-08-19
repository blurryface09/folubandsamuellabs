"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Course } from "@/lib/academy/types";
import { AcademyCard, ButtonPrimary } from "./index";
import { CourseArtwork } from "./course-artwork";

interface CourseCardProps {
  course: Course;
  index?: number;
  isEnrolled?: boolean;
}

export function CourseCard({ course, index = 0, isEnrolled = false }: CourseCardProps) {
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState("");

  const handleEnroll = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isEnrolled) return;

    setEnrolling(true);
    setEnrollError("");

    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/academy/login");
          return;
        }
        const data = await res.json();
        setEnrollError(data.error || "Failed to enroll");
        return;
      }

      // Success - redirect to dashboard
      window.location.href = "/academy/dashboard";
    } catch (error) {
      setEnrollError("Network error. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Link href={`/academy/courses/${course.slug}`} style={{ textDecoration: "none", flex: 1 }}>
        <AcademyCard index={index} style={{ overflow: "hidden", height: "100%" }}>
          {/* Course Header Artwork */}
          <div style={{ position: "relative", overflow: "hidden", height: 200 }}>
            <CourseArtwork slug={course.slug} />
            {/* bottom fade so the art meets the card body cleanly */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, transparent 55%, rgba(10,10,10,0.55) 100%)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Content */}
          <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Category */}
            <div
              style={{
                fontSize: 11,
                fontFamily: "var(--font-roboto-mono)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(201,168,76,0.6)",
                marginBottom: 8,
              }}
            >
              {course.category}
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#F5F0E8",
                marginBottom: 12,
                lineHeight: 1.3,
                fontFamily: "var(--font-exo2)",
              }}
            >
              {course.title}
            </h3>

            {/* Description */}
            <p
              style={{
                fontSize: 13,
                color: "rgba(245,240,232,0.5)",
                lineHeight: 1.5,
                marginBottom: 16,
                flex: 1,
              }}
            >
              {course.description}
            </p>


            {/* Price */}
            <div style={{ fontSize: 20, fontWeight: 700, color: "#C9A84C", fontFamily: "var(--font-roboto-mono)" }}>
              ₦{course.price.toLocaleString()}
            </div>
          </div>
        </AcademyCard>
      </Link>
      <ButtonPrimary
        onClick={handleEnroll}
        disabled={enrolling || isEnrolled}
        style={{
          padding: "10px 20px",
          fontSize: "11px",
          marginTop: "12px",
          width: "100%",
        }}
      >
        {isEnrolled ? "Enrolled" : enrolling ? "Enrolling..." : "Enroll"}
      </ButtonPrimary>
      {enrollError && (
        <div
          style={{
            fontSize: "11px",
            color: "#EF4444",
            marginTop: "8px",
            textAlign: "center",
          }}
        >
          {enrollError}
        </div>
      )}
    </div>
  );
}
