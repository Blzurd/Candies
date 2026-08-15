"use client";

import { useState, type FormEvent } from "react";
import { X, Link2, Loader2, ImageOff } from "lucide-react";
import type { Category } from "@/lib/types";

export function NewPostModal({
  categories,
  isAdmin,
  onClose,
  onCreated,
  onCategoryCreated,
}: {
  categories: Category[];
  isAdmin: boolean;
  onClose: () => void;
  onCreated: () => void;
  onCategoryCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">(categories[0]?.id ?? "");
  const [ogPreview, setOgPreview] = useState<{ title: string; image: string } | null>(null);
  const [fetchingOg, setFetchingOg] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showNewRoom, setShowNewRoom] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomEmoji, setRoomEmoji] = useState("✨");
  const [creatingRoom, setCreatingRoom] = useState(false);

  async function fetchOg(url: string) {
    if (!url.trim()) {
      setOgPreview(null);
      return;
    }
    setFetchingOg(true);
    try {
      const res = await fetch(`/api/og-metadata?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (data.title || data.image) {
        setOgPreview({ title: data.title, image: data.image });
      }
    } catch {
      setOgPreview({ title: url, image: "/og-placeholder.svg" });
    } finally {
      setFetchingOg(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Give your post a title.");
      return;
    }
    if (!categoryId) {
      setError("Pick a room first.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          videoUrl: videoUrl.trim() || null,
          categoryId,
          ogTitle: ogPreview?.title ?? null,
          ogImage: ogPreview?.image ?? null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Couldn't post that. Try again.");
      }
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateRoom() {
    if (!roomName.trim()) return;
    setCreatingRoom(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: roomName.trim(), emoji: roomEmoji.trim() || "✨" }),
      });
      if (res.ok) {
        const created = await res.json();
        onCategoryCreated();
        setCategoryId(created.id);
        setShowNewRoom(false);
        setRoomName("");
      }
    } finally {
      setCreatingRoom(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="animate-modal glass-strong flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-display text-lg font-bold">Drop a post</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-cyber-yellow"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={140}
              placeholder="What's the vibe?"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 outline-none transition-colors focus:border-neon-purple"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                Room
              </label>
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => setShowNewRoom((v) => !v)}
                  className="text-xs font-semibold text-neon-purple hover:text-cyber-yellow"
                >
                  {showNewRoom ? "cancel" : "+ new room"}
                </button>
              ) : null}
            </div>

            {showNewRoom ? (
              <div className="mb-2 flex gap-2">
                <input
                  value={roomEmoji}
                  onChange={(e) => setRoomEmoji(e.target.value)}
                  maxLength={2}
                  className="w-14 rounded-xl border border-white/10 bg-white/5 px-2 py-2.5 text-center text-sm outline-none focus:border-neon-purple"
                />
                <input
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Room name"
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none focus:border-neon-purple"
                />
                <button
                  type="button"
                  onClick={handleCreateRoom}
                  disabled={creatingRoom}
                  className="rounded-xl bg-neon-purple-strong px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {creatingRoom ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                </button>
              </div>
            ) : null}

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-neon-purple"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-bg-panel">
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              <Link2 className="h-3.5 w-3.5" /> Video / link (optional)
            </label>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onBlur={(e) => fetchOg(e.target.value)}
              placeholder="Paste a YouTube, Vimeo, or direct video link"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 outline-none transition-colors focus:border-neon-purple"
            />
            {fetchingOg ? (
              <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> fetching preview…
              </div>
            ) : ogPreview ? (
              <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ogPreview.image}
                  alt=""
                  className="h-12 w-20 rounded-lg object-cover"
                />
                <p className="line-clamp-2 text-xs text-muted">{ogPreview.title}</p>
              </div>
            ) : videoUrl.trim() ? (
              <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                <ImageOff className="h-3.5 w-3.5" /> no preview yet — click away from the field
              </div>
            ) : null}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
              Notes (optional)
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Add some context…"
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 outline-none transition-colors focus:border-neon-purple"
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-cyber-yellow py-3 text-sm font-bold text-black transition-transform duration-200 hover:scale-[1.01] hover:glow-yellow active:scale-95 disabled:opacity-50"
          >
            {submitting ? "Posting…" : "Post it"}
          </button>
        </div>
      </form>
    </div>
  );
}
