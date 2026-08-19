import Link from "next/link";
import Image from "next/image";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-10 sm:py-16" style={{ color: "#F5F0E8" }}>
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <Link className="mb-8 flex items-center gap-3 self-center" href="/" style={{ color: "#F5F0E8" }}>
          <Image
            src="/logo.png"
            alt="Folub & Samuel Labs"
            width={68}
            height={68}
            priority
          />
          <span>
            <span className="block text-base font-bold" style={{ fontFamily: "'Poppins', 'Avenir', sans-serif", letterSpacing: "-0.01em" }}>Folub &amp; Samuel Labs</span>
            <span className="block text-xs" style={{ color: "rgba(245,240,232,0.5)", fontFamily: "'Poppins', 'Avenir', sans-serif", letterSpacing: "0.05em" }}>FSLabs Academy</span>
          </span>
        </Link>
        <div className="rounded-2xl border p-6 sm:p-8" style={{ background: "#0A0A0A", borderColor: "rgba(201,168,76,0.1)" }}>
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "rgba(201,168,76,0.6)" }}>
              {eyebrow}
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-normal">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-6" style={{ color: "rgba(245,240,232,0.6)" }}>{description}</p>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
