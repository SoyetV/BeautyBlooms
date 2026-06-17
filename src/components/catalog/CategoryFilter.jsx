// src/components/catalog/CategoryFilter.jsx
// Horizontal scrollable pill-filter for product categories.

export function CategoryFilter({ categories, active, onChange }) {
  const all = ['All', ...categories]

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1"
      role="group"
      aria-label="Filter by category"
    >
      {all.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          aria-pressed={active === cat}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all
            ${active === cat
              ? 'bg-bloom-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-bloom-50 hover:text-bloom-600'
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
