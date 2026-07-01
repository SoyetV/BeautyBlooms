// src/components/ui/EmptyState.jsx
// Modern Flora — supports Material Symbols names (string) or raw emoji.

export function EmptyState({ icon, title, message, action }) {
  // If icon is a single emoji or short string, render as text. Otherwise treat as Material Symbols name.
  const isMaterialSymbol = icon && /^[a-z_]+$/.test(icon)

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {icon && (
        <div
          className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 border border-border text-muted"
          aria-hidden="true"
        >
          {isMaterialSymbol ? (
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
              {icon}
            </span>
          ) : (
            <span className="text-3xl">{icon}</span>
          )}
        </div>
      )}
      <h3 className="font-display text-display-sm font-semibold text-foreground mb-2">{title}</h3>
      {message && <p className="text-body-md text-muted max-w-xs mb-6 leading-relaxed">{message}</p>}
      {action}
    </div>
  )
}
