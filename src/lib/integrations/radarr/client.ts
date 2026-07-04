// Server-only Radarr fetchers.

import type { IntegrationResult } from "../types";
import { asUnreachable } from "../http";
import { calendarRange, servarr } from "../servarr";

const radarr = servarr("RADARR");

export const radarrEnabled = radarr.enabled;
export const radarrWebUrl = radarr.webUrl;
export const getRadarrQueue = radarr.getQueue;

export interface UpcomingMovie {
  id: number;
  title: string;
  /** Digital/physical/cinema — whichever release lands in the window */
  releaseDate?: string;
}

interface RawCalendarMovie {
  id: number;
  title: string;
  digitalRelease?: string;
  physicalRelease?: string;
  inCinemas?: string;
}

export async function getUpcomingMovies(
  days = 7,
): Promise<IntegrationResult<UpcomingMovie[]>> {
  if (!radarr.enabled()) return { status: "disabled" };
  try {
    const movies = await radarr.api<RawCalendarMovie[]>(
      `/calendar?${calendarRange(days)}`,
    );
    return {
      status: "ok",
      data: movies.map((m) => ({
        id: m.id,
        title: m.title,
        releaseDate: m.digitalRelease ?? m.physicalRelease ?? m.inCinemas,
      })),
    };
  } catch (err) {
    return asUnreachable(err);
  }
}
