"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { Post } from "@/lib/types";

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      const id = u.hostname.includes("youtu.be")
        ? u.pathname.slice(1)
        : u.searchParams.get("v");
      if (!id) return null;
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (!id) return null;
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    if (u.hostname.includes("tiktok.com")) {
      return null;
    }
    return null;
  } catch {
    return null;
  }
}

export function VideoPlayerModal({ post, onClose }: { post: Post; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const videoUrl = post.videoUrl!;
  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-modal glass-strong relative w-full max-w-3xl overflow-hidden rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <h2 className="line-clamp-1 font-display text-sm font-semibold text-foreground">
            {post.ogTitle || post.title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close player"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-cyber-yellow"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="aspect-video w-full bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={videoUrl}
              controls
              autoPlay
              playsInline
              className="h-full w-full"
              poster={post.ogImage || undefined}
            >
              Your browser can&apos;t play this source directly.
            </video>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3 text-xs text-muted">
          <span>Streaming straight from the source — no proxy, no delay.</span>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-neon-purple hover:text-cyber-yellow"
          >
            Open original ↗
          </a>
        </div>
      </div>
    </div>
  );
}
