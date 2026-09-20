/**
 * Clearly-labelled ad placeholder container, ready for Google AdSense.
 * Drop the AdSense <ins> / script tag inside this container's children
 * (or replace the placeholder markup) when a publisher ID is available.
 * Keeping slots as distinct, non-clickable containers avoids accidental
 * clicks and fake/misleading ad content.
 */
export function AdSlot({
  label = "Advertisement",
  className = "",
  minHeight = 120,
}: {
  label?: string;
  className?: string;
  minHeight?: number;
}) {
  return (
    <div
      className={`ad-slot flex w-full items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted text-xs text-foreground-muted ${className}`}
      style={{ minHeight }}
      role="complementary"
      aria-label={label}
      data-ad-slot="true"
    >
      {label} · Ad space
    </div>
  );
}
