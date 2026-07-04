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

### ~~Plex (direct)~~ — not viable, cut 2026-07-02
Plex Media Server isn't reachable over Tailscale; client access goes through plex.tv's relay/handoff to the local server, which this app can't ride along on. **Tautulli substitutes for this** since it talks to the local Plex server directly — now playing, recently added, and library data all come from Tautulli's API instead.

### M2 media stack (in progress)
- **Tautulli**: now playing, recently added (covers what direct Plex would have shown)
- **SABnzbd**: download queue
- **Radarr** / **Sonarr**: queue + upcoming (via shared `servarr()` client factory, both use the same `/api/v3` shape)
- **Seerr** (Overseerr-compatible): pending requests

### Unraid system
- Array status, disk usage/temps, parity check progress
- CPU/RAM load
- Docker container list with up/down state
- Source options: Unraid's GraphQL API (Connect plugin), or a Glances/Netdata container as the metrics source. **Decide when we get here.**

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

## Android TV app (parked — Dan is mulling it)

A companion Android TV app baked into this project. Implications to keep in mind while building the web app, so we don't paint ourselves into a corner:

- A TV app would consume dan-land as an **API** — keep integration fetchers cleanly separated from React components so route handlers can expose the same data as JSON later.
- Auth from a TV can't do the browser redirect dance; Plex's PIN flow is actually TV-friendly (show a code, approve on phone) — the same `/api/auth` machinery could grow a device-code variant.
- Likely stack when it happens: Kotlin + Compose for TV, talking to dan-land over the LAN/Tailscale.
- Not roadmapped; revisit after M2.

## Open questions

- Card layout: fixed grid first; drag-and-drop configurable later if it earns it.
