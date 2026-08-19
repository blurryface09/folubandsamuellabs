"use client";

function getInitials(name: string | null | undefined) {
  if (!name) return "FS";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "FS";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  src,
  name,
  size = 96,
}: {
  src?: string | null;
  name?: string | null;
  size?: number;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name || "Profile photo"}
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid rgba(201,168,76,0.3)",
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #C9A84C, #8B6914)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid rgba(201,168,76,0.3)",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-exo2)",
          fontWeight: 800,
          fontSize: size * 0.36,
          color: "#050505",
        }}
      >
        {getInitials(name)}
      </span>
    </div>
  );
}
