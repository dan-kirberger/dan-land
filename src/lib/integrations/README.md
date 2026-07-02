# Integrations

One directory per Unraid service. Each integration exposes server-only fetchers and stays independently removable.

```
<name>/client.ts  — server-only fetchers; reads its env vars, throws nothing to the client
<name>/types.ts   — the slice of the service's API responses we actually use
```

Rules (see plan/03-dashboard-ideas.md):
- Env var unset → integration is disabled and its card hidden.
- Service unreachable → card renders an "unreachable" state; never break the page.
- LAN URLs and API keys never reach the browser.
