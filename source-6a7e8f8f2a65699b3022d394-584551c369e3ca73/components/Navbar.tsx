"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Sparkles, Plus } from "lucide-react";

export function Navbar({ onNewPost }: { onNewPost: () => void }) {
  return (
    <header className="sticky top-0 z-40 glass border-b border-white/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-neon-purple-strong/20 glow-purple">
            <Sparkles className="h-4.5 w-4.5 text-neon-purple" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-glow-purple">
            BlzzyVibe
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <SignedIn>
            <button
              onClick={onNewPost}
              className="flex items-center gap-1.5 rounded-full bg-cyber-yellow px-3.5 py-2 text-sm font-semibold text-black transition-transform duration-200 hover:scale-105 hover:glow-yellow active:scale-95 sm:px-4"
            >
              <Plus className="h-4 w-4" strokeWidth={3} />
              <span className="hidden sm:inline">Drop a post</span>
              <span className="sm:hidden">Post</span>
            </button>
            <UserButton
              appearance={{
                elements: { avatarBox: "h-9 w-9 ring-2 ring-neon-purple/40 rounded-full" },
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-full border border-neon-purple/40 bg-white/5 px-4 py-2 text-sm font-semibold text-foreground transition-all duration-200 hover:border-neon-purple hover:bg-neon-purple-strong/15 hover:glow-purple">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
