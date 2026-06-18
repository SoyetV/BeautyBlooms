// src/hooks/useOrders.js
// Encapsulates all Supabase order CRUD operations.

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'

export function useOrders() {
  const { isAdmin, user } = useAuth()
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  // ── READ ──────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            unit_price,
            quantity,
            subtotal,
            product_id
          )
        `)
        .order('created_at', { ascending: false })

      // Non-admins only see their own orders
      if (!isAdmin && user) {
        query = query.eq('customer_id', user.id)
      }

      const { data, error: sbError } = await query
      if (sbError) throw sbError
      setOrders(data)
    } catch (err) {
      console.error('[useOrders] fetchOrders:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [isAdmin, user])

  useEffect(() => {
    if (user !== null) fetchOrders()
  }, [fetchOrders, user])

  // ── CREATE (place order + items in one transaction) ──
  async function placeOrder(orderDetails, cartItems) {
    // Generate the order id client-side so we can skip Supabase row-returning.
    const orderId = orderDetails.id ?? crypto.randomUUID()
    const trackingToken = crypto.randomUUID()
    const orderPayload = { id: orderId, tracking_token: trackingToken, ...orderDetails }

    const { error: orderErr } = await supabase
      .from('orders')
      .insert([orderPayload], { returning: 'minimal' })
    if (orderErr) throw orderErr

    const order = {
      id: orderId,
      tracking_token: trackingToken,
      ...orderDetails,
      order_items: cartItems.map(item => ({
        order_id:     orderId,
        product_id:   item.id,
        product_name: item.name,
        unit_price:   item.price,
        quantity:     item.quantity,
        subtotal:     item.price * item.quantity,
      })),
    }

    // 2. Bulk-insert order_items
    const lineItems = order.order_items.map(({ order_id, product_id, product_name, unit_price, quantity }) => ({
      order_id,
      product_id,
      product_name,
      unit_price,
      quantity,
    }))

    const { error: itemsErr } = await supabase.from('order_items').insert(lineItems)
    if (itemsErr) throw itemsErr

    // 3. Decrement stock_count for each product
    for (const item of cartItems) {
      await supabase.rpc('decrement_stock', {
        p_product_id: item.id,
        p_qty:        item.quantity,
      })
    }

    return order
  }

  // ── UPDATE (admin changes status) ─────────────────────
  async function updateOrderStatus(orderId, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, ...data } : o)))
    return data
  }

  return { orders, loading, error, fetchOrders, placeOrder, updateOrderStatus }
}
