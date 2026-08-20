import Link from "next/link";

const cards = [
  {
    href: "/academy/admin/students",
    title: "Students",
    description: "See every registered student, their student ID, and what they're enrolled in.",
  },
  {
    href: "/academy/admin/content",
    title: "Content",
    description: "Manage weeks, lessons, assignments, and exams for each course. Publish or unpublish content.",
  },
  {
    href: "/academy/admin/submissions",
    title: "Submissions",
    description: "Review and grade assignment/classwork submissions from students.",
  },
  {
    href: "/academy/admin/announcements",
    title: "Announcements",
    description: "Post updates that appear on every student's dashboard.",
  },
];

export default function AdminOverviewPage() {
  return (
    <div>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 32 }}>Overview</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            style={{
              display: "block",
              padding: 24,
              background: "#0A0A0A",
              border: "1px solid rgba(201,168,76,0.1)",
              borderRadius: 12,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#C9A84C", marginBottom: 10 }}>{card.title}</h3>
            <p style={{ fontSize: 13, color: "rgba(245,240,232,0.6)", lineHeight: 1.6 }}>{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
