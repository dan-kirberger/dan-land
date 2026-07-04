import { getSabQueue, sabnzbdWebUrl } from "@/lib/integrations/sabnzbd/client";
import { Card, CardMessage } from "./Card";

export async function SabnzbdCard() {
  const result = await getSabQueue();
  if (result.status === "disabled") return null;

  return (
    <Card title="SABnzbd — Queue" href={sabnzbdWebUrl()}>
      {result.status === "unreachable" ? (
        <CardMessage>SABnzbd is unreachable</CardMessage>
      ) : result.data.slots.length === 0 ? (
        <CardMessage>
          {result.data.paused ? "Queue is paused" : "Queue is empty"}
        </CardMessage>
      ) : (
        <ul className="space-y-3">
          {result.data.slots.map((s, i) => (
            <li key={i}>
              <p className="truncate text-sm font-medium text-zinc-100">
                {s.filename}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {s.status}
                {s.timeleft && ` · ${s.timeleft} left`}
                {` · ${s.sizeLeftMb.toFixed(0)} MB left`}
              </p>
              <div className="mt-2 h-1 overflow-hidden rounded bg-zinc-800">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${s.percentage}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
