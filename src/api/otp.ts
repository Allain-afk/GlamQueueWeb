import { supabase } from '../lib/supabase';

// Generate a 6-digit OTP code
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP in database with expiration (5 minutes)
export async function createAndStoreOTP(email: string, password: string): Promise<{ code: string; error?: any }> {
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
      return { code, error };
    }

    return { code };
  } catch (err) {
    console.error('Error creating OTP:', err);
    return { code, error: err };
  }
}

// Verify OTP and get stored password
export async function verifyOTP(email: string, code: string): Promise<{ password?: string; error?: any }> {
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
    return { error: err };
  }
}

// Send OTP via Supabase Edge Function or email service
export async function sendOTPEmail(email: string, code: string): Promise<{ error?: any }> {
  const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';
  
  if (isProduction) {
    // In production, call Supabase Edge Function to send email
    try {
      const { data, error } = await supabase.functions.invoke('send-otp-email', {
        body: { email, code }
      });

      if (error) {
        console.error('Error calling Edge Function:', error);
        // Fallback to console log if Edge Function fails
        console.log('%c🔐 OTP VERIFICATION CODE', 'font-size: 20px; font-weight: bold; color: #e91e8c;');
        console.log(`%cEmail: ${email}%c\nCode: ${code}`, 'font-size: 16px;', 'font-size: 24px; font-weight: bold; color: #e91e8c;');
        return { error };
      }

      return {};
    } catch (err) {
      console.error('Error sending OTP email:', err);
      // Fallback to console log if Edge Function is not available
      console.log('%c🔐 OTP VERIFICATION CODE', 'font-size: 20px; font-weight: bold; color: #e91e8c;');
      console.log(`%cEmail: ${email}%c\nCode: ${code}`, 'font-size: 16px;', 'font-size: 24px; font-weight: bold; color: #e91e8c;');
      return { error: err };
    }
  } else {
    // In development, log the code to console
    console.log('%c🔐 OTP VERIFICATION CODE', 'font-size: 20px; font-weight: bold; color: #e91e8c;');
    console.log(`%cEmail: ${email}%c\nCode: ${code}`, 'font-size: 16px;', 'font-size: 24px; font-weight: bold; color: #e91e8c;');
    console.log('%c⚠️ In production, this code would be sent via email!', 'font-size: 14px; color: #ff9800;');
  }
  
  return {};
}

