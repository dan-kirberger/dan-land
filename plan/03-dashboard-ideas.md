# Dashboard Ideas & Integration Wishlist

Parking lot for what the hub could surface. Each integration becomes a module under `src/lib/integrations/<name>/` exposing typed fetchers, plus a dashboard card component. Nothing here is committed roadmap until it's promoted into `00-overview.md`.

## Integration pattern (proposed)

```ts
// src/lib/integrations/<name>/client.ts  — server-only fetchers, reads env
// src/lib/integrations/<name>/types.ts   — response types we actually use
// src/components/cards/<Name>Card.tsx    — dashboard card, gets data via RSC
```

- Every integration degrades gracefully: env var missing → card hidden; service down → card shows "unreachable" instead of breaking the page.
- Poll-based to start (RSC + periodic client refresh). Websockets/SSE only if a card really needs live data.

## Wishlist (roughly by expected payoff)

### Plex (first, since we already hold a token)
- Now playing: who's watching what, progress, transcode vs direct play
- Recently added across libraries
- Maybe: library stats, on-deck for me

### Unraid system
- Array status, disk usage/temps, parity check progress
- CPU/RAM load
- Docker container list with up/down state
- Source options: Unraid's GraphQL API (Connect plugin), or a Glances/Netdata container as the metrics source. **Decide when we get here.**

### Downloads / media pipeline (if/which of these run on the box — confirm)
- Sonarr/Radarr: queue, upcoming, recent grabs, health warnings
- qBittorrent/SAB: active downloads, speeds
- Overseerr/Jellyseerr: pending requests (with approve button?)
- Tautulli: watch history/stats (some overlap with direct Plex data — pick one source per card)

### Network / infra
- Pi-hole / AdGuard: blocked %, top clients
- Uptime Kuma: service status strip across the top of the dashboard
- Speedtest tracker history

### Smart home
- Home Assistant: a few chosen entities (doors, temps, cameras?) via HA's REST/websocket API + long-lived token

### Quality-of-life
- Link tiles for everything not worth a full integration (replaces Heimdall)
- Global search: "where is X" across Plex libraries / *arr
- Mobile layout that doesn't suck — couch usage is the main usage

## Open questions

- Which services are actually running on the box today? (Inventory needed before M2 planning.)
- One shared "server token" per service vs per-user — services like *arr only have API keys, so server-side keys it is; Plex acts on the logged-in user's own token.
- Card layout: fixed grid first; drag-and-drop configurable later if it earns it.
