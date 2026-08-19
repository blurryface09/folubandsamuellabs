"use client";

import { useEffect, useState } from "react";

interface Submission {
  id: string;
  content: string | null;
  submittedAt: string;
  score: number | null;
  feedback: string | null;
  user: { name: string | null; email: string };
  assignment: {
    title: string;
    type: "ASSIGNMENT" | "CLASSWORK";
    maxScore: number;
    module: { title: string; course: { title: string } };
  };
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ungraded" | "all">("ungraded");

  const load = () => {
    fetch("/api/admin/submissions")
      .then((res) => (res.ok ? res.json() : { submissions: [] }))
      .then((data) => setSubmissions(data.submissions || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const visible = filter === "ungraded" ? submissions.filter((s) => s.score === null) : submissions;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800 }}>Submissions</h1>
        <div style={{ display: "flex", gap: 8 }}>
          {(["ungraded", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 14px",
                background: filter === f ? "rgba(201,168,76,0.15)" : "transparent",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: 6,
                color: "#C9A84C",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: "rgba(245,240,232,0.5)" }}>Loading...</p>
      ) : visible.length === 0 ? (
        <p style={{ color: "rgba(245,240,232,0.5)" }}>
          {filter === "ungraded" ? "Nothing to grade." : "No submissions yet."}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {visible.map((s) => (
            <SubmissionRow key={s.id} submission={s} onGraded={load} />
          ))}
        </div>
      )}
    </div>
  );
}

function SubmissionRow({ submission, onGraded }: { submission: Submission; onGraded: () => void }) {
  const [score, setScore] = useState(submission.score?.toString() || "");
  const [feedback, setFeedback] = useState(submission.feedback || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleGrade = async () => {
    const numScore = Number(score);
    if (Number.isNaN(numScore) || numScore < 0) {
      setError("Enter a valid score.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/submissions/${submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: numScore, feedback }),
      });
      if (res.ok) {
        onGraded();
      } else {
        setError("Failed to save grade.");
      }
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: "8px 12px",
    background: "#050505",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: 6,
    color: "#F5F0E8",
    fontSize: 13,
    fontFamily: "inherit",
  };

  return (
    <div style={{ background: "#0A0A0A", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 12, padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{submission.assignment.title}</div>
          <div style={{ fontSize: 12, color: "rgba(245,240,232,0.4)" }}>
            {submission.assignment.module.course.title} &middot; {submission.assignment.module.title} &middot; {submission.assignment.type === "ASSIGNMENT" ? "ASSESSMENT" : submission.assignment.type}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{submission.user.name || submission.user.email}</div>
          <div style={{ fontSize: 11, color: "rgba(245,240,232,0.4)" }}>
            {new Date(submission.submittedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>
      </div>

      <div style={{ background: "#050505", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 8, padding: 16, marginBottom: 16, fontSize: 13, color: "rgba(245,240,232,0.8)", whiteSpace: "pre-wrap" }}>
        {submission.content}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
        <input
          type="number"
          placeholder={`Score (/${submission.assignment.maxScore})`}
          value={score}
          onChange={(e) => setScore(e.target.value)}
          style={{ ...inputStyle, width: 140 }}
        />
        <input
          placeholder="Feedback (optional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          style={{ ...inputStyle, flex: 1, minWidth: 200 }}
        />
        <button
          onClick={handleGrade}
          disabled={saving}
          style={{
            padding: "8px 20px",
            background: "linear-gradient(135deg, #C9A84C, #F0C040)",
            color: "#050505",
            border: "none",
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 12,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving..." : submission.score !== null ? "Update Grade" : "Grade"}
        </button>
      </div>
      {error && <div style={{ color: "#F87171", fontSize: 12, marginTop: 8 }}>{error}</div>}
    </div>
  );
}
