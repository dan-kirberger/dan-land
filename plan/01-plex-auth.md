# Plex Authentication

Plex does **not** implement standard OAuth2/OIDC. It uses a PIN-based flow against `plex.tv`. No client secret, no redirect-URI registration, no app registration at all — the app just needs a stable, self-chosen **client identifier**.

## The PIN flow

1. **Create a PIN** (server-side):
   `POST https://plex.tv/api/v2/pins` with `strong=true`, headers:
   - `X-Plex-Product: dan-land`
   - `X-Plex-Client-Identifier: <PLEX_CLIENT_ID>` (stable UUID from env)
   - `Accept: application/json`

   Response contains `id` and `code`.

2. **Send the user to Plex** (browser redirect):
   `https://app.plex.tv/auth#?clientID=<PLEX_CLIENT_ID>&code=<pin code>&context%5Bdevice%5D%5Bproduct%5D=dan-land&forwardUrl=<APP_URL>/api/auth/callback`

   User approves in the Plex UI, then Plex redirects to `forwardUrl` (no token in the URL — that's what the polling is for).

3. **Claim the token**: on callback (or by polling while the tab is away),
   `GET https://plex.tv/api/v2/pins/<id>` with the same client identifier.
   Once approved, the response includes `authToken`. PINs expire (~15 min); store the pin `id` in a short-lived cookie between steps 1 and 3.

4. **Verify the user**:
   `GET https://plex.tv/api/v2/user` with `X-Plex-Token: <authToken>`.
   Gives `id`, `uuid`, `username`, `email`, `thumb` (avatar).

5. **Authorize**: check the user against the allowlist before creating a session (see below).

## Authorization (who gets in)

Plex login only proves "this is a Plex account" — any Plex user on earth can complete the flow. Gate on one (or both) of:

- **Allowlist** (`PLEX_ALLOWED_USERS` env: comma-separated usernames/emails) — simplest, start here.
- **Server membership**: check the user has access to *our* PMS via `GET https://plex.tv/api/v2/resources` (their token must list our server's `clientIdentifier`) or the friends API. Nice later; allowlist first.

## Sessions

- Don't use Auth.js/NextAuth: its OAuth providers can't model the PIN flow, and a custom-credentials contortion buys nothing for a two-route flow. Hand-roll:
  - Encrypted JWT or sealed cookie (e.g. `jose` EncryptedJWT or `iron-session`) containing Plex user id, username, thumb, and the Plex `authToken` (needed for later Plex API calls on the user's behalf).
  - `httpOnly`, `secure`, `sameSite=lax`, 30-day expiry, `SESSION_SECRET` from env.
- Route guard in **`proxy.ts`** (Next 16 renamed `middleware.ts` → `proxy.ts` — check `node_modules/next/dist/docs/.../proxy.md`): everything except `/login`, `/api/auth/*`, and static assets requires a valid session; otherwise redirect to `/login`.

## Routes to build

| Route | Purpose |
|---|---|
| `/login` | Page with "Sign in with Plex" button |
| `/api/auth/plex` | Creates PIN, sets pin-id cookie, redirects to app.plex.tv |
| `/api/auth/callback` | Polls/claims PIN, verifies user, checks allowlist, sets session cookie, redirects to `/` |
| `/api/auth/logout` | Clears session cookie |

## Env vars

| Var | Meaning |
|---|---|
| `PLEX_CLIENT_ID` | Stable UUID identifying this app to Plex (generate once, never change — changing it invalidates nothing but shows up as a "new device") |
| `SESSION_SECRET` | 32+ byte random secret for cookie encryption |
| `APP_URL` | Public base URL of the app (for `forwardUrl`) |
| `PLEX_ALLOWED_USERS` | Comma-separated Plex usernames/emails allowed in |

## Gotchas

- All plex.tv requests need `Accept: application/json` or you get XML.
- The `X-Plex-Client-Identifier` **must be identical** across pin-create and pin-claim, or the claim 404s.
- Users who log in via "managed/home" accounts may not have an email — allowlist by username too.
- Plex tokens don't expire on a schedule but can be revoked from the user's device list; handle 401s from plex.tv by clearing the session.
