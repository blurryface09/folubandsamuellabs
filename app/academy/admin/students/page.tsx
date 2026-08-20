"use client";

import { useEffect, useState } from "react";

interface Student {
  id: string;
  name: string | null;
  email: string;
  studentId: string | null;
  createdAt: string;
  enrollments: { enrolledAt: string; course: { title: string } }[];
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/students")
      .then((res) => (res.ok ? res.json() : { students: [] }))
      .then((data) => setStudents(data.students || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      (s.name || "").toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.studentId || "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800 }}>Students</h1>
        <input
          placeholder="Search name, email, or student ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 14px",
            background: "#0A0A0A",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 8,
            color: "#F5F0E8",
            fontSize: 13,
            fontFamily: "inherit",
            minWidth: 260,
          }}
        />
      </div>

      <p style={{ fontSize: 13, color: "rgba(245,240,232,0.5)", marginBottom: 24 }}>
        {students.length} student{students.length !== 1 ? "s" : ""} registered
      </p>

      {loading ? (
        <p style={{ color: "rgba(245,240,232,0.5)" }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: "rgba(245,240,232,0.5)" }}>No students found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((s) => (
            <div key={s.id} style={{ background: "#0A0A0A", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{s.name || "Unnamed"}</div>
                  <div style={{ fontSize: 12, color: "rgba(245,240,232,0.5)" }}>{s.email}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, fontFamily: "var(--font-roboto-mono, monospace)", color: "#C9A84C", fontWeight: 700 }}>
                    {s.studentId || "—"}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(245,240,232,0.4)" }}>
                    Joined {new Date(s.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
              </div>

              {s.enrollments.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingTop: 10, borderTop: "1px solid rgba(201,168,76,0.08)" }}>
                  {s.enrollments.map((e, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 11,
                        padding: "3px 10px",
                        background: "rgba(201,168,76,0.08)",
                        border: "1px solid rgba(201,168,76,0.2)",
                        borderRadius: 100,
                        color: "#C9A84C",
                      }}
                    >
                      {e.course.title}
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 12, color: "rgba(245,240,232,0.35)", paddingTop: 10, borderTop: "1px solid rgba(201,168,76,0.08)" }}>
                  No paid enrollments yet
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
