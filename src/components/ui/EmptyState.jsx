// src/components/ui/EmptyState.jsx

export function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {icon && (
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container text-3xl border border-secondary/15 shadow-sm"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{title}</h3>
      {message && <p className="text-sm text-on-surface-variant max-w-xs mb-6">{message}</p>}
      {action}
    </div>
  )
}