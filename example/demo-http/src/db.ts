import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vhnnupxeaidclrlosnen.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZobm51cHhlYWlkY2xybG9zbmVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4ODc0MjEsImV4cCI6MjAzMTQ2MzQyMX0.v3OqV31rVVj3-0GyA8UNeIl2n2o9j8M2QMxAVs8PQ0c'

export const db = createClient(supabaseUrl, supabaseKey)
