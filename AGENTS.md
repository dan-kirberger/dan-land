<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# dan-land

A personal hub / mega-dashboard for Dan's Unraid homelab: read-only live data from the services on the Unraid box, with links out to the "real" tools for changes.

## Stack & deployment shape

- **Next.js** (App Router, `src/` layout, TypeScript, Tailwind v4). `next.config.ts` sets `output: "standalone"` — required by the Dockerfile; don't remove it.
- **No auth, by design.** The app is read-only and reachable only on the LAN/tailnet — the network is the auth boundary, and it must **never be exposed to the public internet**. Don't add login features; if a task seems to need auth (write actions, public exposure), stop and surface it — there's a parked design in `plan/01-plex-auth.md`.
- **Runs as a Docker container on Unraid.** Built by GitHub Actions, pushed to GHCR, pulled onto the Unraid server. Assume the app runs on the *same LAN* as the services it talks to — internal service URLs (e.g. `http://192.168.x.x:port` or Docker network hostnames) are configured via env vars, never hardcoded.
- **Node 24 / npm.** Dev on Windows, deploy on Linux — avoid platform-specific scripts; keep npm scripts cross-platform.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build (also what the Docker image runs)
- `npm run lint` — eslint

## Conventions

- Planning docs live in `plan/` — one markdown file per topic, numbered for ordering. Check `plan/00-overview.md` for current status/roadmap and update it as work lands.
- Secrets and environment-specific URLs come from env vars only. Document every new env var in `.env.example` with a comment.
- Server-side code talks to Unraid services; the browser talks only to this app. Don't leak internal LAN URLs or service tokens to the client — integration calls go through route handlers / server components.
- Each Unraid service integration is its own module under `src/lib/integrations/` so they can be added/removed independently. See `plan/03-dashboard-ideas.md` for the integration wishlist.

## Deployment notes

- CI: `.github/workflows/` — lint/build on PR, build+push multi-arch image to GHCR on main.
- Image is deployed on Unraid via the Docker template / compose; `plan/02-deployment.md` has the full flow including how updates get pulled.
