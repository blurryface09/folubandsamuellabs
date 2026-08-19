"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CourseCard } from "@/components/academy/course-card";
import { mockCourses } from "@/lib/academy/mock-data";
import { pageTransition, staggerContainer } from "@/lib/motion/animations";

const categories = ["All", "Development", "Cybersecurity", "AI & Data Science", "AI Tools"];
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₦150K", min: 0, max: 150000 },
  { label: "₦150K - ₦200K", min: 150000, max: 200000 },
  { label: "Over ₦200K", min: 200000, max: Infinity },
];
const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Best Seller", value: "bestseller" },
  { label: "Best Rated", value: "rated" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedSort, setSelectedSort] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = mockCourses.filter((course) => {
      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;
      const matchesPrice =
        course.price >= priceRanges[selectedPrice].min &&
        course.price <= priceRanges[selectedPrice].max;
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesPrice && matchesSearch;
    });

    // Sort
    const sort = sortOptions.find((s) => s.value === selectedSort);
    if (sort) {
      switch (selectedSort) {
        case "bestseller":
          filtered.sort((a, b) => b.studentCount - a.studentCount);
          break;
        case "rated":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "price-asc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "newest":
        default:
          // Keep original order
          break;
      }
    }

    return filtered;
  }, [selectedCategory, selectedPrice, selectedSort, searchQuery]);

  return (
    <motion.main initial="initial" animate="animate" style={{ background: "#050505", color: "#F5F0E8", minHeight: "100vh", paddingTop: 80 }}>
      {/* Header */}
      <motion.section variants={pageTransition} style={{ padding: "40px 28px 60px", maxWidth: 1320, margin: "0 auto" }}>
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
            Learn from industry experts. Build real projects. Earn certificates.
          </p>
        </div>

        {/* Search */}
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

      {/* Main Content */}
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
        {/* Sidebar */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Category Filter */}
          <div>
            <h3
              style={{
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "var(--font-exo2)",
                textTransform: "uppercase",
                marginBottom: 12,
                color: "#F5F0E8",
              }}
            >
              Category
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
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "color 0.2s",
                  borderBottom: "1px solid rgba(201,168,76,0.1)",
                  fontFamily: "var(--font-roboto-mono)",
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

          {/* Price Filter */}
          <div>
            <h3
              style={{
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "var(--font-exo2)",
                textTransform: "uppercase",
                marginBottom: 12,
                color: "#F5F0E8",
              }}
            >
              Price
            </h3>
            {priceRanges.map((range, idx) => (
              <button
                key={range.label}
                onClick={() => setSelectedPrice(idx)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 0",
                  background: "none",
                  border: "none",
                  color:
                    selectedPrice === idx
                      ? "#C9A84C"
                      : "rgba(245,240,232,0.6)",
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "color 0.2s",
                  borderBottom: "1px solid rgba(201,168,76,0.1)",
                  fontFamily: "var(--font-roboto-mono)",
                }}
                onMouseEnter={(e) => {
                  if (selectedPrice !== idx) {
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(201,168,76,0.8)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedPrice !== idx) {
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(245,240,232,0.6)";
                  }
                }}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div>
            <h3
              style={{
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "var(--font-exo2)",
                textTransform: "uppercase",
                marginBottom: 12,
                color: "#F5F0E8",
              }}
            >
              Sort By
            </h3>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedSort(option.value)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 0",
                  background: "none",
                  border: "none",
                  color:
                    selectedSort === option.value
                      ? "#C9A84C"
                      : "rgba(245,240,232,0.6)",
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "color 0.2s",
                  borderBottom: "1px solid rgba(201,168,76,0.1)",
                  fontFamily: "var(--font-roboto-mono)",
                }}
                onMouseEnter={(e) => {
                  if (selectedSort !== option.value) {
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(201,168,76,0.8)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSort !== option.value) {
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(245,240,232,0.6)";
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Course Grid */}
        <div>
          {/* Results header */}
          <div
            style={{
              marginBottom: 32,
              paddingBottom: 16,
              borderBottom: "1px solid rgba(201,168,76,0.1)",
            }}
          >
            <p
              style={{
                fontSize: 14,
                color: "rgba(245,240,232,0.6)",
                fontFamily: "var(--font-roboto-mono)",
              }}
            >
              Showing <strong>{filteredAndSortedCourses.length}</strong> courses
            </p>
          </div>

          {filteredAndSortedCourses.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 24,
              }}
            >
              {filteredAndSortedCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "80px 40px",
                color: "rgba(245,240,232,0.4)",
              }}
            >
              <p style={{ fontSize: 18, marginBottom: 12 }}>No courses found</p>
              <p style={{ fontSize: 14 }}>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.main>
  );
}
