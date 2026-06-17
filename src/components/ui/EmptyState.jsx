// src/components/ui/EmptyState.jsx

export function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {icon && <div className="mb-4 text-5xl" aria-hidden="true">{icon}</div>}
      <h3 className="text-lg font-display font-semibold text-gray-800 mb-1">{title}</h3>
      {message && <p className="text-sm text-gray-500 max-w-xs mb-6">{message}</p>}
      {action}
    </div>
  )
}
