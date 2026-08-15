# AGENTS.md

## Architecture

BlzzyVibe is a single-page Next.js (App Router) app. `app/page.tsx` renders one client component, `components/ForumApp.tsx`, which owns all forum state (categories, posts, active filters, open modals) and talks to a small set of REST-style API routes under `app/api/`. There is no separate frontend/backend split beyond that.

- `db/schema.ts` — Drizzle table definitions: `profiles`, `categories`, `posts`. Kept intentionally minimal (few columns, no soft-deletes, no comment threads) to keep Postgres compute usage low.
- `db/index.ts` — Drizzle client using the Netlify Database adapter (`drizzle-orm/netlify-db`), auto-configured, no connection string needed.
- `netlify/database/migrations/` — SQL migrations applied automatically on deploy. The second migration seeds a few default rooms so the forum isn't empty on first load.
- `lib/profile.ts` — `getOrCreateProfile()` reads the Clerk session and lazily creates a matching `profiles` row on first API call. The very first profile ever created is auto-promoted to admin (`is_admin = 1`); there is no separate admin-assignment UI.
- `app/api/*` — route handlers for categories, posts, and the current profile. Auth/authorization checks happen here (sign-in required to post, admin required to create rooms, author-or-admin required to delete).
- `netlify/edge-functions/og-metadata.ts` — Deno edge function at `/api/og-metadata`. Scrapes `og:title`/`og:image` from a pasted URL with an 8-second `AbortController` timeout, always returning a placeholder image (`public/og-placeholder.svg`) on failure or timeout rather than erroring.
- `components/VideoPlayerModal.tsx` — renders a YouTube/Vimeo iframe embed for those hosts, or a plain `<video src>` tag for direct file links. Deliberately never routes video bytes through the Next.js server.

## Coding conventions

- Tailwind v4 with theme tokens defined via `@theme inline` in `app/globals.css` (e.g. `--color-neon-purple`, `--color-bg-panel`) rather than a `tailwind.config` file — extend the theme there, not with arbitrary hex values scattered in components.
- Reusable glass/glow effects live as plain CSS classes (`.glass`, `.glass-strong`, `.glow-purple`, `.glow-yellow`) instead of long Tailwind utility chains repeated per component.
- External images (OG thumbnails, Clerk avatars) use plain `<img>` tags, not `next/image`, since their domains are arbitrary and unknown ahead of time.
- Types shared between API responses and components live in `lib/types.ts`.

## Non-obvious decisions

- Admin role is derived from being the first user to ever sign in, not from Clerk metadata — this avoids needing a Clerk dashboard configuration step for a small forum.
- Schema uses an `integer` `is_admin` flag (0/1) rather than a boolean column or a separate roles table, in keeping with the "lightweight schema" requirement.
- Any schema change to `db/schema.ts` needs a matching migration: run `npx drizzle-kit generate --name <description>`.
