import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/utils/formatCurrency'

export function CartItem({ item }) {
  const { updateQty, removeItem } = useCart()

  return (
    <li className="flex gap-4 group animate-fade-in">
      {/* Thumbnail */}
      <div className="h-20 w-20 shrink-0 rounded-2xl overflow-hidden bg-brand-surface-container-low border border-brand-secondary/5">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl bg-brand-surface-container text-brand-on-surface-variant" aria-hidden="true">🌸</div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between min-w-0 py-1">
        <div>
          <h4 className="text-sm font-bold text-brand-on-surface truncate">{item.name}</h4>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mt-1">
            {formatCurrency(item.price)}
          </p>
        </div>

        {/* Qty and Remove */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3 bg-white/50 rounded-full px-2 py-1 border border-brand-secondary/5">
            <button
              onClick={() => updateQty(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="text-brand-on-surface-variant hover:text-brand-primary transition-colors disabled:opacity-20"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
              </svg>
            </button>
            <span className="text-xs font-bold tabular-nums min-w-[12px] text-center">{item.quantity}</span>
            <button
              onClick={() => updateQty(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.stock_count}
              aria-label="Increase quantity"
              className="text-brand-on-surface-variant hover:text-brand-primary transition-colors disabled:opacity-20"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => removeItem(item.id)}
            className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant/40 hover:text-brand-error transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}
