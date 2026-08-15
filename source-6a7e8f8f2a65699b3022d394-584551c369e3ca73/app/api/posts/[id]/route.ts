import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { getOrCreateProfile } from "@/lib/profile";
import { eq } from "drizzle-orm";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const profile = await getOrCreateProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { id } = await params;
  const postId = Number(id);
  const [existing] = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
  if (existing.authorId !== profile.id && !profile.isAdmin) {
    return NextResponse.json({ error: "You can't remove this post." }, { status: 403 });
  }

  await db.delete(posts).where(eq(posts.id, postId));
  return NextResponse.json({ ok: true });
}
