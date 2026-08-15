import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getOrCreateProfile() {
  const user = await currentUser();
  if (!user) return null;

  const existing = await db
    .select()
    .from(profiles)
    .where(eq(profiles.clerkUserId, user.id))
    .limit(1);

  if (existing[0]) return existing[0];

  const totalProfiles = await db.select().from(profiles);
  const isFirstUser = totalProfiles.length === 0;

  const displayName =
    user.username ||
    user.firstName ||
    user.emailAddresses[0]?.emailAddress?.split("@")[0] ||
    "vibe-newcomer";

  const [created] = await db
    .insert(profiles)
    .values({
      clerkUserId: user.id,
      displayName,
      avatarUrl: user.imageUrl,
      isAdmin: isFirstUser ? 1 : 0,
    })
    .returning();

  return created;
}
