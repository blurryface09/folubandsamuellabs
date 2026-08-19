"use client";

import { useEffect, useState } from "react";
import { ExamBuilder } from "@/components/academy/admin/exam-builder";

interface Course {
  id: string;
  title: string;
  slug: string;
}

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
  isCorrect: boolean;
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
  order: number;
  isPublished: boolean;
  lessons: Lesson[];
  assignments: Assignment[];
  exams: Exam[];
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  background: "#050505",
  border: "1px solid rgba(201,168,76,0.2)",
  borderRadius: 6,
  color: "#F5F0E8",
  fontSize: 13,
  fontFamily: "inherit",
};

const sectionBtn: React.CSSProperties = {
  background: "rgba(201,168,76,0.08)",
  border: "1px solid rgba(201,168,76,0.2)",
  color: "#C9A84C",
  fontSize: 11,
  fontWeight: 600,
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer",
};

export default function AdminContentPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [newWeekTitle, setNewWeekTitle] = useState("");
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<{ moduleId: string; type: "lesson" | "assignment" | "exam" } | null>(null);

  useEffect(() => {
    fetch("/api/admin/courses")
      .then((res) => (res.ok ? res.json() : { courses: [] }))
      .then((data) => setCourses(data.courses || []));
  }, []);

  const loadModules = (courseId: string) => {
    setLoading(true);
    fetch(`/api/admin/courses/${courseId}/modules`)
      .then((res) => (res.ok ? res.json() : { modules: [] }))
      .then((data) => setModules(data.modules || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedCourseId) loadModules(selectedCourseId);
    else setModules([]);
  }, [selectedCourseId]);

  const handleAddWeek = async () => {
    if (!newWeekTitle.trim() || !selectedCourseId) return;
    const res = await fetch(`/api/admin/courses/${selectedCourseId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newWeekTitle }),
    });
    if (res.ok) {
      setNewWeekTitle("");
      loadModules(selectedCourseId);
    }
  };

  const togglePublish = async (moduleId: string, isPublished: boolean) => {
    await fetch(`/api/admin/modules/${moduleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !isPublished }),
    });
    loadModules(selectedCourseId);
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm("Delete this week and everything in it?")) return;
    await fetch(`/api/admin/modules/${moduleId}`, { method: "DELETE" });
    loadModules(selectedCourseId);
  };

  return (
    <div>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 24 }}>Content</h1>

      <select
        value={selectedCourseId}
        onChange={(e) => setSelectedCourseId(e.target.value)}
        style={{ ...inputStyle, maxWidth: 360, marginBottom: 32 }}
      >
        <option value="">Select a course...</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>{c.title}</option>
        ))}
      </select>

      {selectedCourseId && (
        <>
          <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
            <input
              placeholder="New week title (e.g. Week 1: Intro)"
              value={newWeekTitle}
              onChange={(e) => setNewWeekTitle(e.target.value)}
              style={inputStyle}
            />
            <button onClick={handleAddWeek} style={{ ...sectionBtn, whiteSpace: "nowrap" }}>+ Add Week</button>
          </div>

          {loading ? (
            <p style={{ color: "rgba(245,240,232,0.5)" }}>Loading...</p>
          ) : modules.length === 0 ? (
            <p style={{ color: "rgba(245,240,232,0.5)" }}>No weeks yet. Add one above.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {modules.map((m) => {
                const isExpanded = expandedModuleId === m.id;
                return (
                  <div key={m.id} style={{ background: "#0A0A0A", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 12, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div
                        onClick={() => setExpandedModuleId(isExpanded ? null : m.id)}
                        style={{ cursor: "pointer", flex: 1, display: "flex", alignItems: "center", gap: 12 }}
                      >
                        <span style={{ fontSize: 12, color: "rgba(245,240,232,0.4)" }}>{isExpanded ? "▼" : "▶"}</span>
                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>{m.title}</h3>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 10px",
                            borderRadius: 100,
                            background: m.isPublished ? "rgba(16,185,129,0.15)" : "rgba(245,240,232,0.08)",
                            color: m.isPublished ? "#10B981" : "rgba(245,240,232,0.5)",
                          }}
                        >
                          {m.isPublished ? "Published" : "Hidden"}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => togglePublish(m.id, m.isPublished)} style={sectionBtn}>
                          {m.isPublished ? "Unpublish" : "Publish"}
                        </button>
                        <button onClick={() => deleteModule(m.id)} style={{ ...sectionBtn, color: "#F87171", borderColor: "rgba(248,113,113,0.3)" }}>
                          Delete
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <ModuleDetail
                        module={m}
                        activeForm={activeForm}
                        setActiveForm={setActiveForm}
                        onRefresh={() => loadModules(selectedCourseId)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ModuleDetail({
  module,
  activeForm,
  setActiveForm,
  onRefresh,
}: {
  module: Module;
  activeForm: { moduleId: string; type: "lesson" | "assignment" | "exam" } | null;
  setActiveForm: (v: { moduleId: string; type: "lesson" | "assignment" | "exam" } | null) => void;
  onRefresh: () => void;
}) {
  const isFormActive = (type: "lesson" | "assignment" | "exam") =>
    activeForm?.moduleId === module.id && activeForm.type === type;

  return (
    <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(201,168,76,0.1)", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Lessons */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Lessons ({module.lessons.length})
          </h4>
          <button onClick={() => setActiveForm(isFormActive("lesson") ? null : { moduleId: module.id, type: "lesson" })} style={sectionBtn}>
            {isFormActive("lesson") ? "Cancel" : "+ Add Lesson"}
          </button>
        </div>
        {module.lessons.map((l) => (
          <LessonRow key={l.id} lesson={l} onRefresh={onRefresh} />
        ))}
        {isFormActive("lesson") && <LessonForm moduleId={module.id} onDone={() => { setActiveForm(null); onRefresh(); }} />}
      </div>

      {/* Assignments */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Assignments & Classwork ({module.assignments.length})
          </h4>
          <button onClick={() => setActiveForm(isFormActive("assignment") ? null : { moduleId: module.id, type: "assignment" })} style={sectionBtn}>
            {isFormActive("assignment") ? "Cancel" : "+ Add Assignment"}
          </button>
        </div>
        {module.assignments.map((a) => (
          <AssignmentRow key={a.id} assignment={a} onRefresh={onRefresh} />
        ))}
        {isFormActive("assignment") && <AssignmentForm moduleId={module.id} onDone={() => { setActiveForm(null); onRefresh(); }} />}
      </div>

      {/* Exams */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Exams ({module.exams.length})
          </h4>
          <button onClick={() => setActiveForm(isFormActive("exam") ? null : { moduleId: module.id, type: "exam" })} style={sectionBtn}>
            {isFormActive("exam") ? "Cancel" : "+ Add Exam"}
          </button>
        </div>
        {module.exams.map((ex) => (
          <ExamRow key={ex.id} exam={ex} onRefresh={onRefresh} />
        ))}
        {isFormActive("exam") && (
          <ExamFormWrapper moduleId={module.id} onDone={() => { setActiveForm(null); onRefresh(); }} />
        )}
      </div>
    </div>
  );
}

function LessonRow({ lesson, onRefresh }: { lesson: Lesson; onRefresh: () => void }) {
  const handleDelete = async () => {
    if (!confirm(`Delete lesson "${lesson.title}"?`)) return;
    await fetch(`/api/admin/lessons/${lesson.id}`, { method: "DELETE" });
    onRefresh();
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#050505", borderRadius: 6, marginBottom: 6 }}>
      <span style={{ fontSize: 13 }}>{lesson.title}</span>
      <button onClick={handleDelete} style={{ background: "none", border: "none", color: "#F87171", fontSize: 11, cursor: "pointer" }}>Delete</button>
    </div>
  );
}

function LessonForm({ moduleId, onDone }: { moduleId: string; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [durationMins, setDurationMins] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setSubmitting(true);
    await fetch(`/api/admin/modules/${moduleId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, videoUrl, durationMins }),
    });
    setSubmitting(false);
    onDone();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, background: "#050505", padding: 16, borderRadius: 8, border: "1px solid rgba(201,168,76,0.15)" }}>
      <input placeholder="Lesson title" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
      <textarea placeholder="Lesson content (text/HTML)" value={content} onChange={(e) => setContent(e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
      <input placeholder="Video URL (optional)" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} style={inputStyle} />
      <input placeholder="Duration (minutes)" type="number" value={durationMins} onChange={(e) => setDurationMins(e.target.value)} style={{ ...inputStyle, maxWidth: 160 }} />
      <button onClick={handleSubmit} disabled={submitting} style={{ alignSelf: "flex-start", padding: "8px 20px", background: "linear-gradient(135deg, #C9A84C, #F0C040)", color: "#050505", border: "none", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: submitting ? "not-allowed" : "pointer" }}>
        {submitting ? "Saving..." : "Add Lesson"}
      </button>
    </div>
  );
}

function AssignmentRow({ assignment, onRefresh }: { assignment: Assignment; onRefresh: () => void }) {
  const handleDelete = async () => {
    if (!confirm(`Delete "${assignment.title}"?`)) return;
    await fetch(`/api/admin/assignments/${assignment.id}`, { method: "DELETE" });
    onRefresh();
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#050505", borderRadius: 6, marginBottom: 6 }}>
      <span style={{ fontSize: 13 }}>
        <span style={{ color: "rgba(201,168,76,0.6)", fontSize: 10, marginRight: 8 }}>{assignment.type}</span>
        {assignment.title}
      </span>
      <button onClick={handleDelete} style={{ background: "none", border: "none", color: "#F87171", fontSize: 11, cursor: "pointer" }}>Delete</button>
    </div>
  );
}

function AssignmentForm({ moduleId, onDone }: { moduleId: string; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [type, setType] = useState<"ASSIGNMENT" | "CLASSWORK">("ASSIGNMENT");
  const [dueDate, setDueDate] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title.trim() || !instructions.trim()) {
      setError("Title and instructions are required.");
      return;
    }
    setSubmitting(true);
    await fetch(`/api/admin/modules/${moduleId}/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, instructions, type, dueDate: dueDate || null, maxScore }),
    });
    setSubmitting(false);
    onDone();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, background: "#050505", padding: 16, borderRadius: 8, border: "1px solid rgba(201,168,76,0.15)" }}>
      <select value={type} onChange={(e) => setType(e.target.value as "ASSIGNMENT" | "CLASSWORK")} style={{ ...inputStyle, maxWidth: 160 }}>
        <option value="ASSIGNMENT">Assignment</option>
        <option value="CLASSWORK">Classwork</option>
      </select>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
      <textarea placeholder="Instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
      <div style={{ display: "flex", gap: 10 }}>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inputStyle} />
        <input type="number" placeholder="Max score" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} style={{ ...inputStyle, maxWidth: 120 }} />
      </div>
      {error && <div style={{ color: "#F87171", fontSize: 12 }}>{error}</div>}
      <button onClick={handleSubmit} disabled={submitting} style={{ alignSelf: "flex-start", padding: "8px 20px", background: "linear-gradient(135deg, #C9A84C, #F0C040)", color: "#050505", border: "none", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: submitting ? "not-allowed" : "pointer" }}>
        {submitting ? "Saving..." : "Add Assignment"}
      </button>
    </div>
  );
}

function ExamRow({ exam, onRefresh }: { exam: Exam; onRefresh: () => void }) {
  const handleDelete = async () => {
    if (!confirm(`Delete exam "${exam.title}"?`)) return;
    await fetch(`/api/admin/exams/${exam.id}`, { method: "DELETE" });
    onRefresh();
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#050505", borderRadius: 6, marginBottom: 6 }}>
      <span style={{ fontSize: 13 }}>{exam.title} <span style={{ color: "rgba(245,240,232,0.4)", fontSize: 11 }}>({exam.questions.length} questions)</span></span>
      <button onClick={handleDelete} style={{ background: "none", border: "none", color: "#F87171", fontSize: 11, cursor: "pointer" }}>Delete</button>
    </div>
  );
}

function ExamFormWrapper({ moduleId, onDone }: { moduleId: string; onDone: () => void }) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: { title: string; instructions: string; passingScore: number; questions: { question: string; options: { text: string; isCorrect: boolean }[] }[] }) => {
    setSubmitting(true);
    await fetch(`/api/admin/modules/${moduleId}/exams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSubmitting(false);
    onDone();
  };

  return <ExamBuilder onSubmit={handleSubmit} submitting={submitting} />;
}
