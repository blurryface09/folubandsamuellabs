"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Avatar } from "./avatar";

interface IdCardProps {
  name: string;
  nickname?: string | null;
  studentId: string;
  image?: string | null;
  courses?: string[];
}

export function IdCard({ name, nickname, studentId, image, courses = [] }: IdCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `fslabs-academy-id-${studentId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate ID card:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
      <div
        ref={cardRef}
        style={{
          width: 380,
          borderRadius: 20,
          overflow: "hidden",
          background: "linear-gradient(160deg, #0A0A0A 0%, #050505 70%)",
          border: "1px solid rgba(201,168,76,0.25)",
          fontFamily: "var(--font-roboto-mono)",
          position: "relative",
        }}
      >
        {/* Gold header bar */}
        <div
          style={{
            background: "linear-gradient(135deg, #C9A84C, #8B6914)",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#050505", fontFamily: "var(--font-exo2)" }}>
              FSLABS ACADEMY
            </div>
            <div style={{ fontSize: 8, letterSpacing: "0.15em", color: "rgba(5,5,5,0.7)", textTransform: "uppercase" }}>
              Student Identification
            </div>
          </div>
          <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "rgba(5,5,5,0.6)" }}>fslabs.tech</div>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Avatar src={image} name={name} size={88} />

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#F5F0E8", fontFamily: "var(--font-exo2)" }}>
              {name}
            </div>
            {nickname ? (
              <div style={{ fontSize: 12, color: "rgba(201,168,76,0.7)", marginTop: 2 }}>@{nickname}</div>
            ) : null}
          </div>

          <div
            style={{
              width: "100%",
              borderTop: "1px dashed rgba(201,168,76,0.2)",
              paddingTop: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(245,240,232,0.4)", textTransform: "uppercase" }}>
              Student ID
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#C9A84C", letterSpacing: "0.05em" }}>
              {studentId}
            </div>
          </div>

          {courses.length > 0 && (
            <div
              style={{
                width: "100%",
                borderTop: "1px dashed rgba(201,168,76,0.2)",
                paddingTop: 14,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(245,240,232,0.4)", textTransform: "uppercase" }}>
                Enrolled In
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                {courses.map((c) => (
                  <span
                    key={c}
                    style={{
                      padding: "4px 10px",
                      background: "rgba(201,168,76,0.1)",
                      border: "1px solid rgba(201,168,76,0.25)",
                      borderRadius: 100,
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#C9A84C",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer strip */}
        <div
          style={{
            padding: "10px 24px",
            background: "rgba(201,168,76,0.06)",
            borderTop: "1px solid rgba(201,168,76,0.15)",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 8, letterSpacing: "0.1em", color: "rgba(245,240,232,0.35)" }}>
            Issued by Folub &amp; Samuel Labs &middot; Verify at fslabs.tech/academy
          </span>
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={downloading}
        style={{
          padding: "12px 28px",
          background: "linear-gradient(135deg, #C9A84C, #F0C040)",
          color: "#050505",
          border: "none",
          borderRadius: 8,
          fontWeight: 700,
          fontSize: 13,
          cursor: downloading ? "not-allowed" : "pointer",
          opacity: downloading ? 0.6 : 1,
        }}
      >
        {downloading ? "Generating..." : "Download ID Card"}
      </button>
    </div>
  );
}
