---
name: local-run
description: Build the dan-land Docker image locally and run it in the background so Dan can access it from his phone on the LAN. Use when asked to "run this locally in docker", "let me try it on my phone", or similar. Pass "stop" to tear the container down.
---

# Run dan-land locally in Docker

Builds the production image and runs it detached on port 3000, reachable from the LAN.

If the argument is `stop`: run `docker rm -f dan-land-local`, confirm, and stop here.

## Steps

1. **Ensure the Docker engine is up.** `docker info` — if it fails, start Docker Desktop and poll until ready (~30–60s):
   ```powershell
   Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
   # poll: docker info --format "ok" every 5s, up to 2 minutes
   ```

2. **Build:** `docker build -t dan-land:local .` (from repo root; takes ~30s warm).

3. **Replace any previous container, then run detached** (use `.env.local` if it exists):
   ```powershell
   docker rm -f dan-land-local 2>$null
   docker run -d --name dan-land-local -p 3000:3000 --env-file .env.local dan-land:local
   # omit --env-file if .env.local doesn't exist
   ```

4. **Verify + report.** Confirm `http://localhost:3000` returns 200 (if not, show `docker logs dan-land-local`). Get the LAN IP:
   ```powershell
   Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback|vEthernet|WSL|Tailscale' -and $_.PrefixOrigin -in 'Dhcp','Manual' }
   ```
   Tell Dan the phone URL: `http://<LAN-IP>:3000`, and remind him the container keeps running until `/local-run stop`.

## Notes

- Container name is always `dan-land-local`, image tag `dan-land:local` — never push this tag.
- If the phone can't reach it but localhost works, Windows Firewall is blocking Docker's port proxy; allow inbound TCP 3000 on the Private profile.
- Phone testing also works over Tailscale: `http://moneypit.pig-halibut.ts.net:3000` (Dan's dev PC's tailnet name).
