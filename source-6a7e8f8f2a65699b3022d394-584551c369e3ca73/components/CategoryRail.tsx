"use client";

import type { Category } from "@/lib/types";

export function CategoryRail({
  categories,
  active,
  onSelect,
}: {
  categories: Category[];
  active: string | null;
  onSelect: (slug: string | null) => void;
}) {
  return (
    <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
          active === null
            ? "bg-neon-purple-strong text-white glow-purple"
            : "glass text-muted hover:text-foreground hover:border-white/20"
        }`}
      >
        All vibes
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.slug)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
            active === c.slug
              ? "bg-neon-purple-strong text-white glow-purple"
              : "glass text-muted hover:text-foreground hover:border-white/20"
          }`}
        >
          <span className="mr-1.5">{c.emoji}</span>
          {c.name}
        </button>
      ))}
    </div>
  );
}
