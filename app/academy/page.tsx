"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { pageTransition, fadeInUp, staggerContainer } from "@/lib/motion/animations";

export default function AcademyPage() {
  const { data: session } = useSession();

  return (
    <motion.main initial="initial" animate="animate" style={{ background: "#050505", color: "#F5F0E8", minHeight: "100vh" }}>
      {/* Hero Section */}
      <motion.section
        variants={pageTransition}
        style={{
          padding: "120px 28px 80px",
          background: "linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(139,105,20,0.06) 100%)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.2)",
              padding: "8px 20px",
              borderRadius: 100,
              marginBottom: 32,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-roboto-mono)",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(201,168,76,0.8)",
              }}
            >
              Professional Education
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(3rem,7vw,72px)",
              fontWeight: 800,
              fontFamily: "var(--font-exo2)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 24,
            }}
          >
            Master Software. Secure Systems. <span
              style={{
                background: "linear-gradient(90deg,#F0C040,#C9A84C,#8B6914)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Build Your Career.
            </span>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "rgba(245,240,232,0.7)",
              lineHeight: 1.7,
              marginBottom: 40,
              maxWidth: 700,
              margin: "0 auto 40px",
            }}
          >
            Industry-standard curriculum from the team behind FSLabs. Learn full-stack development, cybersecurity, and digital solutions. Build real projects. Get job-ready. Self-paced, serious education for serious learners.
          </p>

          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {session?.user ? (
              <>
                <Link
                  href="/academy/courses"
                  style={{
                    padding: "16px 40px",
                    background: "linear-gradient(135deg, #C9A84C, #F0C040)",
                    color: "#050505",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: 16,
                    fontFamily: "var(--font-exo2)",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(201,168,76,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  Explore Courses
                </Link>
                <Link
                  href="/academy/dashboard"
                  style={{
                    padding: "16px 40px",
                    background: "transparent",
                    color: "#C9A84C",
                    border: "1px solid rgba(201,168,76,0.3)",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: 16,
                    fontFamily: "var(--font-exo2)",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  My Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/academy/login"
                  style={{
                    padding: "16px 40px",
                    background: "linear-gradient(135deg, #C9A84C, #F0C040)",
                    color: "#050505",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: 16,
                    fontFamily: "var(--font-exo2)",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(201,168,76,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/academy/register"
                  style={{
                    padding: "16px 40px",
                    background: "transparent",
                    color: "#C9A84C",
                    border: "1px solid rgba(201,168,76,0.3)",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: 16,
                    fontFamily: "var(--font-exo2)",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={pageTransition}
        style={{
          padding: "80px 28px 60px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: 48,
            fontWeight: 800,
            fontFamily: "var(--font-exo2)",
            marginBottom: 60,
            textAlign: "center",
          }}
        >
          Built for Serious Learners
        </h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 32,
          }}
        >
          {[
            {
              num: "01",
              title: "Live Content & Practical Examples",
              description: "Curriculum stays current with industry tools and practices. Every module includes hands-on examples applicable to real-world scenarios.",
            },
            {
              num: "02",
              title: "Efficient, Focused Curriculum",
              description: "Direct instruction on essential concepts. No unnecessary length or theoretical excess—just what you need to master each skill.",
            },
            {
              num: "03",
              title: "Community-Driven Learning",
              description: "Learn alongside practitioners. Share projects, collaborate on problems, and grow through peer interaction and feedback.",
            },
            {
              num: "04",
              title: "Learn on Your Timeline",
              description: "Self-paced structure that fits your schedule. Study when you have time, progress at your own pace, no fixed deadlines.",
            },
            {
              num: "05",
              title: "Designed for Clarity",
              description: "Intuitive interface and clear navigation. Learning platform that supports focus and removes friction from the process.",
            },
            {
              num: "06",
              title: "Build Lasting Knowledge & Skills",
              description: "Foundation-focused instruction that develops deep understanding and practical competence. Knowledge you can apply and build upon.",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              style={{
                background: "#0A0A0A",
                border: "1px solid rgba(201,168,76,0.1)",
                borderRadius: 12,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.3)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(201,168,76,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.1)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 800, color: "#C9A84C" }}>{feature.num}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>{feature.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(245,240,232,0.6)", lineHeight: 1.6 }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        variants={fadeInUp}
        style={{
          padding: "80px 28px 60px",
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 48,
            fontWeight: 800,
            fontFamily: "var(--font-exo2)",
            marginBottom: 24,
            lineHeight: 1.2,
          }}
        >
          Stop Wasting Time on Generic Courses
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "rgba(245,240,232,0.6)",
            lineHeight: 1.7,
            marginBottom: 32,
          }}
        >
          {session?.user
            ? "You're logged in. Start building real skills with real projects designed by people who actually ship production code."
            : "Learn from engineers who build systems that matter. Curriculum backed by real industry experience, not just theory."}
        </p>
        <Link
          href={session?.user ? "/academy/courses" : "/academy/register"}
          style={{
            display: "inline-block",
            padding: "16px 40px",
            background: "linear-gradient(135deg, #C9A84C, #F0C040)",
            color: "#050505",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 16,
            fontFamily: "var(--font-exo2)",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(201,168,76,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          {session?.user ? "Browse Courses" : "Get Started Free"}
        </Link>
      </motion.section>
    </motion.main>
  );
}
