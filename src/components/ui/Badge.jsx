const VARIANTS = {
  default:          'bg-brand-surface-container-high text-brand-on-surface-variant',
  pending:          'bg-brand-secondary-container/20 text-brand-secondary',
  preparing:        'bg-blue-100 text-blue-800',
  'out for delivery': 'bg-pink-100 text-pink-800',
  delivered:        'bg-green-100 text-green-800',
  cancelled:        'bg-brand-error/10 text-brand-error',
  instock:          'bg-green-100 text-green-700',
  lowstock:         'bg-brand-secondary-container/30 text-brand-secondary',
  outofstock:       'bg-brand-error/10 text-brand-error',
}

export function Badge({ label, variant }) {
  const key = (variant ?? label ?? '').toLowerCase().replace(/\s+/g, '')
  const cls = VARIANTS[key] ?? VARIANTS.default
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      {label}
    </span>
  )
}
