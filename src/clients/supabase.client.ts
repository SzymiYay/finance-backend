import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

if (!supabaseUrl) {
  throw new Error('Missing Supabase environment variables: supabaseUrl')
}

if (!supabaseKey) {
  throw new Error('Missing Supabase environment variables: supabaseKey')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
