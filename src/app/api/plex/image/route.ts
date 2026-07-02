import type { NextRequest } from "next/server";

// Proxies Plex artwork so the browser never sees the Plex token or LAN URL.
// Uses Plex's photo transcoder to resize server-side.

const ALLOWED_PATH = /^\/(library|photo)\//;

export async function GET(request: NextRequest) {
  const baseUrl = process.env.PLEX_SERVER_URL?.replace(/\/$/, "");
  const token = process.env.PLEX_TOKEN;
  if (!baseUrl || !token) return new Response(null, { status: 404 });

  const path = request.nextUrl.searchParams.get("path") ?? "";
  const width = Math.min(
    Number(request.nextUrl.searchParams.get("w")) || 240,
    1000,
  );
  if (!ALLOWED_PATH.test(path) || path.includes("..")) {
    return new Response(null, { status: 400 });
  }

  const transcode =
    `${baseUrl}/photo/:/transcode?width=${width}&height=${width * 2}` +
    `&minSize=1&upscale=1&url=${encodeURIComponent(path)}`;

  try {
    const upstream = await fetch(transcode, {
      headers: { "X-Plex-Token": token },
      signal: AbortSignal.timeout(5000),
    });
    if (!upstream.ok || !upstream.body) {
      return new Response(null, { status: 502 });
    }
    return new Response(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "image/jpeg",
        // Artwork for a given metadata path is effectively immutable
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
