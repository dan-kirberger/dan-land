import { Suspense } from "react";
import { CardSkeleton } from "@/components/cards/Card";
import { PlexNowPlayingCard } from "@/components/cards/PlexNowPlayingCard";
import { PlexRecentlyAddedCard } from "@/components/cards/PlexRecentlyAddedCard";
import { plexEnabled } from "@/lib/integrations/plex/client";

// Live homelab data — never prerender
export const dynamic = "force-dynamic";

export default function Dashboard() {
  const anyIntegration = plexEnabled();

  if (!anyIntegration) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-lg font-medium text-zinc-300">
          No integrations configured yet
        </p>
        <p className="max-w-sm text-sm text-zinc-500">
          Set the integration env vars (see .env.example) and the cards will
          show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Suspense fallback={<CardSkeleton title="Plex — Now Playing" />}>
        <PlexNowPlayingCard />
      </Suspense>
      <Suspense fallback={<CardSkeleton title="Plex — Recently Added" />}>
        <PlexRecentlyAddedCard />
      </Suspense>
    </div>
  );
}
