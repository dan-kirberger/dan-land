// Shared fetch helper for integration clients. Server-only.

const TIMEOUT_MS = 5000;

export async function fetchJson<T>(
  url: string,
  headers: Record<string, string> = {},
): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json", ...headers },
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`${res.status} from ${new URL(url).host}`);
  }
  return res.json() as Promise<T>;
}

export function asUnreachable(err: unknown): {
  status: "unreachable";
  error: string;
} {
  return {
    status: "unreachable",
    error: err instanceof Error ? err.message : String(err),
  };
}

/** Read a `<PREFIX>_URL` + `<PREFIX>_API_KEY` env pair; null when either is unset. */
export function serviceConfig(
  prefix: string,
): { baseUrl: string; apiKey: string } | null {
  const baseUrl = process.env[`${prefix}_URL`]?.replace(/\/$/, "");
  const apiKey = process.env[`${prefix}_API_KEY`];
  return baseUrl && apiKey ? { baseUrl, apiKey } : null;
}
