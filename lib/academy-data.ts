/**
 * Read-only Academy data layer.
 * Single source of truth for curriculum structure.
 * Does NOT handle demo session state or progress mutation.
 */

import academy from "./academy.json";

export interface Lesson {
  id: string;
  title: string;
  order: number;
}

export interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface CourseData {
  id: string;
  n: string;
  title: string;
  tag: string;
  desc: string;
  price: number;
  originalPrice: number;
  topics: string[];
  featured: boolean;
  onPoster: boolean;
  modules?: Module[];
}

/**
 * Demo curriculum structure.
 * Maps courses to their modules and lessons.
 * This is mock/demo content only.
 */
const demoModules: Record<string, Module[]> = {
  "cyber-security": [
    {
      id: "m-1",
      title: "Networking Fundamentals",
      order: 1,
      lessons: [
        { id: "l-1", title: "OSI Model & Layers", order: 1 },
        { id: "l-2", title: "IP Addressing & Subnetting", order: 2 },
        { id: "l-3", title: "DNS & Domain Names", order: 3 },
        { id: "l-4", title: "TCP/UDP Protocols", order: 4 },
        { id: "l-5", title: "Firewalls & NAT", order: 5 },
        { id: "l-6", title: "Practice Challenge", order: 6 },
      ],
    },
    {
      id: "m-2",
      title: "Linux & CLI Basics",
      order: 2,
      lessons: [
        { id: "l-7", title: "Linux OS Overview", order: 1 },
        { id: "l-8", title: "File System Navigation", order: 2 },
        { id: "l-9", title: "User Management", order: 3 },
        { id: "l-10", title: "Permissions & Ownership", order: 4 },
        { id: "l-11", title: "Practice Environment", order: 5 },
      ],
    },
    {
      id: "m-3",
      title: "Vulnerability Assessment",
      order: 3,
      lessons: [
        { id: "l-12", title: "Nmap & Scanning", order: 1 },
        { id: "l-13", title: "Web Application Testing", order: 2 },
        { id: "l-14", title: "Metasploit Basics", order: 3 },
      ],
    },
  ],
  frontend: [
    {
      id: "m-1",
      title: "HTML5 & CSS3",
      order: 1,
      lessons: [
        { id: "l-1", title: "HTML Fundamentals", order: 1 },
        { id: "l-2", title: "CSS Selectors & Styling", order: 2 },
        { id: "l-3", title: "Flexbox Layout", order: 3 },
        { id: "l-4", title: "Grid Layout", order: 4 },
        { id: "l-5", title: "Responsive Design", order: 5 },
        { id: "l-6", title: "Practice Project", order: 6 },
      ],
    },
    {
      id: "m-2",
      title: "JavaScript Essentials",
      order: 2,
      lessons: [
        { id: "l-7", title: "Variables & Data Types", order: 1 },
        { id: "l-8", title: "Functions & Scope", order: 2 },
        { id: "l-9", title: "DOM Manipulation", order: 3 },
        { id: "l-10", title: "Events & Handlers", order: 4 },
      ],
    },
    {
      id: "m-3",
      title: "React Fundamentals",
      order: 3,
      lessons: [
        { id: "l-11", title: "Components & JSX", order: 1 },
        { id: "l-12", title: "Props & State", order: 2 },
        { id: "l-13", title: "Hooks Basics", order: 3 },
      ],
    },
  ],
  backend: [
    {\n      id: "m-1",
      title: "Node.js & Express",
      order: 1,
      lessons: [
        { id: "l-1", title: "Node.js Runtime", order: 1 },
        { id: "l-2", title: "NPM & Dependencies", order: 2 },
        { id: "l-3", title: "Express Basics", order: 3 },
        { id: "l-4", title: "Routing", order: 4 },
        { id: "l-5", title: "Middleware", order: 5 },
      ],
    },
    {
      id: "m-2",
      title: "Databases & SQL",
      order: 2,
      lessons: [
        { id: "l-6", title: "SQL Basics", order: 1 },
        { id: "l-7", title: "Relational Design", order: 2 },
        { id: "l-8", title: "MongoDB Intro", order: 3 },
      ],
    },
  ],
  fullstack: [
    {
      id: "m-1",
      title: "Full-Stack Setup",
      order: 1,
      lessons: [
        { id: "l-1", title: "Project Structure", order: 1 },
        { id: "l-2", title: "Environment Setup", order: 2 },
        { id: "l-3", title: "Git & Version Control", order: 3 },
      ],
    },
    {
      id: "m-2",
      title: "Frontend Mastery",
      order: 2,
      lessons: [
        { id: "l-4", title: "React Components", order: 1 },
        { id: "l-5", title: "State Management", order: 2 },
        { id: "l-6", title: "API Integration", order: 3 },
        { id: "l-7", title: "Authentication Flow", order: 4 },
      ],
    },
    {
      id: "m-3",
      title: "Backend Architecture",
      order: 3,
      lessons: [
        { id: "l-8", title: "API Design", order: 1 },
        { id: "l-9", title: "Database Schema", order: 2 },
        { id: "l-10", title: "Auth & Security", order: 3 },
      ],
    },
  ],
};

/**
 * Get all courses from academy.json
 */
export function getAllCourses(): CourseData[] {
  return academy.courses as CourseData[];
}

/**
 * Get a single course by ID
 */
export function getCourse(courseId: string): CourseData | undefined {
  const course = academy.courses.find((c: any) => c.id === courseId) as CourseData | undefined;
  if (!course) return undefined;

  // Attach demo modules
  return {
    ...course,
    modules: demoModules[courseId] || [],
  };
}

/**
 * Get a specific module within a course
 */
export function getModule(courseId: string, moduleId: string): Module | undefined {
  const course = getCourse(courseId);
  if (!course?.modules) return undefined;
  return course.modules.find((m) => m.id === moduleId);
}

/**
 * Get a specific lesson within a module
 */
export function getLesson(
  courseId: string,
  moduleId: string,
  lessonId: string
): Lesson | undefined {
  const module = getModule(courseId, moduleId);
  if (!module) return undefined;
  return module.lessons.find((l) => l.id === lessonId);
}

/**
 * Get all modules in a course
 */
export function getModules(courseId: string): Module[] {
  const course = getCourse(courseId);
  return course?.modules || [];
}

/**
 * Get all lessons in a module
 */
export function getLessons(courseId: string, moduleId: string): Lesson[] {
  const module = getModule(courseId, moduleId);
  return module?.lessons || [];
}

/**
 * Calculate course progress from lesson completion state.
 * Receives completed lesson IDs to avoid hardcoded progress.
 */
export function calculateCourseProgress(
  courseId: string,
  completedLessonIds: Set<string>
): number {
  const course = getCourse(courseId);
  if (!course?.modules || course.modules.length === 0) return 0;

  let totalLessons = 0;
  let completedCount = 0;

  course.modules.forEach((module) => {
    module.lessons.forEach((lesson) => {
      totalLessons++;
      if (completedLessonIds.has(lesson.id)) {
        completedCount++;
      }
    });
  });

  if (totalLessons === 0) return 0;
  return Math.round((completedCount / totalLessons) * 100);
}

/**
 * Calculate module progress from lesson completion state.
 */
export function calculateModuleProgress(
  courseId: string,
  moduleId: string,
  completedLessonIds: Set<string>
): number {
  const module = getModule(courseId, moduleId);
  if (!module || module.lessons.length === 0) return 0;

  const completedCount = module.lessons.filter((l) => completedLessonIds.has(l.id)).length;
  return Math.round((completedCount / module.lessons.length) * 100);
}

/**
 * Count total lessons in a course
 */
export function getTotalLessonCount(courseId: string): number {
  const course = getCourse(courseId);
  if (!course?.modules) return 0;
  return course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
}

/**
 * Count completed lessons in a course
 */
export function getCompletedLessonCount(
  courseId: string,
  completedLessonIds: Set<string>
): number {
  const course = getCourse(courseId);
  if (!course?.modules) return 0;

  let count = 0;
  course.modules.forEach((module) => {
    module.lessons.forEach((lesson) => {
      if (completedLessonIds.has(lesson.id)) {
        count++;
      }
    });
  });
  return count;
}
