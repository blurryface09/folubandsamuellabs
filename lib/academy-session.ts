/**
 * Lightweight demo session state management.
 * In-memory only. No database, no Prisma.
 * Progress is NOT persisted.
 */

// Demo student info
export interface DemoStudent {
  id: string;
  name: string;
  email: string;
}

// Demo session state (in-memory)
const demoStudent: DemoStudent = {
  id: "demo-student-001",
  name: "Demo Learner",
  email: "demo@fslabs.tech",
};

// Completed lessons: Set<lessonId>
// Format: "courseId:moduleId:lessonId"
let completedLessons = new Set<string>([
  "cyber-security:m-1:l-1",
  "cyber-security:m-1:l-2",
  "cyber-security:m-1:l-3",
  "fullstack:m-1:l-1",
  "fullstack:m-1:l-2",
  "fullstack:m-2:l-4",
  "fullstack:m-2:l-5",
  "fullstack:m-2:l-6",
  "frontend:m-1:l-1",
  "backend:m-1:l-1",
  "backend:m-1:l-2",
  "backend:m-1:l-3",
  "backend:m-1:l-4",
  "backend:m-1:l-5",
  "backend:m-2:l-6",
  "backend:m-2:l-7",
  "backend:m-2:l-8",
]);

// Enrolled course IDs
const enrolledCourseIds = new Set(["cyber-security", "fullstack", "frontend", "backend"]);

/**
 * Get the demo student
 */
export function getDemoStudent(): DemoStudent {
  return { ...demoStudent };
}

/**
 * Get all enrolled course IDs
 */
export function getEnrolledCourses(): string[] {
  return Array.from(enrolledCourseIds);
}

/**
 * Check if student is enrolled in a course
 */
export function isEnrolledInCourse(courseId: string): boolean {
  return enrolledCourseIds.has(courseId);
}

/**
 * Get current demo progress (completed lesson IDs)
 */
export function getDemoProgress(): Set<string> {
  return new Set(completedLessons);
}

/**
 * Check if a specific lesson is completed
 */
export function isDemoLessonComplete(
  courseId: string,
  moduleId: string,
  lessonId: string
): boolean {
  const key = `${courseId}:${moduleId}:${lessonId}`;
  return completedLessons.has(key);
}

/**
 * Mark a lesson as complete or incomplete
 * This updates the in-memory demo state only.
 */
export function updateDemoProgress(
  courseId: string,
  moduleId: string,
  lessonId: string,
  completed: boolean
): void {
  const key = `${courseId}:${moduleId}:${lessonId}`;

  if (completed) {
    completedLessons.add(key);
  } else {
    completedLessons.delete(key);
  }
}

/**
 * Get count of completed lessons across all enrolled courses
 */
export function getCompletedLessonCount(): number {
  return completedLessons.size;
}

/**
 * Reset demo progress (for testing)
 */
export function resetDemoProgress(): void {
  completedLessons.clear();
}
