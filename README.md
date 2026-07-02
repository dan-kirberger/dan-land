# dan-land

Personal hub / mega-dashboard for my Unraid homelab. Next.js app, Plex login, deployed as a Docker container on the Unraid box itself.

## Dev

```bash
cp .env.example .env.local   # fill in values (see plan/01-plex-auth.md)
npm install
npm run dev
```

## Deploy

Pushed to `main` → GitHub Actions builds and publishes `ghcr.io/<owner>/dan-land:latest` → Unraid pulls it. Full flow in [plan/02-deployment.md](plan/02-deployment.md).

## Docs

- [plan/00-overview.md](plan/00-overview.md) — vision, architecture, roadmap
- [plan/01-plex-auth.md](plan/01-plex-auth.md) — Plex PIN auth design
- [plan/02-deployment.md](plan/02-deployment.md) — Docker / Actions / Unraid
- [plan/03-dashboard-ideas.md](plan/03-dashboard-ideas.md) — integration wishlist
