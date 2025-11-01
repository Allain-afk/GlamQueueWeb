import { createClient } from '@supabase/supabase-js';

// Get environment variables
const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
export const isSupabaseConfigured = !!(url && anon && url !== 'https://placeholder.supabase.co' && anon !== 'placeholder-key');

// Validate environment variables (don't throw - allow app to render)
let supabaseInstance;

if (!url || !anon) {
  // Log warnings but don't crash the app
  console.error('⚠️ Missing Supabase environment variables!');
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.error('Please set these in Vercel environment variables');
  console.error('Go to: Vercel Dashboard > Your Project > Settings > Environment Variables');
  
  // Create a dummy client to prevent crashes
  // This allows the app to render with an error message instead of white screen
  const dummyUrl = url || 'https://placeholder.supabase.co';
  const dummyAnon = anon || 'placeholder-key';
  
  supabaseInstance = createClient(dummyUrl, dummyAnon, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
} else {
  supabaseInstance = createClient(url, anon, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
}

export const supabase = supabaseInstance;

