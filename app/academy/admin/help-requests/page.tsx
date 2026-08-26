"use client";

import { useEffect, useState } from "react";

interface HelpRequest {
  id: string;
  message: string;
  preferredContact: "CALL" | "WHATSAPP" | "VIDEO";
  phone: string;
  preferredTime: string | null;
  status: "PENDING" | "CONTACTED" | "RESOLVED";
  adminNote: string | null;
  createdAt: string;
  user: { name: string | null; email: string; studentId: string | null };
  course: { title: string } | null;
  module: { title: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#F0C040",
  CONTACTED: "#7DD3FC",
  RESOLVED: "#A8D5A2",
};

export default function AdminHelpRequestsPage() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING">("PENDING");
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  const load = () => {
    fetch("/api/admin/help-requests")
      .then((res) => (res.ok ? res.json() : { helpRequests: [] }))
      .then((data) => setRequests(data.helpRequests || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const updateRequest = async (id: string, patch: { status?: string; adminNote?: string }) => {
    const res = await fetch(`/api/admin/help-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const data = await res.json();
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...data.helpRequest } : r)));
    }
  };

  const filtered = filter === "PENDING" ? requests.filter((r) => r.status !== "RESOLVED") : requests;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800 }}>Help Requests</h1>
        <div style={{ display: "flex", gap: 8 }}>
          {(["PENDING", "ALL"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 16px",
                background: filter === f ? "rgba(201,168,76,0.15)" : "transparent",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: 6,
                color: filter === f ? "#C9A84C" : "rgba(245,240,232,0.5)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {f === "PENDING" ? "Open" : "All"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: "rgba(245,240,232,0.5)" }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: "rgba(245,240,232,0.5)" }}>{filter === "PENDING" ? "No open help requests." : "No help requests yet."}</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map((r) => (
            <div key={r.id} style={{ background: "#0A0A0A", border: "1px solid rgba(201,168,76,0.1)", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{r.user.name || "Unnamed"}</div>
                  <div style={{ fontSize: 12, color: "rgba(245,240,232,0.5)" }}>{r.user.email} · {r.user.studentId || "—"}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: `${STATUS_COLORS[r.status]}20`, color: STATUS_COLORS[r.status] }}>
                    {r.status}
                  </span>
                  <span style={{ fontSize: 11, color: "rgba(245,240,232,0.4)" }}>
                    {new Date(r.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>

              {(r.course || r.module) && (
                <div style={{ fontSize: 11, color: "#C9A84C", marginBottom: 8 }}>
                  {r.course?.title}{r.module ? ` · ${r.module.title}` : ""}
                </div>
              )}

              <p style={{ fontSize: 13, color: "rgba(245,240,232,0.75)", lineHeight: 1.6, marginBottom: 12, whiteSpace: "pre-wrap" }}>{r.message}</p>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: "rgba(245,240,232,0.5)", marginBottom: 16 }}>
                <span>Prefers: <strong style={{ color: "#F5F0E8" }}>{r.preferredContact}</strong></span>
                <span>Phone: <strong style={{ color: "#F5F0E8" }}>{r.phone}</strong></span>
                {r.preferredTime && <span>Preferred time: <strong style={{ color: "#F5F0E8" }}>{r.preferredTime}</strong></span>}
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {(["PENDING", "CONTACTED", "RESOLVED"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateRequest(r.id, { status: s })}
                    disabled={r.status === s}
                    style={{
                      padding: "6px 14px",
                      background: r.status === s ? "rgba(201,168,76,0.15)" : "transparent",
                      border: "1px solid rgba(201,168,76,0.2)",
                      borderRadius: 6,
                      color: r.status === s ? "#C9A84C" : "rgba(245,240,232,0.5)",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: r.status === s ? "default" : "pointer",
                    }}
                  >
                    Mark {s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <input
                  placeholder="Add a note (e.g. called, rescheduled Friday)"
                  value={noteDrafts[r.id] ?? r.adminNote ?? ""}
                  onChange={(e) => setNoteDrafts((prev) => ({ ...prev, [r.id]: e.target.value }))}
                  style={{ flex: 1, padding: "8px 12px", background: "#050505", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 6, color: "#F5F0E8", fontSize: 12, fontFamily: "inherit" }}
                />
                <button
                  onClick={() => updateRequest(r.id, { adminNote: noteDrafts[r.id] ?? r.adminNote ?? "" })}
                  style={{ padding: "8px 16px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 6, color: "#C9A84C", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                >
                  Save note
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
