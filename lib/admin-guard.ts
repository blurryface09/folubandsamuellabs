import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function requireAdmin(): Promise<{ userId: string } | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { isPlatformAdmin: true },
  });

  if (!user?.isPlatformAdmin) {
    return null;
  }

  return { userId: session.user.id };
}
