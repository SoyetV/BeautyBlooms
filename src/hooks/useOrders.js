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
          id,
          customer_id,
          tracking_token,
          customer_name,
          customer_email,
          customer_phone,
          delivery_address,
          status,
          total_amount,
          notes,
          created_at,
          updated_at,
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
    const safeOrder = {
      customer_name:     orderDetails.customer_name,
      customer_email:    orderDetails.customer_email,
      customer_phone:    orderDetails.customer_phone,
      delivery_address:  orderDetails.delivery_address,
      notes:             orderDetails.notes,
    }

    const safeItems = cartItems.map(item => ({
      product_id: item.id,
      quantity:   item.quantity,
    }))

    const { data, error } = await supabase
      .rpc('place_order', {
        order_data: safeOrder,
        items: safeItems,
      })
      .single()

    if (error) {
      if (error.message?.includes('Could not find the function')) {
        throw new Error('Secure checkout is not installed yet. Run supabase/schema.sql in Supabase SQL Editor, then try again.')
      }
      throw error
    }

    return {
      ...data,
      ...safeOrder,
      order_items: safeItems,
    }
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
