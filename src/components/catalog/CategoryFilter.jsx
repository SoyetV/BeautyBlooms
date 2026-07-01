// src/components/catalog/CategoryFilter.jsx
// Modern Flora — quiet pill row, scrollable on mobile.

export function CategoryFilter({ categories, active, onChange }) {
  const all = ['All', ...categories]

  return (
    <div
      className="flex gap-2 overflow-x-auto scrollbar-none -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0 pb-1"
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
            className={`whitespace-nowrap px-4 py-2 rounded-full text-body-sm font-medium
                        transition-all duration-250 ease-spring
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                        ${isActive
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'bg-surface text-muted border border-border hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50'
                        }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
