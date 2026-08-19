import { db } from "@/lib/db";
import { mockCourses } from "@/lib/academy/mock-data";

async function main() {
  console.log("🌱 Seeding modules and lessons...");

  for (const course of mockCourses) {
    for (const module of course.modules) {
      const moduleId = `${course.id}-${module.id}`;

      await db.module.upsert({
        where: { id: moduleId },
        update: {
          title: module.title,
          order: module.order,
        },
        create: {
          id: moduleId,
          courseId: course.id,
          title: module.title,
          order: module.order,
          // Existing content was already publicly visible before this
          // migration — publish it so nothing regresses for students.
          isPublished: true,
          publishedAt: new Date(),
        },
      });

      for (const lesson of module.lessons) {
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

      console.log(`✓ ${course.title} — ${module.title} (${module.lessons.length} lessons)`);
    }
  }

  console.log("✅ Module/lesson seeding complete.");
  await db.$disconnect();
}

main();
