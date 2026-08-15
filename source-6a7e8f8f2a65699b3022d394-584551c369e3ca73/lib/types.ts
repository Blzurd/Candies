export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  emoji: string | null;
};

export type Post = {
  id: number;
  title: string;
  body: string | null;
  videoUrl: string | null;
  ogTitle: string | null;
  ogImage: string | null;
  createdAt: string | null;
  authorId: number;
  authorName: string;
  authorAvatar: string | null;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
};

export type Profile = {
  id: number;
  clerkUserId: string;
  displayName: string;
  avatarUrl: string | null;
  isAdmin: number;
};
