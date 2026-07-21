/* Navy banner that opens every interior page. Doubles as the dark backdrop
   the fixed, transparent nav needs to stay legible before the user scrolls. */
export function FolubPageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#16283A] text-[#EFE9DC]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          background:
            "radial-gradient(100% 120% at 85% -20%, rgba(198,162,74,0.18), transparent 55%), linear-gradient(180deg, #16283A, #213A54)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#C6A24A 1px, transparent 1px), linear-gradient(90deg, #C6A24A 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-32 md:pt-40">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D9BE7C]">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display mt-4 max-w-[18ch] text-4xl font-medium leading-[1.06] md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#C7CFD8] md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
