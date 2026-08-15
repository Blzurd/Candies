import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getOrCreateProfile } from "@/lib/profile";
import { asc } from "drizzle-orm";

export async function GET() {
  const rows = await db.select().from(categories).orderBy(asc(categories.id));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const profile = await getOrCreateProfile();
  if (!profile || !profile.isAdmin) {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const name = body?.name?.toString().trim();
  const emoji = body?.emoji?.toString().trim() || "✨";
  const description = body?.description?.toString().trim() || null;

  if (!name || name.length > 40) {
    return NextResponse.json({ error: "Give it a name under 40 characters." }, { status: 400 });
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 50) || `room-${Date.now()}`;

  const [created] = await db
    .insert(categories)
    .values({ name, slug, description, emoji })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
