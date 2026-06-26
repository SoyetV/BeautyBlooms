// src/components/catalog/CategoryFilter.jsx

export function CategoryFilter({ categories, active, onChange }) {
  const all = ['All', ...categories]

  return (
    <div
      className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0"
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
            className={`whitespace-nowrap px-6 py-2 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all duration-300 ${
              isActive
                ? 'bg-primary text-on-primary shadow-sm'
                : 'glass-panel text-on-surface hover:bg-surface-container-highest hover:text-primary'
            }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}