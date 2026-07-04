// Shared client bits for Servarr apps (Radarr/Sonarr) — same /api/v3 shape,
// same X-Api-Key auth; only the calendar payload differs per app.

import type { IntegrationResult } from "./types";
import { asUnreachable, fetchJson, serviceConfig } from "./http";

export interface ServarrQueueItem {
  id: number;
  /** Release title being downloaded */
  title: string;
  status: string;
  /** 0–100 */
  percentage: number;
  timeleft?: string;
}

export interface ServarrQueue {
  totalRecords: number;
  items: ServarrQueueItem[];
}

interface RawQueue {
  totalRecords: number;
  records: {
    id: number;
    title?: string;
    status: string;
    size: number;
    sizeleft: number;
    timeleft?: string;
  }[];
}

export function servarr(prefix: "RADARR" | "SONARR") {
  const cfg = () => serviceConfig(prefix);

  async function api<T>(path: string): Promise<T> {
    const c = cfg();
    if (!c) throw new Error(`${prefix} is not configured`);
    return fetchJson<T>(`${c.baseUrl}/api/v3${path}`, {
      "X-Api-Key": c.apiKey,
    });
  }

  return {
    enabled: () => cfg() !== null,
    webUrl: () => cfg()?.baseUrl,
    api,

    async getQueue(): Promise<IntegrationResult<ServarrQueue>> {
      if (!cfg()) return { status: "disabled" };
      try {
        const body = await api<RawQueue>("/queue?pageSize=10");
        return {
          status: "ok",
          data: {
            totalRecords: body.totalRecords,
            items: body.records.map((r) => ({
              id: r.id,
              title: r.title ?? "(unknown)",
              status: r.status,
              percentage:
                r.size > 0
                  ? Math.round(((r.size - r.sizeleft) / r.size) * 100)
                  : 0,
              timeleft: r.timeleft,
            })),
          },
        };
      } catch (err) {
        return asUnreachable(err);
      }
    },
  };
}

/** ISO date range from today spanning `days` days, for calendar endpoints. */
export function calendarRange(days: number): string {
  const start = new Date();
  const end = new Date(start.getTime() + days * 86400_000);
  return `start=${start.toISOString()}&end=${end.toISOString()}`;
}
