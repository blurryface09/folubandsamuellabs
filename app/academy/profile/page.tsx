"use client";

import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { pageTransition, fadeInUp } from "@/lib/motion/animations";
import { Avatar } from "@/components/academy/avatar";
import { IdCard } from "@/components/academy/id-card";

interface ProfileData {
  studentId: string | null;
  nickname: string | null;
  bio: string | null;
  image: string | null;
}

const MAX_AVATAR_DIMENSION = 320;

function resizeImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image"));
      img.onload = () => {
        const scale = Math.min(1, MAX_AVATAR_DIMENSION / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    nickname: "",
    bio: "",
  });

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: ProfileData) => {
        setProfile(data);
        setFormData({
          nickname: data.nickname || "",
          bio: data.bio || "",
        });
      })
      .catch(() => setSaveError("Failed to load profile."));
  }, [status]);

  const handleSave = async () => {
    setLoading(true);
    setSaveError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updated: ProfileData = await res.json();
        setProfile(updated);
        setFormData({
          nickname: updated.nickname || "",
          bio: updated.bio || "",
        });
        setIsEditing(false);
      } else {
        setSaveError("Failed to save changes. Please try again.");
      }
    } catch (error) {
      setSaveError("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select an image file.");
      return;
    }

    setPhotoUploading(true);
    setPhotoError("");
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      const res = await fetch("/api/profile/photo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });

      if (res.ok) {
        const updated: { image: string | null } = await res.json();
        setProfile((prev) => (prev ? { ...prev, image: updated.image } : prev));
      } else {
        setPhotoError("Failed to upload photo. Please try again.");
      }
    } catch (error) {
      setPhotoError("Failed to upload photo. Please try again.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const handlePhotoRemove = async () => {
    setPhotoUploading(true);
    setPhotoError("");
    try {
      const res = await fetch("/api/profile/photo", { method: "DELETE" });
      if (res.ok) {
        setProfile((prev) => (prev ? { ...prev, image: null } : prev));
      } else {
        setPhotoError("Failed to remove photo. Please try again.");
      }
    } catch (error) {
      setPhotoError("Failed to remove photo. Please try again.");
    } finally {
      setPhotoUploading(false);
    }
  };

  if (status === "loading") {
    return <div style={{ padding: "60px 28px", textAlign: "center", color: "#F5F0E8" }}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div style={{ padding: "60px 28px", textAlign: "center", color: "#F5F0E8" }}>
        <p>Please log in to view your profile</p>
        <Link href="/academy/login" style={{ color: "#C9A84C" }}>
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <motion.main
      initial="initial"
      animate="animate"
      style={{ background: "#050505", color: "#F5F0E8", minHeight: "100vh", padding: "132px 28px 60px" }}
    >
      <motion.div variants={pageTransition} style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 60 }}>
          <Link href="/academy/dashboard" style={{ color: "#C9A84C", textDecoration: "none", fontSize: 14 }}>
            ← Back to Dashboard
          </Link>
          <h1 style={{ fontSize: 48, fontWeight: 800, marginTop: 20, marginBottom: 10 }}>My Profile</h1>
        </div>

        {/* Profile Card */}
        <motion.div
          variants={fadeInUp}
          style={{
            background: "#0A0A0A",
            border: "1px solid rgba(201,168,76,0.1)",
            borderRadius: 12,
            padding: 40,
            marginBottom: 40,
          }}
        >
          {/* Photo */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
            <Avatar src={profile?.image} name={session?.user?.name} size={80} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoUploading}
                  style={{
                    padding: "8px 16px",
                    background: "rgba(201,168,76,0.1)",
                    color: "#C9A84C",
                    border: "1px solid rgba(201,168,76,0.3)",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: photoUploading ? "not-allowed" : "pointer",
                    opacity: photoUploading ? 0.6 : 1,
                  }}
                >
                  {photoUploading ? "Uploading..." : "Change Photo"}
                </button>
                {profile?.image ? (
                  <button
                    onClick={handlePhotoRemove}
                    disabled={photoUploading}
                    style={{
                      padding: "8px 16px",
                      background: "transparent",
                      color: "rgba(245,240,232,0.5)",
                      border: "1px solid rgba(245,240,232,0.15)",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: photoUploading ? "not-allowed" : "pointer",
                    }}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                style={{ display: "none" }}
              />
              {photoError && <div style={{ fontSize: 12, color: "#F87171" }}>{photoError}</div>}
            </div>
          </div>

          {/* Student ID */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 12, color: "rgba(201,168,76,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Student ID
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginTop: 8,
                fontFamily: "var(--font-roboto-mono)",
                color: "#C9A84C",
              }}
            >
              {profile?.studentId || "Loading..."}
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
            <div style={{ fontSize: 12, color: "rgba(201,168,76,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Email
            </div>
            <div style={{ fontSize: 16, marginTop: 8 }}>{session?.user?.email}</div>
          </div>

          {/* Name */}
          <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
            <div style={{ fontSize: 12, color: "rgba(201,168,76,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Full Name
            </div>
            <div style={{ fontSize: 16, marginTop: 8 }}>{session?.user?.name}</div>
          </div>

          {/* Nickname */}
          <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
            <div style={{ fontSize: 12, color: "rgba(201,168,76,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Nickname (Public)
            </div>
            {isEditing ? (
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                placeholder="Your nickname"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  marginTop: 8,
                  background: "#050505",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: 8,
                  color: "#F5F0E8",
                  fontSize: 14,
                }}
              />
            ) : (
              <div style={{ fontSize: 16, marginTop: 8, color: formData.nickname ? "#F5F0E8" : "rgba(245,240,232,0.4)" }}>
                {formData.nickname || "Not set"}
              </div>
            )}
          </div>

          {/* Bio */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 12, color: "rgba(201,168,76,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Bio (Public)
            </div>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell other students about yourself..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  marginTop: 8,
                  background: "#050505",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: 8,
                  color: "#F5F0E8",
                  fontSize: 14,
                  fontFamily: "inherit",
                }}
              />
            ) : (
              <div
                style={{
                  fontSize: 14,
                  marginTop: 8,
                  lineHeight: 1.6,
                  color: formData.bio ? "#F5F0E8" : "rgba(245,240,232,0.4)",
                }}
              >
                {formData.bio || "No bio yet"}
              </div>
            )}
          </div>

          {saveError && (
            <div style={{ color: "#F87171", fontSize: 13, marginBottom: 16 }}>{saveError}</div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #C9A84C, #F0C040)",
                    color: "#050505",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    flex: 1,
                    padding: "12px 24px",
                    background: "transparent",
                    color: "#C9A84C",
                    border: "1px solid rgba(201,168,76,0.3)",
                    borderRadius: 8,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  background: "rgba(201,168,76,0.1)",
                  color: "#C9A84C",
                  border: "1px solid rgba(201,168,76,0.3)",
                  borderRadius: 8,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Edit Profile
              </button>
            )}
          </div>
        </motion.div>

        {/* ID Card */}
        {profile?.studentId ? (
          <motion.div
            variants={fadeInUp}
            style={{
              background: "#0A0A0A",
              border: "1px solid rgba(201,168,76,0.1)",
              borderRadius: 12,
              padding: 40,
              marginBottom: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Your Academy ID Card</h3>
              <p style={{ fontSize: 13, color: "rgba(245,240,232,0.5)" }}>
                Download and share to show you&apos;re part of FSLabs Academy.
              </p>
            </div>
            <IdCard
              name={session?.user?.name || "Student"}
              nickname={profile.nickname}
              studentId={profile.studentId}
              image={profile.image}
            />
          </motion.div>
        ) : null}

        {/* Logout Button */}
        <motion.button
          variants={fadeInUp}
          onClick={() => signOut({ redirect: true, callbackUrl: "/academy/login" })}
          style={{
            width: "100%",
            padding: "16px 24px",
            background: "#DC2626",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#991B1B";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(220,38,38,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#DC2626";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          Logout
        </motion.button>
      </motion.div>
    </motion.main>
  );
}
