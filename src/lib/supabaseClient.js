// src/lib/supabaseClient.js
// Single Supabase client instance shared across the entire application.
//
// IMPORTANT: This module MUST NOT throw at module-load time. Throwing here
// crashes the entire React tree (AuthContext imports this at the top of
// App.jsx), producing a white screen on every route — including /admin/login,
// which doesn't even need Supabase to render its form. Instead we log a clear
// error and export `null`; consumers (useProducts, useOrders, AuthContext)
// already have try/catch + error-state UI and will degrade gracefully.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseKey && /^https?:\/\//.test(supabaseUrl)
)

let supabase = null

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  } catch (err) {
    console.error('[Bloom] Failed to initialise Supabase client:', err.message)
    supabase = null
  }
} else {
  console.error(
    '[Bloom] Missing or invalid Supabase environment variables.\n' +
    'Copy .env.example → .env and add your project URL (must start with http:// or https://) and anon key.'
  )
}

export { supabase }