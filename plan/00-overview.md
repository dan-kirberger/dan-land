# dan-land — Overview & Roadmap

## Vision

A personal hub for the Unraid homelab: one place to see what's happening across the box, with links out to the "real" tools for making changes. Think "mega dashboard" — not just links (Heimdall/Homepage already do that) but live read-only data: what's playing on Plex, download queue status, disk/array health, container states, etc.

## Security model (decided 2026-07-02)

**No login.** The app is read-only and reachable only on the LAN / Dan's tailnet — the network is the auth boundary. Hard constraint that follows: **never expose this app to the public internet** (no port-forward, no public reverse-proxy vhost) — it holds service API keys server-side and shows household activity. If remote-without-Tailscale access or write actions are ever wanted, revisit auth first: [01-plex-auth.md](01-plex-auth.md) has a fully designed (parked) Plex PIN flow.

## Shape of the system

```
Browser (LAN/Tailscale only) ──> dan-land (Next.js container on Unraid)
                                    │  server-side only
                                    ├──> Tautulli   (Plex activity/library data — see note below)
                                    ├──> SABnzbd, Radarr, Sonarr, Seerr
                                    └──> Unraid host APIs     (system stats, docker)
```

**Plex itself is not a direct integration.** Plex Media Server isn't reachable over Tailscale — client access goes through plex.tv's relay/handoff to the local server, which a homelab-LAN app can't ride along on. Tautulli (which talks to the local Plex server directly) stands in for Plex activity/library data instead.

Key rule: the browser only ever talks to dan-land. All service credentials and LAN URLs live server-side in env vars. Integrations are server components / route handlers that proxy or aggregate.

## Milestones

### M0 — Skeleton (current)
- [x] Next.js app scaffolded (App Router, TS, Tailwind v4, `src/` dir)
- [x] Standalone output for Docker
- [x] Dockerfile + docker-compose example
- [x] GitHub Actions: CI (lint/build) + image publish to GHCR
- [ ] First deploy to Unraid, reachable on LAN

### M1 — App shell
- [x] Shell layout: header, dashboard landing page, mobile-first, dark-only
- ~~Plex auth~~ — cut 2026-07-02; design parked in [01-plex-auth.md](01-plex-auth.md)

### M2 — First integrations (in progress, current focus)
- [x] Integration module pattern under `src/lib/integrations/` (`IntegrationResult`: disabled / unreachable / ok)
- ~~Plex direct integration~~ — cut 2026-07-02, not tailnet-reachable (see note above); Tautulli replaces it
- [x] Client/fetcher layer for SABnzbd, Seerr, Tautulli, Radarr, Sonarr
- [ ] Card components for all five (not started)
- [ ] Dashboard grid wired up to the five cards (`page.tsx` currently still references the deleted Plex cards and does not build)
- [ ] `.env.example` updated for the five services (still has stale Plex vars)
- See [plan/04-todo.md](04-todo.md) for the concrete task list.

### Someday / maybe
- Android TV companion app (see parking-lot notes in [03-dashboard-ideas.md](03-dashboard-ideas.md)) — build the web app API-first so this stays easy

### M3 — Mega dashboard
- [ ] More integrations, configurable card layout
- [ ] Health/status strip (which services are up)
- [ ] Mobile-friendly (this will get used from the couch)

## Docs in this folder

| File | Topic |
|---|---|
| [01-plex-auth.md](01-plex-auth.md) | **Parked** — Plex PIN auth design, kept for if auth is ever needed |
| [02-deployment.md](02-deployment.md) | Docker image, GitHub Actions, Unraid deploy/update flow |
| [03-dashboard-ideas.md](03-dashboard-ideas.md) | Integration wishlist and ideas parking lot |
| [04-todo.md](04-todo.md) | Concrete near-term todo list (working doc, updated as tasks land) |

Update the checkboxes above as work lands; add new numbered docs for new topics.
