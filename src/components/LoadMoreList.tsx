"use client";

import { useState, type ReactNode } from "react";

interface LoadMoreListProps {
  items: ReactNode[];
  batchSize?: number;
  className?: string;
  wrapClassName?: string;
  emptyMessage?: string;
}

export function LoadMoreList({
  items,
  batchSize = 9,
  className = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
  wrapClassName = "",
  emptyMessage = "Kuch nahi mila. Filters change karke try karo!",
}: LoadMoreListProps) {
  const [visible, setVisible] = useState(batchSize);

  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border p-8 text-center text-foreground-muted">
        {emptyMessage}
      </p>
    );
  }

  const shown = items.slice(0, visible);
  const hasMore = visible < items.length;

  return (
    <div>
      <div className={className}>
        {shown.map((item, i) => (
          <div key={i} className={wrapClassName}>{item}</div>
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + batchSize)}
            className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
          >
            Load More ({items.length - visible} more)
          </button>
        </div>
      )}
    </div>
  );
}
