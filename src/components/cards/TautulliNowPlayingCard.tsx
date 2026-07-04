/* eslint-disable @next/next/no-img-element -- artwork comes through our own
   proxy route; next/image optimization would just re-proxy it */
import {
  getActivity,
  tautulliImageUrl,
  tautulliWebUrl,
} from "@/lib/integrations/tautulli/client";
import { Card, CardMessage } from "./Card";

export async function TautulliNowPlayingCard() {
  const result = await getActivity();
  if (result.status === "disabled") return null;

  return (
    <Card title="Plex — Now Playing" href={tautulliWebUrl()}>
      {result.status === "unreachable" ? (
        <CardMessage>Tautulli is unreachable</CardMessage>
      ) : result.data.length === 0 ? (
        <CardMessage>Nothing playing</CardMessage>
      ) : (
        <ul className="space-y-3">
          {result.data.map((s) => (
            <li key={s.id} className="flex gap-3">
              {s.thumb && (
                <img
                  src={tautulliImageUrl(s.thumb, 120)}
                  alt=""
                  className="h-16 w-11 shrink-0 rounded object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-100">
                  {s.title}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {s.user}
                  {s.state === "paused" && " · paused"}
                  {s.transcodeDecision === "transcode" && " · transcoding"}
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
