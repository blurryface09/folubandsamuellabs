"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { mockCourses } from "@/lib/academy/mock-data";
import { pageTransition } from "@/lib/motion/animations";
import HelpRequestButton from "@/components/academy/help-request-button";

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  durationMins: number | null;
}

interface Assignment {
  id: string;
  title: string;
  type: "ASSIGNMENT" | "CLASSWORK";
  instructions: string;
  dueDate: string | null;
  maxScore: number;
}

interface ExamOption {
  id: string;
  text: string;
}

interface ExamQuestion {
  id: string;
  question: string;
  options: ExamOption[];
}

interface Exam {
  id: string;
  title: string;
  instructions: string | null;
  passingScore: number;
  questions: ExamQuestion[];
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  assignments: Assignment[];
  exams: Exam[];
}

export default function WeekPage({ params }: { params: Promise<{ slug: string; moduleId: string }> }) {
  const { slug, moduleId } = use(params);
  const router = useRouter();
  const { status } = useSession();
  const course = mockCourses.find((c) => c.slug === slug);

  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/academy/login");
      return;
    }
    if (!course) return;

    fetch(`/api/courses/${course.id}/content`)
      .then((res) => {
        if (res.status === 403) throw new Error("not-enrolled");
        return res.ok ? res.json() : Promise.reject(res);
      })
      .then((data: { modules: Module[] }) => {
        const found = data.modules.find((m) => m.id === moduleId);
        if (!found) {
          setError("This week isn't available.");
        } else {
          setModule(found);
        }
      })
      .catch((err) => {
        if (err?.message === "not-enrolled") {
          router.push(`/academy/courses/${slug}`);
        } else {
          setError("Failed to load this week's content.");
        }
      })
      .finally(() => setLoading(false));
  }, [status, course, moduleId, router, slug]);

  if (loading) {
    return (
      <div style={{ background: "#050505", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(245,240,232,0.5)" }}>Loading...</p>
      </div>
    );
  }

  if (error || !module || !course) {
    return (
      <div style={{ background: "#050505", color: "#F5F0E8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>{error || "Week not found"}</h1>
          <Link href={`/academy/courses/${slug}`} style={{ color: "#C9A84C" }}>← Back to course</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.main initial="initial" animate="animate" style={{ background: "#050505", color: "#F5F0E8", minHeight: "100vh" }}>
      <motion.div variants={pageTransition} style={{ maxWidth: 900, margin: "0 auto", padding: "132px 28px 80px" }}>
        <div style={{ marginBottom: 40 }}>
          <Link href={`/academy/courses/${slug}`} style={{ color: "#C9A84C", textDecoration: "none", fontSize: 13 }}>
            ← Back to {course.title}
          </Link>
          <h1 style={{ fontSize: 36, fontWeight: 800, fontFamily: "var(--font-exo2)", marginTop: 16 }}>{module.title}</h1>
        </div>

        {module.lessons.length > 0 && (
          <Section title="Lessons">
            {module.lessons.map((l) => (
              <div key={l.id} style={{ background: "#0A0A0A", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 12, padding: 24, marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{l.title}</h3>
                {l.videoUrl && (
                  <div style={{ marginBottom: 16, borderRadius: 8, overflow: "hidden" }}>
                    <iframe width="100%" height={360} src={l.videoUrl} title={l.title} allowFullScreen style={{ display: "block" }} />
                  </div>
                )}
                {l.content && (
                  <div style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(245,240,232,0.8)" }} dangerouslySetInnerHTML={{ __html: l.content }} />
                )}
              </div>
            ))}
          </Section>
        )}

        {module.assignments.length > 0 && (
          <Section title="Assessments & Classwork">
            {module.assignments.map((a) => (
              <AssignmentCard key={a.id} assignment={a} />
            ))}
          </Section>
        )}

        {module.exams.length > 0 && (
          <Section title="Exams">
            {module.exams.map((ex) => (
              <ExamCard key={ex.id} exam={ex} />
            ))}
          </Section>
        )}

        {module.lessons.length === 0 && module.assignments.length === 0 && module.exams.length === 0 && (
          <p style={{ color: "rgba(245,240,232,0.5)" }}>Nothing here yet.</p>
        )}
      </motion.div>
      <HelpRequestButton courseId={course.id} moduleId={module.id} />
    </motion.main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const [submission, setSubmission] = useState<{ content: string; score: number | null; feedback: string | null; submittedAt: string } | null>(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/assignments/${assignment.id}/submissions`)
      .then((res) => (res.ok ? res.json() : { submission: null }))
      .then((data) => {
        setSubmission(data.submission);
        if (data.submission) setContent(data.submission.content || "");
      })
      .finally(() => setLoaded(true));
  }, [assignment.id]);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/assignments/${assignment.id}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json();
        setSubmission(data.submission);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "#0A0A0A", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 12, padding: 24, marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 10px", borderRadius: 100, background: "rgba(201,168,76,0.1)", color: "#C9A84C" }}>
          {assignment.type === "ASSIGNMENT" ? "ASSESSMENT" : assignment.type}
        </span>
        {assignment.dueDate && (
          <span style={{ fontSize: 11, color: "rgba(245,240,232,0.4)" }}>
            Due {new Date(assignment.dueDate).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
          </span>
        )}
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{assignment.title}</h3>
      <div
        style={{ fontSize: 13, color: "rgba(245,240,232,0.6)", lineHeight: 1.6, marginBottom: 16 }}
        dangerouslySetInnerHTML={{ __html: assignment.instructions }}
      />

      {!loaded ? null : submission?.score !== null && submission?.score !== undefined ? (
        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#10B981", marginBottom: 6 }}>
            Graded: {submission.score}/{assignment.maxScore}
          </div>
          {submission.feedback && <p style={{ fontSize: 13, color: "rgba(245,240,232,0.7)" }}>{submission.feedback}</p>}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your submission here..."
            rows={5}
            style={{ width: "100%", padding: "10px 14px", background: "#050505", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, color: "#F5F0E8", fontSize: 13, fontFamily: "inherit", resize: "vertical" }}
          />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ alignSelf: "flex-start", padding: "10px 24px", background: "linear-gradient(135deg, #C9A84C, #F0C040)", color: "#050505", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: submitting ? "not-allowed" : "pointer" }}
          >
            {submission ? (submitting ? "Resubmitting..." : "Resubmit") : submitting ? "Submitting..." : "Submit"}
          </button>
          {submission && <div style={{ fontSize: 12, color: "rgba(245,240,232,0.4)" }}>Submitted, awaiting grading.</div>}
        </div>
      )}
    </div>
  );
}

function ExamCard({ exam }: { exam: Exam }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean; totalQuestions: number; correctCount: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/exams/${exam.id}/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionId, selectedOptionId]) => ({ questionId, selectedOptionId })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data.attempt);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const allAnswered = exam.questions.every((q) => answers[q.id]);

  return (
    <div style={{ background: "#0A0A0A", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 12, padding: 24, marginBottom: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{exam.title}</h3>
      {exam.instructions && (
        <div
          style={{ fontSize: 13, color: "rgba(245,240,232,0.6)", marginBottom: 16 }}
          dangerouslySetInnerHTML={{ __html: exam.instructions }}
        />
      )}
      <p style={{ fontSize: 12, color: "rgba(245,240,232,0.4)", marginBottom: 16 }}>
        {exam.questions.length} questions &middot; {exam.passingScore}% to pass
      </p>

      {result ? (
        <div style={{ background: result.passed ? "rgba(16,185,129,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${result.passed ? "rgba(16,185,129,0.25)" : "rgba(248,113,113,0.25)"}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: result.passed ? "#10B981" : "#F87171", marginBottom: 4 }}>
            {result.score}% — {result.passed ? "Passed" : "Not passed"}
          </div>
          <div style={{ fontSize: 13, color: "rgba(245,240,232,0.6)" }}>{result.correctCount} of {result.totalQuestions} correct</div>
        </div>
      ) : !started ? (
        <button
          onClick={() => setStarted(true)}
          style={{ padding: "10px 24px", background: "rgba(201,168,76,0.1)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}
        >
          Take Exam
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {exam.questions.map((q, idx) => (
            <div key={q.id}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{idx + 1}. {q.question}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 16 }}>
                {q.options.map((o) => (
                  <label key={o.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(245,240,232,0.8)", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === o.id}
                      onChange={() => handleSelect(q.id, o.id)}
                    />
                    {o.text}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            style={{ alignSelf: "flex-start", padding: "10px 24px", background: "linear-gradient(135deg, #C9A84C, #F0C040)", color: "#050505", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: !allAnswered || submitting ? "not-allowed" : "pointer", opacity: !allAnswered || submitting ? 0.6 : 1 }}
          >
            {submitting ? "Submitting..." : "Submit Exam"}
          </button>
        </div>
      )}
    </div>
  );
}
