import { supabase } from '../lib/supabase';

export type Profile = {
  id: string;
  email: string | null;
  role: 'client' | 'staff' | 'manager' | 'admin';
  created_at: string;
};

export async function getMyProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('id,email,role,created_at')
    .eq('id', user.id)
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function createProfile(userId: string, email: string | null): Promise<Profile> {
  // First, check if profile already exists
  const { data: existingProfile, error: checkError } = await supabase
    .from('profiles')
    .select('id,email,role,created_at')
    .eq('id', userId)
    .single();

  // If profile exists, return it (ignore PGRST116 which means "not found")
  if (existingProfile && !checkError) {
    return existingProfile as Profile;
  }

  // If profile doesn't exist (or error is PGRST116 "not found"), create it
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email: email,
      role: 'client', // Default role for new sign-ups
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    // If profile already exists (race condition), try to get it
    if (error.code === '23505') { // Unique violation
      const { data: profile } = await supabase
        .from('profiles')
        .select('id,email,role,created_at')
        .eq('id', userId)
        .single();
      if (profile) return profile as Profile;
    }
    throw error;
  }
  
  return data as Profile;
}

