"use client";

/**
 * Illustrated header art for each course, keyed by slug.
 * Each piece is a self-contained SVG scene sized to the card header (320x200,
 * sliced) so it fills any card width without distortion.
 */

const SVG_PROPS = {
  viewBox: "0 0 320 200",
  preserveAspectRatio: "xMidYMid slice",
  width: "100%",
  height: "100%",
  style: { display: "block" as const },
};

/* ── Full Stack Development ─────────────────────────────────────────────── */
function FullStackArt() {
  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id="fsa-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <radialGradient id="fsa-glow" cx="0.22" cy="0.18" r="0.75">
          <stop offset="0%" stopColor="#C7D2FE" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="200" fill="url(#fsa-bg)" />
      <rect width="320" height="200" fill="url(#fsa-glow)" />

      {/* server rack behind */}
      <g opacity="0.32" stroke="#fff" fill="none" strokeWidth="2">
        <rect x="206" y="52" width="84" height="26" rx="5" />
        <rect x="206" y="87" width="84" height="26" rx="5" />
        <rect x="206" y="122" width="84" height="26" rx="5" />
      </g>
      <g fill="#fff" opacity="0.5">
        <circle cx="218" cy="65" r="3" />
        <circle cx="218" cy="100" r="3" />
        <circle cx="218" cy="135" r="3" />
      </g>

      {/* connector */}
      <path
        d="M182 100 H206"
        stroke="#fff"
        strokeOpacity="0.6"
        strokeWidth="2"
        strokeDasharray="4 5"
      />

      {/* browser window in front */}
      <rect
        x="32"
        y="46"
        width="150"
        height="108"
        rx="9"
        fill="#fff"
        fillOpacity="0.13"
        stroke="#fff"
        strokeOpacity="0.85"
        strokeWidth="2"
      />
      <line x1="32" y1="71" x2="182" y2="71" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" />
      <g fill="#fff">
        <circle cx="46" cy="58" r="4" fillOpacity="0.9" />
        <circle cx="60" cy="58" r="4" fillOpacity="0.55" />
        <circle cx="74" cy="58" r="4" fillOpacity="0.35" />
        <rect x="46" y="86" width="58" height="8" rx="4" fillOpacity="0.8" />
        <rect x="46" y="102" width="92" height="8" rx="4" fillOpacity="0.45" />
        <rect x="46" y="118" width="72" height="8" rx="4" fillOpacity="0.3" />
        <rect x="46" y="134" width="38" height="8" rx="4" fillOpacity="0.2" />
      </g>
    </svg>
  );
}

/* ── Ethical Hacking ────────────────────────────────────────────────────── */
function EthicalHackingArt() {
  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id="eha-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </linearGradient>
        <radialGradient id="eha-glow" cx="0.75" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#FECDD3" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FECDD3" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="200" fill="url(#eha-bg)" />
      <rect width="320" height="200" fill="url(#eha-glow)" />

      {/* radar sweep */}
      <g stroke="#fff" fill="none" opacity="0.28" strokeWidth="2">
        <circle cx="242" cy="100" r="28" />
        <circle cx="242" cy="100" r="48" />
        <circle cx="242" cy="100" r="68" />
        <line x1="242" y1="32" x2="242" y2="168" />
        <line x1="174" y1="100" x2="310" y2="100" />
      </g>
      <circle cx="266" cy="74" r="4.5" fill="#fff" fillOpacity="0.9" />
      <circle cx="222" cy="132" r="3" fill="#fff" fillOpacity="0.6" />

      {/* shield */}
      <path
        d="M90 38 L146 57 V103 C146 132 121 153 90 163 C59 153 34 132 34 103 V57 Z"
        fill="#fff"
        fillOpacity="0.15"
        stroke="#fff"
        strokeOpacity="0.9"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* keyhole */}
      <circle cx="90" cy="93" r="12" fill="#fff" fillOpacity="0.92" />
      <path d="M84 99 H96 L93 125 H87 Z" fill="#fff" fillOpacity="0.92" />
    </svg>
  );
}

/* ── Machine Learning ───────────────────────────────────────────────────── */
function MachineLearningArt() {
  const layers = [
    { x: 74, ys: [62, 100, 138] },
    { x: 160, ys: [44, 81, 119, 156] },
    { x: 246, ys: [81, 119] },
  ];

  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id="mla-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0C4A6E" />
        </linearGradient>
        <radialGradient id="mla-glow" cx="0.5" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="200" fill="url(#mla-bg)" />
      <rect width="320" height="200" fill="url(#mla-glow)" />

      {/* edges */}
      <g stroke="#fff" strokeWidth="1.2" strokeOpacity="0.35">
        {layers[0].ys.map((y1) =>
          layers[1].ys.map((y2) => (
            <line
              key={`a${y1}-${y2}`}
              x1={layers[0].x}
              y1={y1}
              x2={layers[1].x}
              y2={y2}
            />
          )),
        )}
        {layers[1].ys.map((y1) =>
          layers[2].ys.map((y2) => (
            <line
              key={`b${y1}-${y2}`}
              x1={layers[1].x}
              y1={y1}
              x2={layers[2].x}
              y2={y2}
            />
          )),
        )}
      </g>

      {/* nodes */}
      {layers.map((layer, li) =>
        layer.ys.map((y) => (
          <g key={`n${li}-${y}`}>
            <circle cx={layer.x} cy={y} r="11" fill="#fff" fillOpacity="0.18" />
            <circle
              cx={layer.x}
              cy={y}
              r="7"
              fill="#fff"
              fillOpacity={li === 2 ? 0.95 : 0.75}
            />
          </g>
        )),
      )}
    </svg>
  );
}

/* ── Backend Development ────────────────────────────────────────────────── */
function BackendArt() {
  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id="bka-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>
        <radialGradient id="bka-glow" cx="0.3" cy="0.25" r="0.7">
          <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#A7F3D0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="200" fill="url(#bka-bg)" />
      <rect width="320" height="200" fill="url(#bka-glow)" />

      {/* database stack */}
      <g stroke="#fff" strokeOpacity="0.9" strokeWidth="2.5" fill="#fff" fillOpacity="0.13">
        <ellipse cx="92" cy="56" rx="46" ry="16" />
        <path d="M46 56 V88 C46 97 66 104 92 104 C118 104 138 97 138 88 V56" />
        <path d="M46 88 V120 C46 129 66 136 92 136 C118 136 138 129 138 120 V88" />
        <path d="M46 120 V150 C46 159 66 166 92 166 C118 166 138 159 138 150 V120" />
      </g>
      <g fill="#fff" fillOpacity="0.85">
        <circle cx="60" cy="88" r="3" />
        <circle cx="60" cy="120" r="3" />
        <circle cx="60" cy="150" r="3" />
      </g>

      {/* API brackets + endpoints */}
      <g stroke="#fff" strokeOpacity="0.75" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M206 68 C196 68 196 92 186 100 C196 108 196 132 206 132" />
        <path d="M266 68 C276 68 276 92 286 100 C276 108 276 132 266 132" />
      </g>
      <g fill="#fff">
        <rect x="212" y="84" width="48" height="7" rx="3.5" fillOpacity="0.85" />
        <rect x="212" y="98" width="36" height="7" rx="3.5" fillOpacity="0.5" />
        <rect x="212" y="112" width="44" height="7" rx="3.5" fillOpacity="0.3" />
      </g>
      <path
        d="M140 100 H182"
        stroke="#fff"
        strokeOpacity="0.6"
        strokeWidth="2"
        strokeDasharray="4 5"
      />
    </svg>
  );
}

/* ── Frontend Development ───────────────────────────────────────────────── */
function FrontendArt() {
  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id="fra-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#831843" />
        </linearGradient>
        <radialGradient id="fra-glow" cx="0.3" cy="0.2" r="0.75">
          <stop offset="0%" stopColor="#FBCFE8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FBCFE8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="200" fill="url(#fra-bg)" />
      <rect width="320" height="200" fill="url(#fra-glow)" />

      {/* desktop frame */}
      <rect
        x="36"
        y="40"
        width="164"
        height="112"
        rx="9"
        fill="#fff"
        fillOpacity="0.13"
        stroke="#fff"
        strokeOpacity="0.85"
        strokeWidth="2"
      />
      <g fill="#fff">
        <rect x="50" y="56" width="52" height="30" rx="5" fillOpacity="0.55" />
        <rect x="110" y="56" width="76" height="8" rx="4" fillOpacity="0.7" />
        <rect x="110" y="70" width="60" height="8" rx="4" fillOpacity="0.4" />
        <rect x="50" y="98" width="136" height="8" rx="4" fillOpacity="0.35" />
        <rect x="50" y="112" width="104" height="8" rx="4" fillOpacity="0.22" />
        <rect x="50" y="126" width="64" height="10" rx="5" fillOpacity="0.75" />
      </g>
      <path d="M104 152 V162 M132 152 V162 M92 166 H144" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />

      {/* phone frame overlapping */}
      <rect
        x="216"
        y="52"
        width="62"
        height="112"
        rx="12"
        fill="#fff"
        fillOpacity="0.16"
        stroke="#fff"
        strokeOpacity="0.9"
        strokeWidth="2"
      />
      <g fill="#fff">
        <rect x="236" y="60" width="22" height="4" rx="2" fillOpacity="0.6" />
        <rect x="226" y="76" width="42" height="24" rx="4" fillOpacity="0.5" />
        <rect x="226" y="108" width="42" height="6" rx="3" fillOpacity="0.4" />
        <rect x="226" y="120" width="30" height="6" rx="3" fillOpacity="0.25" />
        <rect x="226" y="138" width="42" height="9" rx="4.5" fillOpacity="0.75" />
      </g>
    </svg>
  );
}

/* ── Prompt Engineering ─────────────────────────────────────────────────── */
function PromptEngineeringArt() {
  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id="pea-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <radialGradient id="pea-glow" cx="0.7" cy="0.25" r="0.7">
          <stop offset="0%" stopColor="#EDE9FE" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="200" fill="url(#pea-bg)" />
      <rect width="320" height="200" fill="url(#pea-glow)" />

      {/* incoming prompt bubble */}
      <path
        d="M34 44 H166 A10 10 0 0 1 176 54 V100 A10 10 0 0 1 166 110 H62 L44 128 V110 H34 A10 10 0 0 1 24 100 V54 A10 10 0 0 1 34 44 Z"
        fill="#fff"
        fillOpacity="0.16"
        stroke="#fff"
        strokeOpacity="0.85"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <g fill="#fff">
        <rect x="42" y="62" width="104" height="8" rx="4" fillOpacity="0.75" />
        <rect x="42" y="78" width="80" height="8" rx="4" fillOpacity="0.45" />
        <rect x="42" y="94" width="58" height="8" rx="4" fillOpacity="0.28" />
      </g>

      {/* response bubble */}
      <path
        d="M196 92 H286 A10 10 0 0 1 296 102 V142 A10 10 0 0 1 286 152 H216 L200 168 V152 H196 A10 10 0 0 1 186 142 V102 A10 10 0 0 1 196 92 Z"
        fill="#fff"
        fillOpacity="0.24"
        stroke="#fff"
        strokeOpacity="0.9"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <g fill="#fff">
        <rect x="202" y="108" width="72" height="7" rx="3.5" fillOpacity="0.85" />
        <rect x="202" y="122" width="56" height="7" rx="3.5" fillOpacity="0.55" />
        <rect x="202" y="136" width="38" height="7" rx="3.5" fillOpacity="0.35" />
      </g>

      {/* sparkles */}
      <g fill="#fff">
        <path d="M232 34 L237 50 L253 55 L237 60 L232 76 L227 60 L211 55 L227 50 Z" fillOpacity="0.9" />
        <path d="M282 54 L285 63 L294 66 L285 69 L282 78 L279 69 L270 66 L279 63 Z" fillOpacity="0.55" />
      </g>
    </svg>
  );
}

/* ── Fallback ───────────────────────────────────────────────────────────── */
function DefaultArt() {
  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id="dfa-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#5C4409" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#dfa-bg)" />
      <g stroke="#fff" strokeOpacity="0.5" fill="none" strokeWidth="2">
        <rect x="96" y="60" width="128" height="80" rx="8" />
        <path d="M96 84 H224" />
      </g>
      <g fill="#fff" fillOpacity="0.6">
        <rect x="112" y="98" width="60" height="8" rx="4" />
        <rect x="112" y="114" width="90" height="8" rx="4" />
      </g>
    </svg>
  );
}

const ARTWORK: Record<string, () => React.JSX.Element> = {
  "fullstack-development": FullStackArt,
  "ethical-hacking-fundamentals": EthicalHackingArt,
  "machine-learning-foundations": MachineLearningArt,
  "backend-development": BackendArt,
  "frontend-development": FrontendArt,
  "prompt-engineering": PromptEngineeringArt,
};

export function CourseArtwork({ slug }: { slug: string }) {
  const Art = ARTWORK[slug] ?? DefaultArt;
  return <Art />;
}
