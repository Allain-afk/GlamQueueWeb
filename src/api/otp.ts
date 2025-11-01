import { supabase } from '../lib/supabase';

// Generate a 6-digit OTP code
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP in database with expiration (5 minutes)
export async function createAndStoreOTP(email: string, password: string): Promise<{ code: string; error?: Error }> {
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

  try {
    // Store OTP in a temporary table (you'll need to create this in Supabase)
    const { error } = await supabase
      .from('email_otps')
      .insert({
        email: email,
        code: code,
        password_hash: password, // Store password temporarily (will be hashed when creating account)
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
      });

    if (error) {
      // If table doesn't exist, we'll handle it gracefully
      console.error('Error storing OTP:', error);
      return { code, error: new Error(error.message) };
    }

    return { code };
  } catch (err) {
    console.error('Error creating OTP:', err);
    return { code, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// Verify OTP and get stored password
export async function verifyOTP(email: string, code: string): Promise<{ password?: string; error?: Error }> {
  try {
    const { data, error } = await supabase
      .from('email_otps')
      .select('code, password_hash, expires_at')
      .eq('email', email)
      .eq('code', code)
      .single();

    if (error || !data) {
      return { error: new Error('Invalid or expired verification code') };
    }

    // Check if expired
    const expiresAt = new Date(data.expires_at);
    if (expiresAt < new Date()) {
      return { error: new Error('Verification code has expired') };
    }

    // Delete used OTP
    await supabase
      .from('email_otps')
      .delete()
      .eq('email', email)
      .eq('code', code);

    return { password: data.password_hash };
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return { error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// Send OTP via Supabase Edge Function or email service
export async function sendOTPEmail(email: string, code: string): Promise<{ code?: string; error?: Error }> {
  // Always send via Edge Function (works in both dev and production)
  try {
    const { error } = await supabase.functions.invoke('send-otp-email', {
      body: { email, code }
    });

    if (error) {
      console.error('Error calling Edge Function:', error);
      return { code, error: new Error(error.message || 'Failed to send OTP email') };
    }

    return { code };
  } catch (err) {
    console.error('Error sending OTP email:', err);
    return { code, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

