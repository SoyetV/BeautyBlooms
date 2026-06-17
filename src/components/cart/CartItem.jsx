// src/components/cart/CartItem.jsx

import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/utils/formatCurrency'

export function CartItem({ item }) {
  const { updateQty, removeItem } = useCart()

  return (
    <li className="flex gap-3 py-3">
      {/* Thumbnail */}
      <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-petal-50">
        {item.image_url
          ? <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
          : <div className="flex h-full w-full items-center justify-center text-2xl" aria-hidden="true">🌸</div>
        }
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
        <p className="text-xs text-gray-500">{formatCurrency(item.price)} each</p>

        {/* Qty stepper */}
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => updateQty(item.id, item.quantity - 1)}
            aria-label={`Decrease ${item.name} quantity`}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-bloom-300 hover:text-bloom-600 transition-colors"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          </button>
          <span className="w-5 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
          <button
            onClick={() => updateQty(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.stock_count}
            aria-label={`Increase ${item.name} quantity`}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-bloom-300 hover:text-bloom-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Subtotal + remove */}
      <div className="flex flex-col items-end justify-between shrink-0">
        <span className="text-sm font-semibold text-gray-900">
          {formatCurrency(item.price * item.quantity)}
        </span>
        <button
          onClick={() => removeItem(item.id)}
          aria-label={`Remove ${item.name} from cart`}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Remove
        </button>
      </div>
    </li>
  )
}
