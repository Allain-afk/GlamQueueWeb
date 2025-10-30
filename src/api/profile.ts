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
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email: email,
      role: 'client', // Default role for new sign-ups
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    // If profile already exists, try to get it
    if (error.code === '23505') { // Unique violation
      const existing = await getMyProfile();
      if (existing) return existing;
    }
    throw error;
  }
  
  return data as Profile;
}

