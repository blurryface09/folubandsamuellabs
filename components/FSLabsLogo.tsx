"use client";

export function FSLabsLogo({ width = 72, height = 72 }: { width?: number; height?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#F0C040", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#C9A84C", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* F Letter */}
      <g>
        {/* F vertical bar */}
        <rect x="18" y="15" width="8" height="55" fill="url(#goldGradient)" rx="2" />
        {/* F top horizontal */}
        <rect x="18" y="15" width="22" height="8" fill="url(#goldGradient)" rx="2" />
        {/* F middle horizontal */}
        <rect x="18" y="42" width="18" height="7" fill="url(#goldGradient)" rx="2" />
      </g>

      {/* S Letter */}
      <g>
        {/* S top curve */}
        <path
          d="M 62 22 Q 62 15 70 15 Q 78 15 78 22 Q 78 28 70 32 Q 62 36 62 42 Q 62 48 70 48 Q 78 48 78 42"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* S bottom curve */}
        <path
          d="M 62 52 Q 62 48 70 48 Q 78 48 78 52 Q 78 58 70 62 Q 62 66 62 72 Q 62 78 70 78 Q 78 78 78 72"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Accent line */}
      <line
        x1="18"
        y1="85"
        x2="50"
        y2="85"
        stroke="url(#goldGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
