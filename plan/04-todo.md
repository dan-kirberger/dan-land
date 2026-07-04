# Todo (working list)

Concrete near-term tasks. This is the "what's next" doc — higher-level status/milestones live in [00-overview.md](00-overview.md). Update as tasks land; delete finished items rather than leaving them checked forever.

## Right now: M2 media-stack integrations

Client/fetcher layer for all five services is done (`src/lib/integrations/{sabnzbd,tautulli,radarr,sonarr,seerr}/`, plus shared `http.ts` and `servarr.ts`). Remaining:

- [ ] Build card components (follow the `Card`/`CardMessage`/`CardSkeleton` pattern in `src/components/cards/Card.tsx`):
  - [ ] `SabnzbdCard` — download queue
  - [ ] `TautulliNowPlayingCard` / `TautulliRecentlyAddedCard`
  - [ ] `RadarrCard` — queue + upcoming
  - [ ] `SonarrCard` — queue + upcoming
  - [ ] `SeerrCard` — pending requests
- [ ] Fix `src/app/page.tsx` — still imports the deleted Plex cards (`PlexNowPlayingCard`, `PlexRecentlyAddedCard`, `plexEnabled`), so the app currently does not build. Rewrite to render the five new cards in `Suspense`, with an "any integration enabled" check across all five services.
- [x] `.env.example` updated for the five services
- [ ] `npm run lint && npm run build` — verify clean after the above
- [ ] Rebuild/relaunch local Docker container (`/local-run`) and check the empty state (or live data once `.env.local` is filled in)
- [ ] Commit + push (already durably authorized — see memory)

## After that

- [ ] Unraid system integration (array/disk/CPU/docker) — source TBD (Unraid GraphQL API vs. Glances/Netdata), see [03-dashboard-ideas.md](03-dashboard-ideas.md)
- [ ] First real deploy to Unraid (currently deferred on purpose until the app is more mature)
