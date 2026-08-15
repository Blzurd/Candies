"use client";

import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";
import { CategoryRail } from "@/components/CategoryRail";
import { PostCard } from "@/components/PostCard";
import { PostSkeletonGrid } from "@/components/PostSkeletonGrid";
import { EmptyState } from "@/components/EmptyState";
import { NewPostModal } from "@/components/NewPostModal";
import { VideoPlayerModal } from "@/components/VideoPlayerModal";
import type { Category, Post, Profile } from "@/lib/types";

export function ForumApp() {
  const { isSignedIn } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [playingPost, setPlayingPost] = useState<Post | null>(null);

  const loadCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    if (res.ok) setCategories(await res.json());
  }, []);

  const loadPosts = useCallback(async (categorySlug: string | null) => {
    setLoading(true);
    const qs = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : "";
    const res = await fetch(`/api/posts${qs}`);
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadPosts(activeCategory);
  }, [activeCategory, loadPosts]);

  useEffect(() => {
    if (!isSignedIn) {
      setProfile(null);
      return;
    }
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => setProfile(d.profile))
      .catch(() => setProfile(null));
  }, [isSignedIn]);

  async function handleDelete(post: Post) {
    const prev = posts;
    setPosts((p) => p.filter((x) => x.id !== post.id));
    const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    if (!res.ok) setPosts(prev);
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar onNewPost={() => setShowNewPost(true)} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 animate-rise">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            {activeCategory
              ? categories.find((c) => c.slug === activeCategory)?.name
              : "Everything, all at once"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Drop clips, swap links, and see what the room is into right now.
          </p>
        </div>

        <div className="mb-6">
          <CategoryRail categories={categories} active={activeCategory} onSelect={setActiveCategory} />
        </div>

        {loading ? (
          <PostSkeletonGrid />
        ) : posts.length === 0 ? (
          <EmptyState label="Nobody's posted here yet. Be the first to drop something." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <PostCard
                key={post.id}
                post={post}
                style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
                canDelete={!!profile && (profile.id === post.authorId || !!profile.isAdmin)}
                onOpenVideo={setPlayingPost}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 px-4 py-6 text-center text-xs text-muted">
        BlzzyVibe — built for the late-night scroll.
      </footer>

      {showNewPost ? (
        <NewPostModal
          categories={categories}
          isAdmin={!!profile?.isAdmin}
          onClose={() => setShowNewPost(false)}
          onCreated={() => loadPosts(activeCategory)}
          onCategoryCreated={loadCategories}
        />
      ) : null}

      {playingPost ? (
        <VideoPlayerModal post={playingPost} onClose={() => setPlayingPost(null)} />
      ) : null}
    </div>
  );
}
