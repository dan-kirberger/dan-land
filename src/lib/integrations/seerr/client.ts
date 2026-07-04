// Server-only Seerr (Overseerr-compatible API) fetchers.

import type { IntegrationResult } from "../types";
import { asUnreachable, fetchJson, serviceConfig } from "../http";

const cfg = () => serviceConfig("SEERR");

export const seerrEnabled = () => cfg() !== null;
export const seerrWebUrl = () => cfg()?.baseUrl;

export interface SeerrRequest {
  id: number;
  type: "movie" | "tv" | string;
  title: string;
  requestedBy: string;
  requestedAt: string;
}

interface RawRequestPage {
  pageInfo: { results: number };
  results: {
    id: number;
    type: string;
    createdAt: string;
    requestedBy?: { displayName?: string };
    media?: { tmdbId?: number; mediaType?: string };
  }[];
}

async function api<T>(path: string): Promise<T> {
  const c = cfg();
  if (!c) throw new Error("Seerr is not configured");
  return fetchJson<T>(`${c.baseUrl}/api/v1${path}`, { "X-Api-Key": c.apiKey });
}

/** Request objects carry only a tmdbId — titles need a per-item lookup. */
async function lookupTitle(
  mediaType: string | undefined,
  tmdbId: number | undefined,
): Promise<string> {
  if (!tmdbId) return "(unknown)";
  try {
    if (mediaType === "tv") {
      const tv = await api<{ name?: string }>(`/tv/${tmdbId}`);
      return tv.name ?? "(unknown)";
    }
    const movie = await api<{ title?: string }>(`/movie/${tmdbId}`);
    return movie.title ?? "(unknown)";
  } catch {
    return "(unknown)";
  }
}

export async function getPendingRequests(): Promise<
  IntegrationResult<{ total: number; requests: SeerrRequest[] }>
> {
  if (!seerrEnabled()) return { status: "disabled" };
  try {
    const page = await api<RawRequestPage>(
      "/request?take=8&filter=pending&sort=added",
    );
    const requests = await Promise.all(
      page.results.map(async (r) => ({
        id: r.id,
        type: r.media?.mediaType ?? r.type,
        title: await lookupTitle(r.media?.mediaType, r.media?.tmdbId),
        requestedBy: r.requestedBy?.displayName ?? "unknown",
        requestedAt: r.createdAt,
      })),
    );
    return {
      status: "ok",
      data: { total: page.pageInfo.results, requests },
    };
  } catch (err) {
    return asUnreachable(err);
  }
}
