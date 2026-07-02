/**
 * Skeleton — loading placeholder
 *
 * Variants:
 *   - text     → single line, sub-body height
 *   - title    → larger, headline height
 *   - circle   → avatar / icon
 *   - card     → rectangular card (image + 2 lines)
 *   - block    → arbitrary block, accepts className for sizing
 *
 * Use inside loading states instead of spinners (better perceived perf).
 */

export default function Skeleton({ variant = 'text', className = '', count = 1 }) {
  const base = 'bg-skeleton bg-[length:200%_100%] animate-shimmer rounded-md';

  const variants = {
    text:   'h-3.5 w-full max-w-[14rem]',
    title:  'h-6 w-full max-w-[10rem]',
    circle: 'h-10 w-10 rounded-full',
    card:   'h-72 w-full rounded-2xl',
    block:  '',
  };

  const variantClass = variants[variant] ?? variants.text;

  if (count > 1) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${base} ${variantClass} ${className}`.trim()}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${base} ${variantClass} ${className}`.trim()}
      aria-hidden="true"
    />
  );
}

/**
 * SkeletonCard — composite loading card matching compact ProductCard layout.
 */
export function SkeletonCard() {
  return (
    <div
      className="card overflow-hidden p-0"
      aria-hidden="true"
    >
      <div className="aspect-square bg-skeleton bg-[length:200%_100%] animate-shimmer" />
      <div className="p-3.5 flex flex-col gap-2">
        <Skeleton variant="text" />
        <Skeleton variant="title" />
        <div className="h-3.5 w-16 mt-1 bg-skeleton bg-[length:200%_100%] animate-shimmer rounded-md" />
      </div>
    </div>
  );
}
