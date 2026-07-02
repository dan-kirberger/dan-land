/* eslint-disable @next/next/no-img-element -- artwork comes through our own
   proxy route; next/image optimization would just re-proxy it */
import {
  getRecentlyAdded,
  plexImageUrl,
} from "@/lib/integrations/plex/client";
import { Card, CardMessage } from "./Card";

export async function PlexRecentlyAddedCard() {
  const result = await getRecentlyAdded(12);
  if (result.status === "disabled") return null;

  return (
    <Card title="Plex — Recently Added" href="https://app.plex.tv">
      {result.status === "unreachable" ? (
        <CardMessage>Plex is unreachable</CardMessage>
      ) : result.data.length === 0 ? (
        <CardMessage>Nothing recent</CardMessage>
      ) : (
        <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {result.data.map((item) => (
            <li key={item.id} className="min-w-0">
              <div className="aspect-2/3 overflow-hidden rounded bg-zinc-800">
                {item.thumb && (
                  <img
                    src={plexImageUrl(item.thumb, 180)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <p
                className="mt-1 truncate text-xs text-zinc-400"
                title={item.grandparentTitle ?? item.title}
              >
                {item.grandparentTitle ?? item.title}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
