import type { Config } from "@netlify/edge-functions";

const FALLBACK_IMAGE = "/og-placeholder.svg";
const TIMEOUT_MS = 8000;

function extractMeta(html: string, property: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
      "i",
    ),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

function extractTitleTag(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1]?.trim() ?? null;
}

export default async (req: Request) => {
  const targetUrl = new URL(req.url).searchParams.get("url");

  if (!targetUrl) {
    return Response.json({ error: "Missing url parameter." }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(targetUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("bad protocol");
    }
  } catch {
    return Response.json({ error: "Invalid url." }, { status: 400 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(parsed.toString(), {
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; BlzzyVibeBot/1.0; +https://blzzyvibe.app)",
        accept: "text/html",
      },
    });

    if (!res.ok) {
      return Response.json({
        title: parsed.hostname,
        image: FALLBACK_IMAGE,
        sourceUrl: parsed.toString(),
      });
    }

    const html = await res.text();
    const title =
      extractMeta(html, "og:title") || extractTitleTag(html) || parsed.hostname;
    const image = extractMeta(html, "og:image") || FALLBACK_IMAGE;

    return Response.json({
      title: title.slice(0, 140),
      image,
      sourceUrl: parsed.toString(),
    });
  } catch {
    return Response.json({
      title: parsed.hostname,
      image: FALLBACK_IMAGE,
      sourceUrl: parsed.toString(),
    });
  } finally {
    clearTimeout(timer);
  }
};

export const config: Config = {
  path: "/api/og-metadata",
};
