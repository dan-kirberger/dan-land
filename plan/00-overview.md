# dan-land — Overview & Roadmap

## Vision

A personal hub for the Unraid homelab: one place to see what's happening across the box, with links out to the "real" tools for making changes. Think "mega dashboard" — not just links (Heimdall/Homepage already do that) but live read-only data: what's playing on Plex, download queue status, disk/array health, container states, etc.

## Security model (decided 2026-07-02)

**No login.** The app is read-only and reachable only on the LAN / Dan's tailnet — the network is the auth boundary. Hard constraint that follows: **never expose this app to the public internet** (no port-forward, no public reverse-proxy vhost) — it holds service API keys server-side and shows household activity. If remote-without-Tailscale access or write actions are ever wanted, revisit auth first: [01-plex-auth.md](01-plex-auth.md) has a fully designed (parked) Plex PIN flow.

## Shape of the system

```
Browser (LAN/Tailscale only) ──> dan-land (Next.js container on Unraid)
                                    │  server-side only
                                    ├──> Plex Media Server    (LAN: sessions, libraries)
                                    ├──> other Unraid services (LAN: *arr, torrents, etc.)
                                    └──> Unraid host APIs     (system stats, docker)
```

Key rule: the browser only ever talks to dan-land. All service credentials and LAN URLs live server-side in env vars. Integrations are server components / route handlers that proxy or aggregate.

## Milestones

### M0 — Skeleton (current)
- [x] Next.js app scaffolded (App Router, TS, Tailwind v4, `src/` dir)
- [x] Standalone output for Docker
- [x] Dockerfile + docker-compose example
- [x] GitHub Actions: CI (lint/build) + image publish to GHCR
- [ ] First deploy to Unraid, reachable on LAN

### M1 — App shell
- [ ] Shell layout: nav, empty dashboard landing page, mobile-first
- ~~Plex auth~~ — cut 2026-07-02; design parked in [01-plex-auth.md](01-plex-auth.md)

### M2 — First integrations
- [ ] Integration module pattern under `src/lib/integrations/`
- [ ] Plex: now playing, recently added
- [ ] One or two more from the wishlist ([03-dashboard-ideas.md](03-dashboard-ideas.md))
- [ ] Dashboard grid layout with per-service cards

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

Update the checkboxes above as work lands; add new numbered docs for new topics.
