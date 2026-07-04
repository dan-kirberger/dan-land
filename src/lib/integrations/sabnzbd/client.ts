// Server-only SABnzbd fetchers.

import type { IntegrationResult } from "../types";
import { asUnreachable, fetchJson, serviceConfig } from "../http";
import type { SabQueue, SabQueueResponse } from "./types";

const cfg = () => serviceConfig("SABNZBD");

export const sabnzbdEnabled = () => cfg() !== null;
export const sabnzbdWebUrl = () => cfg()?.baseUrl;

export async function getSabQueue(): Promise<IntegrationResult<SabQueue>> {
  const c = cfg();
  if (!c) return { status: "disabled" };
  try {
    const body = await fetchJson<SabQueueResponse>(
      `${c.baseUrl}/api?mode=queue&output=json&limit=10&apikey=${c.apiKey}`,
    );
    return {
      status: "ok",
      data: {
        paused: body.queue.paused,
        speed: body.queue.speed,
        slots: body.queue.slots.map((s) => ({
          filename: s.filename,
          status: s.status,
          percentage: Number(s.percentage) || 0,
          timeleft: s.timeleft,
          sizeLeftMb: Number(s.mbleft) || 0,
        })),
      },
    };
  } catch (err) {
    return asUnreachable(err);
  }
}
