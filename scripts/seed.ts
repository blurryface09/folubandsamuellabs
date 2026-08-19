import { db } from "@/lib/db";
import { mockCourses } from "@/lib/academy/mock-data";

const ACADEMY_ORG_SLUG = "fslabs-academy";
const ACADEMY_INSTRUCTOR_EMAIL = "academy@fslabs.tech";

async function main() {
  console.log("🌱 Seeding database with courses...");

  try {
    const organization = await db.organization.upsert({
      where: { slug: ACADEMY_ORG_SLUG },
      update: {},
      create: {
        name: "FSLabs Academy",
        slug: ACADEMY_ORG_SLUG,
      },
    });

    const instructor = await db.user.upsert({
      where: { email: ACADEMY_INSTRUCTOR_EMAIL },
      update: {},
      create: {
        email: ACADEMY_INSTRUCTOR_EMAIL,
        name: "FSLabs Academy",
      },
    });

    for (const course of mockCourses) {
      await db.course.upsert({
        where: { id: course.id },
        update: {
          title: course.title,
          slug: course.slug,
          description: course.description,
          pricing: course.price,
          isPublished: true,
        },
        create: {
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          pricing: course.price,
          currency: "NGN",
          isPublished: true,
          organizationId: organization.id,
          instructorId: instructor.id,
        },
      });

      console.log(`✓ Upserted: ${course.title}`);
    }

    console.log("✅ Database seeding completed!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();
