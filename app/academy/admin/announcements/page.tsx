"use client";

import { useEffect, useState } from "react";

interface Announcement {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/admin/announcements")
      .then((res) => (res.ok ? res.json() : { announcements: [] }))
      .then((data) => setAnnouncements(data.announcements || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handlePost = async () => {
    if (!title.trim() || !body.trim()) {
      setError("Title and body are required.");
      return;
    }
    setPosting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      if (res.ok) {
        setTitle("");
        setBody("");
        load();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to post announcement.");
      }
    } catch {
      setError("Failed to post announcement.");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    background: "#050505",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: 8,
    color: "#F5F0E8",
    fontSize: 14,
    fontFamily: "inherit",
  };

  return (
    <div>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 32 }}>Announcements</h1>

      <div style={{ background: "#0A0A0A", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 12, padding: 24, marginBottom: 32, display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          placeholder="Announcement title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="Announcement body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          style={{ ...inputStyle, resize: "vertical" }}
        />
        {error && <div style={{ color: "#F87171", fontSize: 13 }}>{error}</div>}
        <button
          onClick={handlePost}
          disabled={posting}
          style={{
            alignSelf: "flex-start",
            padding: "10px 24px",
            background: "linear-gradient(135deg, #C9A84C, #F0C040)",
            color: "#050505",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
            cursor: posting ? "not-allowed" : "pointer",
            opacity: posting ? 0.6 : 1,
          }}
        >
          {posting ? "Posting..." : "Post Announcement"}
        </button>
      </div>

      {loading ? (
        <p style={{ color: "rgba(245,240,232,0.5)" }}>Loading...</p>
      ) : announcements.length === 0 ? (
        <p style={{ color: "rgba(245,240,232,0.5)" }}>No announcements yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {announcements.map((a) => (
            <div key={a.id} style={{ background: "#0A0A0A", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{a.title}</h3>
                <button
                  onClick={() => handleDelete(a.id)}
                  style={{ background: "none", border: "none", color: "#F87171", fontSize: 12, cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
              <p style={{ fontSize: 13, color: "rgba(245,240,232,0.6)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{a.body}</p>
              <div style={{ fontSize: 11, color: "rgba(245,240,232,0.3)", marginTop: 10 }}>
                {new Date(a.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
