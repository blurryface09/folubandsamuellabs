interface ProgressBarProps {
  percentage: number; // 0-100
  showLabel?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  percentage,
  showLabel = true,
  label,
  size = "md",
}: ProgressBarProps) {
  const heights = {
    sm: 6,
    md: 8,
    lg: 12,
  };

  const height = heights[size];
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div>
      {showLabel && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
            fontSize: 12,
            color: "rgba(245,240,232,0.7)",
          }}
        >
          {label && <span>{label}</span>}
          <span style={{ fontFamily: "var(--font-roboto-mono)", fontWeight: 600 }}>
            {clampedPercentage}%
          </span>
        </div>
      )}

      <div
        style={{
          width: "100%",
          height,
          background: "rgba(201,168,76,0.1)",
          borderRadius: height / 2,
          overflow: "hidden",
          border: "1px solid rgba(201,168,76,0.15)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${clampedPercentage}%`,
            background: `linear-gradient(90deg,#C9A84C,#F0C040)`,
            transition: "width 0.6s ease",
            boxShadow: "0 0 12px rgba(201,168,76,0.4)",
          }}
        />
      </div>
    </div>
  );
}
