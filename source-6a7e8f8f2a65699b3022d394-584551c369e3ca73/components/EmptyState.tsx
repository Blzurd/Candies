import { Ghost } from "lucide-react";

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="animate-rise flex flex-col items-center justify-center gap-3 rounded-2xl glass px-6 py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-neon-purple-strong/15 animate-pulse-glow">
        <Ghost className="h-6 w-6 text-neon-purple" />
      </div>
      <p className="font-display text-lg font-semibold text-foreground">Quiet in here…</p>
      <p className="max-w-xs text-sm text-muted">{label}</p>
    </div>
  );
}
