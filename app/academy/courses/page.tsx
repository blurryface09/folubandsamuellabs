"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CourseCard } from "@/components/academy/course-card";
import { mockCourses } from "@/lib/academy/mock-data";
import { pageTransition, staggerContainer } from "@/lib/motion/animations";

const categories = ["All", "Development", "Cybersecurity", "AI & Data Science", "AI Tools"];

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    return mockCourses.filter((course) => {
      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <motion.main initial="initial" animate="animate" style={{ background: "#050505", color: "#F5F0E8", minHeight: "100vh" }}>
      <motion.section variants={pageTransition} style={{ padding: "132px 28px 60px", maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
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
              Academy
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem,5vw,56px)",
              fontWeight: 800,
              fontFamily: "var(--font-exo2)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Explore Our{" "}
            <span
              style={{
                background: "linear-gradient(90deg,#F0C040,#C9A84C,#8B6914)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Courses
            </span>
          </h1>

          <p
            style={{
              fontSize: 16,
              color: "rgba(245,240,232,0.6)",
              lineHeight: 1.6,
              maxWidth: 600,
            }}
          >
            Practical, self-paced tracks with live content and hands-on examples. Pick a
            track and start whenever you are ready.
          </p>
        </div>

        <div>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 20px",
              background: "#0A0A0A",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 8,
              color: "#F5F0E8",
              fontSize: 14,
              fontFamily: "var(--font-roboto-mono)",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(201,168,76,0.5)";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(201,168,76,0.2)";
            }}
          />
        </div>
      </motion.section>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 28px 80px",
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 40,
        }}
      >
        <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <h3
              style={{
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "var(--font-exo2)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 16,
                color: "#F5F0E8",
              }}
            >
              Filter by Category
            </h3>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 0",
                  background: "none",
                  border: "none",
                  color:
                    selectedCategory === cat
                      ? "#C9A84C"
                      : "rgba(245,240,232,0.6)",
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                  borderBottom: "1px solid rgba(201,168,76,0.08)",
                  fontFamily: "var(--font-roboto-mono)",
                  fontWeight: selectedCategory === cat ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== cat) {
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(201,168,76,0.8)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== cat) {
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(245,240,232,0.6)";
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, idx) => (
              <CourseCard key={course.id} course={course} index={idx} />
            ))
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "60px 20px",
                color: "rgba(245,240,232,0.5)",
              }}
            >
              <p style={{ fontSize: 16, marginBottom: 10 }}>No courses found in this category.</p>
              <p style={{ fontSize: 14 }}>Try selecting a different category or search term.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.main>
  );
}
