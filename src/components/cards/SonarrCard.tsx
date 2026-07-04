import {
  getSonarrQueue,
  getUpcomingEpisodes,
  sonarrWebUrl,
} from "@/lib/integrations/sonarr/client";
import { Card, CardMessage } from "./Card";

export async function SonarrCard() {
  const [queue, upcoming] = await Promise.all([
    getSonarrQueue(),
    getUpcomingEpisodes(),
  ]);
  if (queue.status === "disabled") return null;

  return (
    <Card title="Sonarr" href={sonarrWebUrl()}>
      {queue.status === "unreachable" ? (
        <CardMessage>Sonarr is unreachable</CardMessage>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-xs font-medium text-zinc-500">
              Downloading
            </h3>
            {queue.data.items.length === 0 ? (
              <p className="text-sm text-zinc-500">Queue is empty</p>
            ) : (
              <ul className="space-y-3">
                {queue.data.items.map((item) => (
                  <li key={item.id}>
                    <p className="truncate text-sm font-medium text-zinc-100">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {item.status}
                      {item.timeleft && ` · ${item.timeleft} left`}
                    </p>
                    <div className="mt-2 h-1 overflow-hidden rounded bg-zinc-800">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="mb-2 text-xs font-medium text-zinc-500">
              Upcoming
            </h3>
            {upcoming.status !== "ok" || upcoming.data.length === 0 ? (
              <p className="text-sm text-zinc-500">Nothing upcoming</p>
            ) : (
              <ul className="space-y-1">
                {upcoming.data.map((e) => (
                  <li
                    key={e.id}
                    className="flex justify-between gap-2 text-sm"
                  >
                    <span className="truncate text-zinc-300">
                      {e.series}{" "}
                      <span className="text-zinc-500">
                        {e.episodeLabel}
                      </span>
                    </span>
                    {e.airDate && (
                      <span className="shrink-0 text-xs text-zinc-500">
                        {new Date(e.airDate).toLocaleDateString()}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
