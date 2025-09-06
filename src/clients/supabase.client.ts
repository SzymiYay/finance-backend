import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL?.trim()
const supabaseKey = process.env.SUPABASE_ANON_KEY?.trim()

if (!supabaseUrl) {
  throw new Error('Missing Supabase environment variables: SUPABASE_URL')
}

if (!supabaseKey) {
  throw new Error('Missing Supabase environment variables: SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
