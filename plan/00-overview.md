# dan-land — Overview & Roadmap

## Vision

A personal hub for the Unraid homelab: one place to log in (via Plex), see what's happening across the box, and jump into or interact with the services running there. Think "mega dashboard" — not just links (Heimdall/Homepage already do that) but live data and light control: what's playing on Plex, download queue status, disk/array health, container states, etc.

## Shape of the system

```
Browser ──HTTPS──> dan-land (Next.js container on Unraid)
                      │  server-side only
                      ├──> plex.tv API          (auth, user identity)
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

### M1 — Plex auth
- [ ] Plex PIN login flow (see [01-plex-auth.md](01-plex-auth.md))
- [ ] Encrypted session cookie, `proxy.ts` route guard
- [ ] Allowlist: only Dan (and chosen Plex users/home users) get in
- [ ] Logged-in shell layout: nav, user avatar from Plex, logout

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
| [01-plex-auth.md](01-plex-auth.md) | Plex PIN auth flow, sessions, allowlist |
| [02-deployment.md](02-deployment.md) | Docker image, GitHub Actions, Unraid deploy/update flow |
| [03-dashboard-ideas.md](03-dashboard-ideas.md) | Integration wishlist and ideas parking lot |

Update the checkboxes above as work lands; add new numbered docs for new topics.
