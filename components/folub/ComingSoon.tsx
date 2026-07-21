import Link from "next/link";

/* Shown wherever real listings don't exist yet, so the site never displays
   invented properties. Invites the visitor to register interest instead. */
export function ComingSoon({
  title = "New listings, coming soon.",
  message = "We're preparing our next set of homes and developments. Register your interest and we'll reach out the moment something becomes available.",
  ctaLabel = "Register your interest",
  ctaHref = "/folub/contact",
}: {
  title?: string;
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="rounded-xl border border-[#E2DCD0] bg-white px-6 py-16 text-center">
      <span
        aria-hidden="true"
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EFEAE0] text-2xl text-[#C6A24A]"
      >
        ◆
      </span>
      <h3 className="font-display mt-6 text-2xl text-[#213A54] md:text-3xl">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-[#6E6A5F]">{message}</p>
      <Link
        href={ctaHref}
        className="mt-7 inline-block rounded bg-[#C6A24A] px-6 py-3.5 text-sm font-semibold text-[#16283A] transition-colors hover:bg-[#D9BE7C]"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
