/* eslint-disable @next/next/no-img-element -- artwork comes through our own
   proxy route; next/image optimization would just re-proxy it */
import { getNowPlaying, plexImageUrl } from "@/lib/integrations/plex/client";
import { Card, CardMessage } from "./Card";

export async function PlexNowPlayingCard() {
  const result = await getNowPlaying();
  if (result.status === "disabled") return null;

  return (
    <Card title="Plex — Now Playing" href="https://app.plex.tv">
      {result.status === "unreachable" ? (
        <CardMessage>Plex is unreachable</CardMessage>
      ) : result.data.length === 0 ? (
        <CardMessage>Nothing playing</CardMessage>
      ) : (
        <ul className="space-y-3">
          {result.data.map((s) => (
            <li key={s.id} className="flex gap-3">
              {s.thumb && (
                <img
                  src={plexImageUrl(s.thumb, 120)}
                  alt=""
                  className="h-16 w-11 shrink-0 rounded object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-100">
                  {s.grandparentTitle ?? s.title}
                </p>
                {s.grandparentTitle && (
                  <p className="truncate text-sm text-zinc-400">
                    {s.episodeLabel ? `${s.episodeLabel} · ` : ""}
                    {s.title}
                  </p>
                )}
                <p className="mt-1 text-xs text-zinc-500">
                  {s.user}
                  {s.playerState === "paused" && " · paused"}
                  {s.videoDecision === "transcode" && " · transcoding"}
                </p>
                <div className="mt-2 h-1 overflow-hidden rounded bg-zinc-800">
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${s.progressPercent}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
