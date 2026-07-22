/*
 * FOLUB Builders logo — a faithful SVG recreation of the F + B house monogram
 * (navy F, gold B, peaked roof, gold window). Vector so it stays crisp at any
 * size. The standalone artwork also lives at /public/folub-logo.svg. If FOLUB
 * later supplies an official file, drop it in and swap FolubMark for an <Image>.
 */

type Tone = "onLight" | "onDark";

export function FolubMark({
  size = 44,
  tone = "onLight",
}: {
  size?: number;
  tone?: Tone;
}) {
  // The "cut" is the negative space inside the letters — it reads as the
  // background. On navy grounds the left slab flips to cream so it stays visible.
  const cut = tone === "onDark" ? "#16283A" : "#F7F4EE";
  const left = tone === "onDark" ? "#EDE7DA" : "#213A54";
  const gold = "#C6A24A";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* left slab — F */}
      <path d="M14 45 L48 21 L48 64 L41 86 L14 86 Z" fill={left} />
      <path d="M22 45 h20 v6 h-13 v6.5 h11 v6 h-11 v13 h-7 Z" fill={cut} />
      {/* right slab — B */}
      <path d="M52 21 L86 45 L86 86 L59 86 L52 64 Z" fill={gold} />
      <path
        d="M60 45 h10.5 a7.5 7.5 0 0 1 4.6 13 a7.8 7.8 0 0 1 -4.6 14 H60 Z M66.5 50.5 v7 h4 a3.5 3.5 0 0 0 0 -7 Z M66.5 63.5 v8 h4.2 a4 4 0 0 0 0 -8 Z"
        fill={cut}
        fillRule="evenodd"
      />
      {/* window */}
      <g fill={gold}>
        <rect x="45.5" y="72" width="4.2" height="4.2" />
        <rect x="50.3" y="72" width="4.2" height="4.2" />
        <rect x="45.5" y="76.8" width="4.2" height="4.2" />
        <rect x="50.3" y="76.8" width="4.2" height="4.2" />
      </g>
    </svg>
  );
}

export function FolubLockup({
  size = 44,
  tone = "onLight",
  stacked = false,
}: {
  size?: number;
  tone?: Tone;
  stacked?: boolean;
}) {
  const name = tone === "onDark" ? "#F3ECDD" : "#213A54";
  const sub = tone === "onDark" ? "#D9BE7C" : "#A9863A";
  return (
    <span
      className={
        stacked
          ? "inline-flex flex-col items-center gap-2"
          : "inline-flex items-center gap-3"
      }
    >
      <FolubMark size={size} tone={tone} />
      <span className="flex flex-col leading-none">
        <span
          className="font-semibold tracking-[0.18em]"
          style={{ color: name, fontSize: size * 0.44 }}
        >
          FOLUB
        </span>
        <span
          className="mt-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.42em]"
          style={{ color: sub }}
        >
          Builders
        </span>
      </span>
    </span>
  );
}
