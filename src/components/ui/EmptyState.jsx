export function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-6 card-glass border-dashed border-2 border-brand-secondary/10 bg-white/20">
      {icon && <div className="mb-6 text-6xl animate-bounce" aria-hidden="true">{icon}</div>}
      <h3 className="font-display text-2xl font-bold text-brand-on-surface mb-2">{title}</h3>
      {message && <p className="text-sm font-light text-brand-on-surface-variant max-w-sm mb-8">{message}</p>}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        {action}
      </div>
    </div>
  )
}
