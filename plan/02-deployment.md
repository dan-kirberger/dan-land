# Deployment — Docker, GitHub Actions, Unraid

## Pipeline

```
push to main ──> GitHub Actions ──> build image ──> push ghcr.io/<owner>/dan-land:latest + :sha
                                                        │
Unraid ── pulls new image (manual "force update" or auto-updater) ──> container restarts
```

## Docker image

- Multi-stage `Dockerfile` (repo root): deps → build → slim runner using Next's **standalone output** (`output: "standalone"` in `next.config.ts`). Final image is `node:24-alpine` + `.next/standalone` + static assets, runs as non-root `node` user on port 3000.
- `.dockerignore` keeps `node_modules`, `.next`, `.git`, plans etc. out of the build context.
- Unraid is x86-64 — the workflow builds `linux/amd64` only. Add `linux/arm64` to the workflow's `platforms:` if that ever changes; it roughly doubles build time.

## GitHub Actions

- `ci.yml` — every PR and push to main: install, lint, build. Fast feedback, no Docker.
- `docker-publish.yml` — push to main (and version tags `v*`): buildx → push to GHCR with tags `latest`, `sha-<short>`, and the git tag when present. Uses the built-in `GITHUB_TOKEN` (needs `packages: write` permission, already set in the workflow) — no PAT required.

### GHCR visibility

First push creates the package as **private**. Either make the package public (Settings on the package page) or add a registry login on Unraid (`docker login ghcr.io` with a read-only PAT). Private + PAT is the sane default for a homelab app.

## Unraid setup

Two options; the compose file in the repo (`docker-compose.example.yml`) documents the intended config either way.

**Option A — Unraid Docker template (Community Applications style):**
- Add container manually: repository `ghcr.io/<owner>/dan-land:latest`, port `3000 → 3000` (or whatever host port), env vars from `.env.example`.
- Put it on the same custom Docker network as Plex/*arr containers so it can reach them by container name (`http://plex:32400`) instead of host IPs.

**Option B — Compose Manager plugin:** paste/adapt `docker-compose.example.yml`.

### Updates

- Simplest: Unraid UI → container → "force update" after CI pushes.
- Automatic: install a Watchtower container or the "Auto Update Applications" plugin watching the `latest` tag. Fine for this app; nothing mission-critical.
- Later idea: a webhook endpoint or a tiny SSH step in the Actions workflow to trigger the pull automatically on deploy. Parked until manual gets annoying.

## HTTPS / access

- LAN-only to start: `http://<unraid-ip>:<port>`. Plex's auth redirect works fine with plain http on LAN since the token never travels via URL.
- If exposing outside: put it behind the existing reverse proxy (SWAG / Nginx Proxy Manager / Traefik — whatever the box runs) with a real cert, and set `APP_URL` accordingly. Session cookie is `secure` when `APP_URL` is https.

## Reaching services: dev vs prod

Service base URLs are env vars, and the value differs by where the app runs — the code never knows the difference:

| | Where the app runs | Service URLs look like |
|---|---|---|
| **Dev** | Dan's machine (localhost) | Tailscale hostname of the Unraid host: `http://unraid.<tailnet>.ts.net:7878` |
| **Prod** | Container on Unraid | Container names on a shared custom Docker network: `http://radarr:7878`, `http://plex:32400` |

Notes:
- Tailscale exposes **all ports** on the Unraid host, and the *arr apps / qBittorrent / Tautulli serve their API on the same port as their web UI — so one hostname covers everything. Requires services to publish ports to the host (Unraid's default bridge mode does).
- In prod, container-name URLs mean no Tailscale dependency and no traffic leaving the box. Falling back to `http://<unraid-ip>:<port>` also works if a service isn't on the shared network.

## Runtime env vars

Everything in `.env.example`, injected via the Unraid template / compose `environment:` block. **Never bake env values into the image** — same image runs anywhere.
