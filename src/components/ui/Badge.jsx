// src/components/ui/Badge.jsx
// Modern Flora — semantic badge variants using new tokens.
// Per ui-ux-pro-max: success→sage, warning→gold, destructive→plum/error, secondary→neutral.

const VARIANTS = {
  // Neutral / default
  default:            'bg-surface-2 text-muted border border-border',
  // Order status — using warm/sage palette, not raw bloom pink
  pending:            'bg-warning-soft text-warning-fg border border-warning/20',
  preparing:          'bg-primary-50 text-primary-700 border border-primary-200',
  outfordelivery:     'bg-sage-100 text-sage-700 border border-sage-200',
  delivered:          'bg-success-soft text-success-fg border border-success/20',
  cancelled:          'bg-error-soft text-error-fg border border-error/20',
  // Inventory states
  instock:            'bg-success-soft text-success-fg border border-success/20',
  lowstock:           'bg-warning-soft text-warning-fg border border-warning/20',
  outofstock:         'bg-error-soft text-error-fg border border-error/20',
}

export function Badge({ label, variant }) {
  const key = (variant ?? label ?? '').toLowerCase().replace(/\s+/g, '')
  const cls = VARIANTS[key] ?? VARIANTS.default
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-body-xs font-medium ${cls}`}
    >
      {label}
    </span>
  )
}
