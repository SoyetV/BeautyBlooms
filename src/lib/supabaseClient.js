// src/lib/supabaseClient.js
// Single Supabase client instance shared across the entire application.
// Import `supabase` from this file everywhere you need DB/Auth/Storage access.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '[Bloom] Missing Supabase environment variables.\n' +
    'Copy .env.example → .env and add your project URL and anon key.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // Persist session in localStorage so users stay logged in across page reloads
    persistSession: true,
    autoRefreshToken: true,
  },
})
