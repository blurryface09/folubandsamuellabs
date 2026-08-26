"use client";

import { useState } from "react";

interface HelpRequestButtonProps {
  courseId?: string;
  moduleId?: string;
}

const CONTACT_OPTIONS = [
  { value: "CALL", label: "Phone call" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "VIDEO", label: "Video call" },
] as const;

export default function HelpRequestButton({ courseId, moduleId }: HelpRequestButtonProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [preferredContact, setPreferredContact] = useState<"CALL" | "WHATSAPP" | "VIDEO">("CALL");
  const [phone, setPhone] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const reset = () => {
    setMessage("");
    setPhone("");
    setPreferredTime("");
    setPreferredContact("CALL");
    setError("");
    setSent(false);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(reset, 250);
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError("Let us know what you need help with.");
      return;
    }
    if (!phone.trim()) {
      setError("A phone number is required so we can reach you.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/help-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, preferredContact, phone, preferredTime, courseId, moduleId }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    background: "#050505",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: 8,
    color: "#F5F0E8",
    fontSize: 13,
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 20px",
          background: "linear-gradient(135deg, #C9A84C, #F0C040)",
          color: "#050505",
          border: "none",
          borderRadius: 100,
          fontWeight: 700,
          fontSize: 13,
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(201,168,76,0.35)",
        }}
      >
        Need Help?
      </button>

      {open && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0A0A0A",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 16,
              padding: 28,
              maxWidth: 440,
              width: "100%",
              color: "#F5F0E8",
            }}
          >
            {sent ? (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Request sent</h3>
                <p style={{ fontSize: 13, color: "rgba(245,240,232,0.6)", marginBottom: 20 }}>
                  We'll reach out within 24 hours to confirm a time.
                </p>
                <button
                  onClick={handleClose}
                  style={{ padding: "10px 24px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 8, color: "#C9A84C", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Request a call</h3>
                <p style={{ fontSize: 13, color: "rgba(245,240,232,0.55)", marginBottom: 20 }}>
                  Stuck on something? Tell us and we'll set up a time to talk it through.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "rgba(245,240,232,0.6)", marginBottom: 6, display: "block" }}>
                      What do you need help with?
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      placeholder="e.g. I don't understand how Flexbox alignment works"
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, color: "rgba(245,240,232,0.6)", marginBottom: 6, display: "block" }}>
                      How should we reach you?
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {CONTACT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setPreferredContact(opt.value)}
                          style={{
                            flex: 1,
                            padding: "8px 10px",
                            background: preferredContact === opt.value ? "rgba(201,168,76,0.15)" : "#050505",
                            border: `1px solid ${preferredContact === opt.value ? "#C9A84C" : "rgba(201,168,76,0.2)"}`,
                            borderRadius: 6,
                            color: preferredContact === opt.value ? "#C9A84C" : "rgba(245,240,232,0.6)",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, color: "rgba(245,240,232,0.6)", marginBottom: 6, display: "block" }}>
                      Phone number
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234..."
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, color: "rgba(245,240,232,0.6)", marginBottom: 6, display: "block" }}>
                      Preferred time (optional)
                    </label>
                    <input
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      placeholder="e.g. weekday evenings"
                      style={inputStyle}
                    />
                  </div>

                  {error && <div style={{ color: "#F87171", fontSize: 12 }}>{error}</div>}

                  <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                    <button
                      onClick={handleClose}
                      style={{ flex: 1, padding: "10px 20px", background: "transparent", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, color: "rgba(245,240,232,0.6)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      style={{ flex: 1, padding: "10px 20px", background: "linear-gradient(135deg, #C9A84C, #F0C040)", color: "#050505", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.6 : 1 }}
                    >
                      {submitting ? "Sending..." : "Send request"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
