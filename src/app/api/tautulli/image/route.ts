import type { NextRequest } from "next/server";

// Proxies Plex artwork through Tautulli's pms_image_proxy so the browser
// never sees the Tautulli API key.

const ALLOWED_IMG = /^\/(library|photo)\//;

export async function GET(request: NextRequest) {
  const baseUrl = process.env.TAUTULLI_URL?.replace(/\/$/, "");
  const apiKey = process.env.TAUTULLI_API_KEY;
  if (!baseUrl || !apiKey) return new Response(null, { status: 404 });

  const img = request.nextUrl.searchParams.get("img") ?? "";
  const width = Math.min(
    Number(request.nextUrl.searchParams.get("w")) || 240,
    1000,
  );
  if (!ALLOWED_IMG.test(img) || img.includes("..")) {
    return new Response(null, { status: 400 });
  }

  const upstreamUrl =
    `${baseUrl}/api/v2?apikey=${apiKey}&cmd=pms_image_proxy` +
    `&img=${encodeURIComponent(img)}&width=${width}&height=${width * 2}` +
    `&fallback=poster`;

  try {
    const upstream = await fetch(upstreamUrl, {
      signal: AbortSignal.timeout(5000),
    });
    if (!upstream.ok || !upstream.body) {
      return new Response(null, { status: 502 });
    }
    return new Response(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
