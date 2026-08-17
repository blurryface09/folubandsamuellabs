/**
 * Shared lesson access control rules.
 * Single source of truth for lesson locking logic.
 * Used by: ModuleTree, Previous, Next, direct URL protection.
 */

import { getModule, getModules } from "./academy-data";
import { isEnrolledInCourse, isDemoLessonComplete } from "./academy-session";

/**
 * Determine if a student can access a specific lesson.
 *
 * Access rules:
 * 1. Student must be enrolled in the course
 * 2. All previous lessons in the module must be completed
 * 3. (Future: can extend with other rules)
 */
export function isLessonAccessible(
  courseId: string,
  moduleId: string,
  lessonId: string
): boolean {
  // Must be enrolled
  if (!isEnrolledInCourse(courseId)) {
    return false;
  }

  // Get the module
  const module = getModule(courseId, moduleId);
  if (!module) {
    return false;
  }

  // Find the lesson
  const lesson = module.lessons.find((l) => l.id === lessonId);
  if (!lesson) {
    return false;
  }

  // First lesson in module is always accessible if enrolled
  if (lesson.order === 1) {
    return true;
  }

  // For subsequent lessons: all prior lessons in this module must be completed
  const previousLessons = module.lessons.filter((l) => l.order < lesson.order);
  for (const prevLesson of previousLessons) {
    if (!isDemoLessonComplete(courseId, moduleId, prevLesson.id)) {
      return false;
    }
  }

  return true;
}

/**
 * Get all accessible lessons in a module for the demo student.
 */
export function getAccessibleLessons(courseId: string, moduleId: string): string[] {
  if (!isEnrolledInCourse(courseId)) {
    return [];
  }

  const module = getModule(courseId, moduleId);
  if (!module) {
    return [];
  }

  return module.lessons
    .filter((lesson) => isLessonAccessible(courseId, moduleId, lesson.id))
    .map((lesson) => lesson.id);
}

/**
 * Get the previous lesson in the module (if accessible).
 * Returns undefined if no accessible previous lesson exists.
 */
export function getPreviousAccessibleLesson(
  courseId: string,
  moduleId: string,
  currentLessonId: string
): string | undefined {
  const module = getModule(courseId, moduleId);
  if (!module) return undefined;

  const currentLesson = module.lessons.find((l) => l.id === currentLessonId);
  if (!currentLesson) return undefined;

  // Find all lessons with lower order
  const previousLessons = module.lessons
    .filter((l) => l.order < currentLesson.order)
    .sort((a, b) => b.order - a.order); // highest order first

  // Return the first accessible one (highest order < current)
  for (const lesson of previousLessons) {
    if (isLessonAccessible(courseId, moduleId, lesson.id)) {
      return lesson.id;
    }
  }

  return undefined;
}

/**
 * Get the next lesson in the module (if accessible).
 * Returns undefined if no accessible next lesson exists.
 */
export function getNextAccessibleLesson(
  courseId: string,
  moduleId: string,
  currentLessonId: string
): string | undefined {
  const module = getModule(courseId, moduleId);
  if (!module) return undefined;

  const currentLesson = module.lessons.find((l) => l.id === currentLessonId);
  if (!currentLesson) return undefined;

  // Find all lessons with higher order
  const nextLessons = module.lessons
    .filter((l) => l.order > currentLesson.order)
    .sort((a, b) => a.order - b.order); // lowest order first

  // Return the first accessible one
  for (const lesson of nextLessons) {
    if (isLessonAccessible(courseId, moduleId, lesson.id)) {
      return lesson.id;
    }
  }

  return undefined;
}

/**
 * Get accessible modules in a course.
 * A module is accessible if the student is enrolled and at least its first lesson is accessible.
 */
export function getAccessibleModules(courseId: string): string[] {
  if (!isEnrolledInCourse(courseId)) {
    return [];
  }

  const modules = getModules(courseId);
  return modules
    .filter((module) => {
      const firstLesson = module.lessons[0];
      return firstLesson && isLessonAccessible(courseId, module.id, firstLesson.id);
    })
    .map((module) => module.id);
}

/**
 * Protect direct lesson URL access.
 * If lesson is not accessible, redirect to the last accessible lesson in the module.
 * If no accessible lessons, redirect to module overview.
 */
export function getRedirectIfLocked(
  courseId: string,
  moduleId: string,
  lessonId: string
): string | null {
  // If accessible, return null (no redirect needed)
  if (isLessonAccessible(courseId, moduleId, lessonId)) {
    return null;
  }

  // Not accessible. Find the last accessible lesson in this module.
  const module = getModule(courseId, moduleId);
  if (!module) {
    return `/academy/dashboard/courses/${courseId}`;
  }

  // Sort by order descending to find the highest accessible lesson
  const accessibleLessons = module.lessons
    .filter((lesson) => isLessonAccessible(courseId, moduleId, lesson.id))
    .sort((a, b) => b.order - a.order);

  if (accessibleLessons.length > 0) {
    const lastAccessible = accessibleLessons[0];
    return `/academy/dashboard/courses/${courseId}/learn?module=${moduleId}&lesson=${lastAccessible.id}`;
  }

  // No accessible lessons in this module. Redirect to course.
  return `/academy/dashboard/courses/${courseId}`;
}
