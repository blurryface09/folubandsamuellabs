export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  currency: string;
  instructor: {
    name: string;
    title: string;
    imageUrl: string;
    bio?: string;
  };
  rating: number;
  reviewCount: number;
  studentCount: number;
  duration: number; // minutes
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  topics: string[];
  modules: Module[];
  whatYouLearn: string[];
  requirements?: string[];
  includes: {
    videos: number; // hours
    projects: number;
    certificate: boolean;
    lifetime: boolean;
  };
  featured?: boolean;
  discount?: number; // percentage
}

export interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  order: number;
  duration: number; // minutes
  videoUrl?: string;
  content?: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  status: "active" | "completed" | "dropped";
  progress: number; // 0-100
  enrolledAt: Date;
  completedAt?: Date;
  lastAccessedAt?: Date;
}

export interface StudentProgress {
  enrollmentId: string;
  lessonId: string;
  completedAt?: Date;
  score?: number;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  issuedAt: Date;
  credentialId: string;
  pdfUrl?: string;
}
