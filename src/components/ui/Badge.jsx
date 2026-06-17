// src/components/ui/Badge.jsx
const VARIANTS = {
  default:          'bg-gray-100 text-gray-700',
  pending:          'bg-amber-100 text-amber-800',
  preparing:        'bg-blue-100 text-blue-800',
  'out for delivery': 'bg-purple-100 text-purple-800',
  delivered:        'bg-green-100 text-green-800',
  cancelled:        'bg-red-100 text-red-700',
  instock:          'bg-green-100 text-green-700',
  lowstock:         'bg-amber-100 text-amber-700',
  outofstock:       'bg-red-100 text-red-700',
}

export function Badge({ label, variant }) {
  const key = (variant ?? label ?? '').toLowerCase().replace(/\s+/g, '')
  const cls = VARIANTS[key] ?? VARIANTS.default
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  )
}
