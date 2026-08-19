"use client";

import { useState } from "react";

interface OptionInput {
  text: string;
  isCorrect: boolean;
}

interface QuestionInput {
  question: string;
  options: OptionInput[];
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

function emptyQuestion(): QuestionInput {
  return {
    question: "",
    options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
    ],
  };
}

export function ExamBuilder({
  onSubmit,
  submitting,
}: {
  onSubmit: (data: { title: string; instructions: string; passingScore: number; questions: QuestionInput[] }) => void;
  submitting: boolean;
}) {
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [passingScore, setPassingScore] = useState(70);
  const [questions, setQuestions] = useState<QuestionInput[]>([emptyQuestion()]);
  const [error, setError] = useState("");

  const updateQuestion = (qIdx: number, question: string) => {
    setQuestions((prev) => prev.map((q, i) => (i === qIdx ? { ...q, question } : q)));
  };

  const updateOptionText = (qIdx: number, oIdx: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx ? { ...q, options: q.options.map((o, j) => (j === oIdx ? { ...o, text } : o)) } : q
      )
    );
  };

  const setCorrectOption = (qIdx: number, oIdx: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx ? { ...q, options: q.options.map((o, j) => ({ ...o, isCorrect: j === oIdx })) } : q
      )
    );
  };

  const addOption = (qIdx: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIdx ? { ...q, options: [...q.options, { text: "", isCorrect: false }] } : q))
    );
  };

  const removeOption = (qIdx: number, oIdx: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIdx ? { ...q, options: q.options.filter((_, j) => j !== oIdx) } : q))
    );
  };

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);
  const removeQuestion = (qIdx: number) => setQuestions((prev) => prev.filter((_, i) => i !== qIdx));

  const handleSubmit = () => {
    setError("");
    if (!title.trim()) {
      setError("Exam title is required.");
      return;
    }
    for (const q of questions) {
      if (!q.question.trim()) {
        setError("Every question needs text.");
        return;
      }
      if (q.options.some((o) => !o.text.trim())) {
        setError("Every option needs text.");
        return;
      }
    }
    onSubmit({ title, instructions, passingScore, questions });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, background: "#050505", padding: 16, borderRadius: 8, border: "1px solid rgba(201,168,76,0.15)" }}>
      <input placeholder="Exam title" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
      <textarea placeholder="Instructions (optional)" value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 12, color: "rgba(245,240,232,0.6)" }}>Passing score:</label>
        <input
          type="number"
          value={passingScore}
          onChange={(e) => setPassingScore(Number(e.target.value))}
          style={{ ...inputStyle, width: 80 }}
        />
        <span style={{ fontSize: 12, color: "rgba(245,240,232,0.4)" }}>%</span>
      </div>

      {questions.map((q, qIdx) => (
        <div key={qIdx} style={{ border: "1px solid rgba(201,168,76,0.1)", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "rgba(201,168,76,0.6)", flexShrink: 0 }}>Q{qIdx + 1}</span>
            <input
              placeholder="Question text"
              value={q.question}
              onChange={(e) => updateQuestion(qIdx, e.target.value)}
              style={inputStyle}
            />
            {questions.length > 1 && (
              <button onClick={() => removeQuestion(qIdx)} style={{ background: "none", border: "none", color: "#F87171", fontSize: 11, cursor: "pointer", flexShrink: 0 }}>
                Remove
              </button>
            )}
          </div>
          {q.options.map((o, oIdx) => (
            <div key={oIdx} style={{ display: "flex", gap: 8, alignItems: "center", paddingLeft: 20 }}>
              <input
                type="radio"
                name={`correct-${qIdx}`}
                checked={o.isCorrect}
                onChange={() => setCorrectOption(qIdx, oIdx)}
              />
              <input
                placeholder={`Option ${oIdx + 1}`}
                value={o.text}
                onChange={(e) => updateOptionText(qIdx, oIdx, e.target.value)}
                style={inputStyle}
              />
              {q.options.length > 2 && (
                <button onClick={() => removeOption(qIdx, oIdx)} style={{ background: "none", border: "none", color: "rgba(245,240,232,0.4)", fontSize: 11, cursor: "pointer" }}>
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addOption(qIdx)}
            style={{ alignSelf: "flex-start", marginLeft: 20, background: "none", border: "none", color: "#C9A84C", fontSize: 11, cursor: "pointer" }}
          >
            + Add option
          </button>
        </div>
      ))}

      <button onClick={addQuestion} style={{ alignSelf: "flex-start", background: "none", border: "1px dashed rgba(201,168,76,0.3)", color: "#C9A84C", fontSize: 12, padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>
        + Add question
      </button>

      {error && <div style={{ color: "#F87171", fontSize: 12 }}>{error}</div>}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          alignSelf: "flex-start",
          padding: "10px 20px",
          background: "linear-gradient(135deg, #C9A84C, #F0C040)",
          color: "#050505",
          border: "none",
          borderRadius: 6,
          fontWeight: 700,
          fontSize: 12,
          cursor: submitting ? "not-allowed" : "pointer",
          opacity: submitting ? 0.6 : 1,
        }}
      >
        {submitting ? "Creating..." : "Create Exam"}
      </button>
    </div>
  );
}
