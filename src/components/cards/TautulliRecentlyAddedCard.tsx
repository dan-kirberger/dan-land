/* eslint-disable @next/next/no-img-element -- artwork comes through our own
   proxy route; next/image optimization would just re-proxy it */
import {
  getRecentlyAdded,
  tautulliImageUrl,
  tautulliWebUrl,
} from "@/lib/integrations/tautulli/client";
import { Card, CardMessage } from "./Card";

export async function TautulliRecentlyAddedCard() {
  const result = await getRecentlyAdded();
  if (result.status === "disabled") return null;

  return (
    <Card title="Plex — Recently Added" href={tautulliWebUrl()}>
      {result.status === "unreachable" ? (
        <CardMessage>Tautulli is unreachable</CardMessage>
      ) : result.data.length === 0 ? (
        <CardMessage>Nothing recently added</CardMessage>
      ) : (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {result.data.map((m) => (
            <li key={m.id} className="min-w-0">
              {m.thumb && (
                <img
                  src={tautulliImageUrl(m.thumb, 160)}
                  alt=""
                  className="aspect-[2/3] w-full rounded object-cover"
                />
              )}
              <p className="mt-1 truncate text-xs text-zinc-300">
                {m.title}
              </p>
              {m.year && (
                <p className="truncate text-xs text-zinc-500">{m.year}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
