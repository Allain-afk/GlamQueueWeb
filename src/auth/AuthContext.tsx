import { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { createAndStoreOTP, sendOTPEmail, verifyOTP } from '../api/otp';

type Ctx = {
  session: Session | null;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  sendOTP: (email: string, password: string) => Promise<{ error?: any }>;
  verifyOTPCode: (email: string, code: string) => Promise<{ data?: any; error?: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Ctx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signInWithEmail = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  const signUpWithEmail = (email: string, password: string) =>
    supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });

  const sendOTP = async (email: string, password: string) => {
    // Generate and store OTP
    const { code, error: createError } = await createAndStoreOTP(email, password);
    
    if (createError) {
      // If table doesn't exist, we'll still generate the code but log it
      console.warn('Could not store OTP in database:', createError);
      console.log(`Generated OTP for ${email}: ${code}`);
    }

    // Send OTP via email
    const { error: sendError } = await sendOTPEmail(email, code);
    
    if (sendError) {
      return { error: sendError };
    }

    // For development: Also log the code to console
    console.log(`🔐 OTP Code for ${email}: ${code}`);
    console.log('📧 In production, this code would be sent via email');

    return {};
  };

  const verifyOTPCode = async (email: string, code: string) => {
    // Verify OTP and get password
    const { password, error: verifyError } = await verifyOTP(email, code);
    
    if (verifyError || !password) {
      return { error: verifyError || new Error('Invalid verification code') };
    }

    // Create account with the password
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });

    if (signUpError) {
      return { error: signUpError };
    }

    return { data: signUpData };
  };

  const signOut = async () => { await supabase.auth.signOut(); };

  return (
    <AuthContext.Provider value={{ session, signInWithEmail, signUpWithEmail, sendOTP, verifyOTPCode, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

