"use client";

import type { CSSProperties } from "react";
import { Play, Trash2, MessageSquareText } from "lucide-react";
import type { Post } from "@/lib/types";

function timeAgo(iso: string | null) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function PostCard({
  post,
  canDelete,
  onOpenVideo,
  onDelete,
  style,
}: {
  post: Post;
  canDelete: boolean;
  onOpenVideo: (post: Post) => void;
  onDelete: (post: Post) => void;
  style?: CSSProperties;
}) {
  const thumbnail = post.ogImage || "/og-placeholder.svg";

  return (
    <article
      style={style}
      className="animate-rise group relative overflow-hidden rounded-2xl glass transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-neon-purple/50 hover:shadow-[0_20px_50px_-15px_rgba(147,51,234,0.45)]"
    >
      {post.videoUrl ? (
        <button
          onClick={() => onOpenVideo(post)}
          className="relative block aspect-video w-full overflow-hidden bg-bg-panel-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/50" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-cyber-yellow/95 glow-yellow transition-transform duration-200 group-hover:scale-110">
              <Play className="ml-0.5 h-6 w-6 fill-black text-black" />
            </div>
          </div>
        </button>
      ) : null}

      <div className="flex flex-col gap-2.5 p-4">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-neon-purple">
          <span>{post.categoryName}</span>
        </div>

        <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-foreground">
          {post.title}
        </h3>

        {post.body ? (
          <p className="line-clamp-2 flex items-start gap-1.5 text-sm text-muted">
            <MessageSquareText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {post.body}
          </p>
        ) : null}

        <div className="mt-1 flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.authorAvatar || "/og-placeholder.svg"}
              alt=""
              className="h-6 w-6 rounded-full object-cover ring-1 ring-white/10"
            />
            <span className="text-xs font-medium text-muted">{post.authorName}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted">{timeAgo(post.createdAt)}</span>
            {canDelete ? (
              <button
                onClick={() => onDelete(post)}
                aria-label="Delete post"
                className="rounded-lg p-1 text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
