export function CategoryFilter({ categories, active, onChange }) {
  const all = ['All', ...categories]

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none" role="group" aria-label="Filter by category">
      {all.map(cat => {
        const isActive = active === cat
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            aria-pressed={isActive}
            className={`shrink-0 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 relative ${
              isActive ? 'text-brand-primary' : 'text-brand-on-surface/50 hover:text-brand-on-surface'
            }`}
          >
            {cat}
            {isActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-primary animate-scale-in" />
            )}
          </button>
        )
      })}
    </div>
  )
}
