import { db } from "@/lib/db";
import { mockCourses } from "@/lib/academy/mock-data";

async function main() {
  console.log("🌱 Seeding modules and lessons...");

  for (const course of mockCourses) {
    for (const mod of course.modules) {
      const moduleId = `${course.id}-${mod.id}`;

      await db.module.upsert({
        where: { id: moduleId },
        update: {
          title: mod.title,
          order: mod.order,
        },
        create: {
          id: moduleId,
          courseId: course.id,
          title: mod.title,
          order: mod.order,
          // Existing content was already publicly visible before this
          // migration — publish it so nothing regresses for students.
          isPublished: true,
          publishedAt: new Date(),
        },
      });

      for (const lesson of mod.lessons) {
        const lessonId = `${course.id}-${lesson.id}`;

        await db.lesson.upsert({
          where: { id: lessonId },
          update: {
            title: lesson.title,
            order: lesson.order,
            durationMins: lesson.duration,
          },
          create: {
            id: lessonId,
            moduleId,
            title: lesson.title,
            order: lesson.order,
            durationMins: lesson.duration,
          },
        });
      }

      console.log(`✓ ${course.title} — ${mod.title} (${mod.lessons.length} lessons)`);
    }
  }

  console.log("✅ Module/lesson seeding complete.");
  await db.$disconnect();
}

main();
