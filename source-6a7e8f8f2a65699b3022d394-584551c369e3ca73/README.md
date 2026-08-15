# BlzzyVibe

BlzzyVibe is a single-page, mobile-first community forum for sharing video clips and links, organized into topic "rooms" (categories). It has a dark, glassmorphic, neon-accented interface built for a Gen Z / Millennial audience.

## Key technologies

- **Next.js (App Router)** + React — application framework and API routes
- **Tailwind CSS v4** — styling, including custom glassmorphism and neon-glow utilities defined in `app/globals.css`
- **Clerk** — authentication and admin roles
- **Netlify Database (Postgres) + Drizzle ORM** — stores categories, posts, and lightweight user profiles
- **Netlify Edge Function** — fetches Open Graph metadata (title/thumbnail) for pasted links, with an 8-second timeout and placeholder fallback
- **lucide-react** — icon set

## Running locally

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in your Clerk keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. Start the Netlify dev server (provides the database connection and edge function emulation): `netlify dev`

The first person to sign in automatically becomes the forum admin, unlocking the ability to create new rooms.

## Notes on video playback

Clicking a post opens a modal player. For YouTube/Vimeo links it embeds the platform's own player; for direct video file links it streams straight from the source URL in an HTML `<video>` element. The app server never fetches or proxies video bytes, so hosting bandwidth is unaffected by how much video gets watched.
