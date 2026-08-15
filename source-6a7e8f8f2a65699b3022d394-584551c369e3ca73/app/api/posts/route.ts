import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts, profiles, categories } from "@/db/schema";
import { getOrCreateProfile } from "@/lib/profile";
import { desc, eq } from "drizzle-orm";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const categorySlug = url.searchParams.get("category");

  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      body: posts.body,
      videoUrl: posts.videoUrl,
      ogTitle: posts.ogTitle,
      ogImage: posts.ogImage,
      createdAt: posts.createdAt,
      authorId: posts.authorId,
      authorName: profiles.displayName,
      authorAvatar: profiles.avatarUrl,
      categoryId: posts.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(posts)
    .innerJoin(profiles, eq(posts.authorId, profiles.id))
    .innerJoin(categories, eq(posts.categoryId, categories.id))
    .orderBy(desc(posts.createdAt));

  const filtered = categorySlug
    ? rows.filter((r) => r.categorySlug === categorySlug)
    : rows;

  return NextResponse.json(filtered);
}

export async function POST(req: Request) {
  const profile = await getOrCreateProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in to post." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const title = body?.title?.toString().trim();
  const text = body?.body?.toString().trim() || "";
  const videoUrl = body?.videoUrl?.toString().trim() || null;
  const ogTitle = body?.ogTitle?.toString().trim() || null;
  const ogImage = body?.ogImage?.toString().trim() || null;
  const categoryId = Number(body?.categoryId);

  if (!title || title.length > 140) {
    return NextResponse.json({ error: "Give your post a title under 140 characters." }, { status: 400 });
  }
  if (!categoryId || Number.isNaN(categoryId)) {
    return NextResponse.json({ error: "Pick a room for this post." }, { status: 400 });
  }
  if (videoUrl && videoUrl.length > 2048) {
    return NextResponse.json({ error: "That link is too long." }, { status: 400 });
  }

  const [created] = await db
    .insert(posts)
    .values({
      title,
      body: text,
      videoUrl,
      ogTitle,
      ogImage,
      categoryId,
      authorId: profile.id,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
