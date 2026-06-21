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
            className="shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200"
            style={
              isActive ? {
                background: 'linear-gradient(135deg, #ec4899, #be185d)',
                color: 'white',
                border: '1px solid transparent',
                boxShadow: '0 4px 12px rgba(236,72,153,0.35)',
                transform: 'translateY(-1px)',
              } : {
                background: 'rgba(255,255,255,0.65)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(249,168,212,0.25)',
                color: '#6b616e',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              }
            }
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.85)'
                e.currentTarget.style.borderColor = 'rgba(236,72,153,0.3)'
                e.currentTarget.style.color = '#be185d'
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.65)'
                e.currentTarget.style.borderColor = 'rgba(249,168,212,0.25)'
                e.currentTarget.style.color = '#6b616e'
              }
            }}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}