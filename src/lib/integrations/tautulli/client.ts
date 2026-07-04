// Server-only Tautulli fetchers. Tautulli fronts Plex activity data since the
// Plex server itself isn't directly reachable (plex.tv handles that handoff).

import type { IntegrationResult } from "../types";
import { asUnreachable, fetchJson, serviceConfig } from "../http";
import type {
  TautulliActivityData,
  TautulliRecentData,
  TautulliRecentItem,
  TautulliResponse,
  TautulliSession,
} from "./types";

const cfg = () => serviceConfig("TAUTULLI");

export const tautulliEnabled = () => cfg() !== null;
export const tautulliWebUrl = () => cfg()?.baseUrl;

function apiUrl(cmd: string, params = "") {
  const c = cfg();
  if (!c) throw new Error("Tautulli is not configured");
  return `${c.baseUrl}/api/v2?apikey=${c.apiKey}&cmd=${cmd}${params}`;
}

export async function getActivity(): Promise<
  IntegrationResult<TautulliSession[]>
> {
  if (!tautulliEnabled()) return { status: "disabled" };
  try {
    const body =
      await fetchJson<TautulliResponse<TautulliActivityData>>(
        apiUrl("get_activity"),
      );
    const sessions = (body.response.data.sessions ?? []).map(
      (s): TautulliSession => ({
        id: s.session_key,
        user: s.user,
        title: s.full_title,
        mediaType: s.media_type,
        state: s.state,
        progressPercent: Number(s.progress_percent) || 0,
        transcodeDecision: s.transcode_decision,
        thumb: s.grandparent_thumb || s.thumb,
      }),
    );
    return { status: "ok", data: sessions };
  } catch (err) {
    return asUnreachable(err);
  }
}

export async function getRecentlyAdded(
  count = 12,
): Promise<IntegrationResult<TautulliRecentItem[]>> {
  if (!tautulliEnabled()) return { status: "disabled" };
  try {
    const body = await fetchJson<TautulliResponse<TautulliRecentData>>(
      apiUrl("get_recently_added", `&count=${count}`),
    );
    const items = (body.response.data.recently_added ?? []).map(
      (m): TautulliRecentItem => ({
        id: m.rating_key,
        // Episodes/seasons: prefer the show title
        title: m.grandparent_title || m.parent_title || m.title,
        mediaType: m.media_type,
        year: m.year ? Number(m.year) : undefined,
        addedAt: Number(m.added_at) || 0,
        thumb: m.grandparent_thumb || m.parent_thumb || m.thumb,
      }),
    );
    return { status: "ok", data: items };
  } catch (err) {
    return asUnreachable(err);
  }
}

/** Browser-safe URL for artwork (proxied via Tautulli's pms_image_proxy). */
export function tautulliImageUrl(thumb: string, width = 240): string {
  return `/api/tautulli/image?img=${encodeURIComponent(thumb)}&w=${width}`;
}
