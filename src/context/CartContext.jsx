// src/context/CartContext.jsx
// Manages the shopping cart entirely in localStorage so it survives page
// refreshes and works for both authenticated and guest customers.

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'bloom_cart'

// ── Reducer ───────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(i => i.id === action.payload.id)
      if (existing) {
        return state.map(i =>
          i.id === action.payload.id
            ? { ...i, quantity: Math.min(i.quantity + 1, action.payload.stock_count) }
            : i
        )
      }
      return [...state, { ...action.payload, quantity: 1 }]
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.payload)
    case 'UPDATE_QTY':
      if (action.payload.qty < 1) return state.filter(i => i.id !== action.payload.id)
      return state.map(i =>
        i.id === action.payload.id
          ? { ...i, quantity: Math.min(action.payload.qty, i.stock_count) }
          : i
      )
    case 'CLEAR':
      return []
    default:
      return state
  }
}

// ── Provider ──────────────────────────────────────────────
export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(
    cartReducer,
    [],
    () => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
      } catch {
        return []
      }
    }
  )

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem     = useCallback(product => dispatch({ type: 'ADD_ITEM',    payload: product }), [])
  const removeItem  = useCallback(id      => dispatch({ type: 'REMOVE_ITEM', payload: id      }), [])
  const updateQty   = useCallback((id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } }), [])
  const clearCart   = useCallback(()      => dispatch({ type: 'CLEAR' }), [])

  const totalItems  = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items])
  const totalPrice  = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items])

  const value = { items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
