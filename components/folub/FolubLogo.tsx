/*
 * FOLUB Builders logo.
 *
 * `FolubMark` is a hand-built stand-in for the house monogram (navy "F" +
 * gold "B" forming a roof, with a window grid). When the real artwork lands
 * at /public/folub-logo.svg (or .png), swap the SVG body here for an <Image>
 * and every placement across the site updates at once.
 */

type Tone = "onLight" | "onDark";

export function FolubMark({
  size = 44,
  tone = "onLight",
}: {
  size?: number;
  tone?: Tone;
}) {
  const window = tone === "onDark" ? "#16283A" : "#FFFFFF";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* left panel — navy "F" */}
      <path d="M14 26 32 12 32 55 14 55Z" fill="#213A54" />
      <path d="M21 30h7v3.4h-3.6v3.4h3.6v3.4h-3.6V55H21z" fill={window} />
      {/* right panel — gold "B" forming the roof */}
      <path d="M34 12 50 26V55H34Z" fill="#C6A24A" />
      <path
        d="M37.5 30h5.2a3.1 3.1 0 0 1 1.6 5.75 3.3 3.3 0 0 1-1.9 6.05H37.5Zm3.3 3.1v3h1.9a1.5 1.5 0 0 0 0-3Zm0 5.9v3.1h2.1a1.55 1.55 0 0 0 0-3.1Z"
        fill={window}
      />
      {/* window grid at the base */}
      <g fill="#C6A24A">
        <rect x="28.4" y="47.5" width="3" height="3" />
        <rect x="32.6" y="47.5" width="3" height="3" />
        <rect x="28.4" y="51.4" width="3" height="3" />
        <rect x="32.6" y="51.4" width="3" height="3" />
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
