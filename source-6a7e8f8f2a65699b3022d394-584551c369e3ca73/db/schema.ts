import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: serial().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  isAdmin: integer("is_admin").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial().primaryKey(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  emoji: text().default("✨"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial().primaryKey(),
  title: text().notNull(),
  body: text().default(""),
  videoUrl: text("video_url"),
  ogTitle: text("og_title"),
  ogImage: text("og_image"),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  authorId: integer("author_id").notNull().references(() => profiles.id),
  createdAt: timestamp("created_at").defaultNow(),
});
