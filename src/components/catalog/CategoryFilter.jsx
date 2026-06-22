// src/components/catalog/CategoryFilter.jsx

export function CategoryFilter({ categories, active, onChange }) {
  const all = ['All', ...categories]

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1"
      role="group"
      aria-label="Filter by category"
    >
      {all.map(cat => {
        const isActive = active === cat
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            aria-pressed={isActive}
            className={`shrink-0 rounded-full px-4 py-1.5 font-label-md text-label-md uppercase tracking-wider transition-all duration-300 ${
              isActive
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface/80 backdrop-blur-md border border-outline text-on-surface-variant hover:text-on-surface hover:bg-surface-variant hover:shadow-sm'
            }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}