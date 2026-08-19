import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/academy/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { isPlatformAdmin: true },
  });

  if (!user?.isPlatformAdmin) {
    redirect("/academy/dashboard");
  }

  const navItems = [
    { href: "/academy/admin", label: "Overview" },
    { href: "/academy/admin/content", label: "Content" },
    { href: "/academy/admin/submissions", label: "Submissions" },
    { href: "/academy/admin/announcements", label: "Announcements" },
  ];

  return (
    <div style={{ background: "#050505", color: "#F5F0E8", minHeight: "100vh", padding: "132px 28px 60px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontFamily: "var(--font-roboto-mono)", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(201,168,76,0.8)", marginBottom: 12 }}>
            Academy Admin
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "8px 16px",
                  background: "rgba(201,168,76,0.08)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: 6,
                  color: "#C9A84C",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
