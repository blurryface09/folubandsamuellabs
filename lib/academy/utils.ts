export function formatPrice(price: number, currency: string = "NGN"): string {
  if (currency === "NGN") {
    return `₦${price.toLocaleString("en-NG")}`;
  }
  return `${price.toLocaleString()}`;
}

export function calculateDiscountedPrice(
  price: number,
  discount: number
): number {
  return Math.round(price * (1 - discount / 100));
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}

export function calculateCourseProgress(
  completedLessons: number,
  totalLessons: number
): number {
  if (totalLessons === 0) return 0;
  return Math.round((completedLessons / totalLessons) * 100);
}

export function getTotalCourseDuration(minutes: number): { hours: number; mins: number } {
  return {
    hours: Math.floor(minutes / 60),
    mins: minutes % 60,
  };
}

export function getStudentCountLabel(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K students`;
  }
  return `${count} students`;
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return "#10B981"; // green
  if (rating >= 4.0) return "#3B82F6"; // blue
  if (rating >= 3.5) return "#F59E0B"; // amber
  return "#EF4444"; // red
}
