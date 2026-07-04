import { getPendingRequests, seerrWebUrl } from "@/lib/integrations/seerr/client";
import { Card, CardMessage } from "./Card";

export async function SeerrCard() {
  const result = await getPendingRequests();
  if (result.status === "disabled") return null;

  return (
    <Card title="Seerr — Pending Requests" href={seerrWebUrl()}>
      {result.status === "unreachable" ? (
        <CardMessage>Seerr is unreachable</CardMessage>
      ) : result.data.requests.length === 0 ? (
        <CardMessage>No pending requests</CardMessage>
      ) : (
        <ul className="space-y-2">
          {result.data.requests.map((r) => (
            <li key={r.id} className="flex justify-between gap-2 text-sm">
              <span className="truncate text-zinc-300">
                {r.title}{" "}
                <span className="text-xs text-zinc-500">({r.type})</span>
              </span>
              <span className="shrink-0 text-xs text-zinc-500">
                {r.requestedBy}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
