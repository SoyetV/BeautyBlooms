// src/components/ui/Badge.jsx
const VARIANTS = {
  default:            'bg-surface-container-highest/70 text-on-surface-variant border border-outline/20',
  pending:            'bg-secondary-container/30 text-secondary border border-secondary/20',
  preparing:          'bg-primary-fixed/40 text-on-primary-fixed-variant border border-primary/20',
  'outfordelivery':   'bg-tertiary-fixed/60 text-on-tertiary-fixed-variant border border-tertiary/20',
  delivered:          'bg-primary-container/30 text-on-primary-container border border-primary-container/30',
  cancelled:          'bg-error-container/50 text-on-error-container border border-error/20',
  instock:            'bg-primary-container/20 text-on-primary-container border border-primary-container/30',
  lowstock:           'bg-secondary-container/40 text-on-secondary-container border border-secondary/20',
  outofstock:         'bg-error-container/50 text-on-error-container border border-error/20',
}

export function Badge({ label, variant }) {
  const key = (variant ?? label ?? '').toLowerCase().replace(/\s+/g, '')
  const cls = VARIANTS[key] ?? VARIANTS.default
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium backdrop-blur-md ${cls}`}>
      {label}
    </span>
  )
}