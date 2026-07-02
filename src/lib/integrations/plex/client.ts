// Server-only Plex fetchers. Never import from client components — these read
// env vars and hold the server token.

import type { IntegrationResult } from "../types";
import type {
  PlexMediaContainer,
  PlexNowPlayingSession,
  PlexRecentItem,
  PlexRecentMetadata,
  PlexSessionMetadata,
} from "./types";

const TIMEOUT_MS = 5000;

function config() {
  const baseUrl = process.env.PLEX_SERVER_URL?.replace(/\/$/, "");
  const token = process.env.PLEX_TOKEN;
  return baseUrl && token ? { baseUrl, token } : null;
}

export function plexEnabled(): boolean {
  return config() !== null;
}

async function plexFetch<T>(path: string): Promise<T> {
  const cfg = config();
  if (!cfg) throw new Error("Plex integration is not configured");
  const res = await fetch(`${cfg.baseUrl}${path}`, {
    headers: {
      "X-Plex-Token": cfg.token,
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Plex responded ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}

function asUnreachable(err: unknown): { status: "unreachable"; error: string } {
  return {
    status: "unreachable",
    error: err instanceof Error ? err.message : String(err),
  };
}

export async function getNowPlaying(): Promise<
  IntegrationResult<PlexNowPlayingSession[]>
> {
  if (!plexEnabled()) return { status: "disabled" };
  try {
    const body =
      await plexFetch<PlexMediaContainer<PlexSessionMetadata>>(
        "/status/sessions",
      );
    const sessions = (body.MediaContainer.Metadata ?? []).map(
      (m): PlexNowPlayingSession => ({
        id: m.ratingKey,
        title: m.title,
        grandparentTitle: m.grandparentTitle,
        episodeLabel:
          m.type === "episode" && m.parentIndex != null && m.index != null
            ? `S${m.parentIndex}E${m.index}`
            : undefined,
        type: m.type,
        user: m.User?.title ?? "unknown",
        playerState: m.Player?.state ?? "unknown",
        progressPercent:
          m.viewOffset && m.duration
            ? Math.round((m.viewOffset / m.duration) * 100)
            : 0,
        thumb: m.grandparentThumb ?? m.thumb,
        videoDecision:
          m.TranscodeSession?.videoDecision ?? m.Media?.[0]?.videoDecision,
      }),
    );
    return { status: "ok", data: sessions };
  } catch (err) {
    return asUnreachable(err);
  }
}

export async function getRecentlyAdded(
  limit = 12,
): Promise<IntegrationResult<PlexRecentItem[]>> {
  if (!plexEnabled()) return { status: "disabled" };
  try {
    const body = await plexFetch<PlexMediaContainer<PlexRecentMetadata>>(
      `/library/recentlyAdded?X-Plex-Container-Start=0&X-Plex-Container-Size=${limit}`,
    );
    const items = (body.MediaContainer.Metadata ?? []).map(
      (m): PlexRecentItem => ({
        id: m.ratingKey,
        // Seasons come back titled "Season N" — prefer the show name
        title:
          m.type === "season" && m.parentTitle ? m.parentTitle : m.title,
        grandparentTitle: m.grandparentTitle,
        type: m.type,
        year: m.year,
        addedAt: m.addedAt,
        thumb: m.thumb ?? m.parentThumb ?? m.grandparentThumb,
      }),
    );
    return { status: "ok", data: items.slice(0, limit) };
  } catch (err) {
    return asUnreachable(err);
  }
}

/** Browser-safe URL for a Plex-internal image path (proxied, token stays server-side). */
export function plexImageUrl(thumb: string, width = 240): string {
  return `/api/plex/image?path=${encodeURIComponent(thumb)}&w=${width}`;
}
