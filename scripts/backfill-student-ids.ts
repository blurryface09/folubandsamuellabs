import { db } from "@/lib/db";
import { generateStudentId } from "@/lib/academy/student-id";

async function main() {
  const users = await db.user.findMany({
    where: {
      OR: [{ studentId: null }, { studentId: { not: { startsWith: "FSLA-" } } }],
    },
    select: { id: true, email: true },
  });

  console.log(`Found ${users.length} user(s) needing a student ID.`);

  for (const user of users) {
    const studentId = await generateStudentId();
    await db.user.update({ where: { id: user.id }, data: { studentId } });
    console.log(`✓ ${user.email} -> ${studentId}`);
  }

  console.log("✅ Backfill complete.");
  await db.$disconnect();
}

main();
