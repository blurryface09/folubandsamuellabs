import { db } from "@/lib/db";

function randomStudentId() {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `FSLA-${digits}`;
}

export async function generateStudentId(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = randomStudentId();
    const existing = await db.user.findUnique({
      where: { studentId: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }
  }

  throw new Error("Could not generate a unique student ID after 10 attempts");
}
