import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Next.js only exposes NEXT_PUBLIC_ prefixed vars to the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = []
  if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  
  throw new Error(
    `Missing Supabase environment variables: ${missingVars.join(', ')}\n` +
    `Please create a .env.local file with:\n` +
    `NEXT_PUBLIC_SUPABASE_URL=your_supabase_url\n` +
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key\n` +
    `\nNote: Next.js requires the NEXT_PUBLIC_ prefix for client-side environment variables.`
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

