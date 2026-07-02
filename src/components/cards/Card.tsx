import type { ReactNode } from "react";

interface CardProps {
  title: string;
  /** Link to the "real" tool this card summarizes */
  href?: string;
  children: ReactNode;
}

export function Card({ title, href, children }: CardProps) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <header className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          {title}
        </h2>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            open ↗
          </a>
        )}
      </header>
      {children}
    </section>
  );
}

export function CardMessage({ children }: { children: ReactNode }) {
  return <p className="py-6 text-center text-sm text-zinc-500">{children}</p>;
}

export function CardSkeleton({ title }: { title: string }) {
  return (
    <Card title={title}>
      <div className="animate-pulse space-y-2 py-2">
        <div className="h-4 w-3/4 rounded bg-zinc-800" />
        <div className="h-4 w-1/2 rounded bg-zinc-800" />
      </div>
    </Card>
  );
}
