import { Suspense } from "react";
import { CardSkeleton } from "@/components/cards/Card";
import { SabnzbdCard } from "@/components/cards/SabnzbdCard";
import { TautulliNowPlayingCard } from "@/components/cards/TautulliNowPlayingCard";
import { TautulliRecentlyAddedCard } from "@/components/cards/TautulliRecentlyAddedCard";
import { RadarrCard } from "@/components/cards/RadarrCard";
import { SonarrCard } from "@/components/cards/SonarrCard";
import { SeerrCard } from "@/components/cards/SeerrCard";
import { sabnzbdEnabled } from "@/lib/integrations/sabnzbd/client";
import { tautulliEnabled } from "@/lib/integrations/tautulli/client";
import { radarrEnabled } from "@/lib/integrations/radarr/client";
import { sonarrEnabled } from "@/lib/integrations/sonarr/client";
import { seerrEnabled } from "@/lib/integrations/seerr/client";

// Live homelab data — never prerender
export const dynamic = "force-dynamic";

export default function Dashboard() {
  const anyIntegration =
    sabnzbdEnabled() ||
    tautulliEnabled() ||
    radarrEnabled() ||
    sonarrEnabled() ||
    seerrEnabled();

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
        <TautulliNowPlayingCard />
      </Suspense>
      <Suspense fallback={<CardSkeleton title="Plex — Recently Added" />}>
        <TautulliRecentlyAddedCard />
      </Suspense>
      <Suspense fallback={<CardSkeleton title="SABnzbd — Queue" />}>
        <SabnzbdCard />
      </Suspense>
      <Suspense fallback={<CardSkeleton title="Seerr — Pending Requests" />}>
        <SeerrCard />
      </Suspense>
      <Suspense fallback={<CardSkeleton title="Radarr" />}>
        <RadarrCard />
      </Suspense>
      <Suspense fallback={<CardSkeleton title="Sonarr" />}>
        <SonarrCard />
      </Suspense>
    </div>
  );
}
