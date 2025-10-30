import { createClient } from '@supabase/supabase-js';

// Get environment variables
const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!url) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!anon) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

console.log('Supabase URL:', url);
console.log('Supabase Anon Key:', anon ? 'Present' : 'Missing');

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

