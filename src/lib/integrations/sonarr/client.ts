// Server-only Sonarr fetchers.

import type { IntegrationResult } from "../types";
import { asUnreachable } from "../http";
import { calendarRange, servarr } from "../servarr";

const sonarr = servarr("SONARR");

export const sonarrEnabled = sonarr.enabled;
export const sonarrWebUrl = sonarr.webUrl;
export const getSonarrQueue = sonarr.getQueue;

export interface UpcomingEpisode {
  id: number;
  series: string;
  episodeLabel: string;
  title: string;
  airDate?: string;
}

interface RawCalendarEpisode {
  id: number;
  title: string;
  seasonNumber: number;
  episodeNumber: number;
  airDateUtc?: string;
  series?: { title: string };
}

export async function getUpcomingEpisodes(
  days = 7,
): Promise<IntegrationResult<UpcomingEpisode[]>> {
  if (!sonarr.enabled()) return { status: "disabled" };
  try {
    const episodes = await sonarr.api<RawCalendarEpisode[]>(
      `/calendar?${calendarRange(days)}&includeSeries=true`,
    );
    return {
      status: "ok",
      data: episodes.map((e) => ({
        id: e.id,
        series: e.series?.title ?? "(unknown series)",
        episodeLabel: `S${e.seasonNumber}E${e.episodeNumber}`,
        title: e.title,
        airDate: e.airDateUtc,
      })),
    };
  } catch (err) {
    return asUnreachable(err);
  }
}
