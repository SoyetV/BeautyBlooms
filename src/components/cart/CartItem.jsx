// src/components/cart/CartItem.jsx
// Modern Flora — inline qty stepper, "Remove" text link, opaque thumbnail.

import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/utils/formatCurrency'

export function CartItem({ item }) {
  const { updateQty, removeItem } = useCart()

  return (
    <li className="flex gap-4 py-4">
      {/* Thumbnail */}
      <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-surface-2 border border-border">
        {item.image_url
          ? <img src={item.image_url} alt="" className="h-full w-full object-cover" />
          : (
            <div className="flex h-full w-full items-center justify-center bg-surface-2" aria-hidden="true">
              <span className="material-symbols-outlined text-primary-300" style={{ fontSize: '24px' }}>local_florist</span>
            </div>
          )
        }
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-body-sm font-medium text-foreground truncate leading-snug">
            {item.name}
          </p>
          <p className="price text-price-sm text-foreground shrink-0">
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>
        <p className="text-body-xs text-subtle">{formatCurrency(item.price)} each</p>

        {/* Qty stepper + remove */}
        <div className="flex items-center justify-between mt-1.5">
          <div className="inline-flex items-center rounded-full border border-border bg-surface">
            <button
              onClick={() => updateQty(item.id, item.quantity - 1)}
              aria-label={`Decrease ${item.name} quantity`}
              className="inline-flex items-center justify-center h-8 w-8 rounded-full text-muted
                         hover:text-foreground hover:bg-surface-2 transition-colors duration-250 ease-smooth
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }} aria-hidden="true">remove</span>
            </button>
            <span
              className="min-w-[1.5rem] text-center text-body-sm font-semibold text-foreground tabular-nums"
              aria-label={`Quantity: ${item.quantity}`}
            >
              {item.quantity}
            </span>
            <button
              onClick={() => updateQty(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.stock_count}
              aria-label={`Increase ${item.name} quantity`}
              className="inline-flex items-center justify-center h-8 w-8 rounded-full text-muted
                         hover:text-foreground hover:bg-surface-2 transition-colors duration-250 ease-smooth
                         disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }} aria-hidden="true">add</span>
            </button>
          </div>

          <button
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name} from cart`}
            className="text-body-xs text-subtle hover:text-error-fg transition-colors duration-250 ease-smooth
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-md px-1"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}
