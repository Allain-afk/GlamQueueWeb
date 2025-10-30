import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getMyProfile, createProfile, type Profile } from '../../api/profile';
import { LogIn, Eye, EyeOff, AlertCircle, UserPlus, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (profile: Profile) => void;
  onClientLogin: () => void;
  onBackToLanding: () => void;
  initialMode?: 'login' | 'signup';
}

export function AdminLogin({ onLoginSuccess, onClientLogin, onBackToLanding, initialMode = 'login' }: AdminLoginProps) {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { signInWithEmail, signUpWithEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        // Sign up flow
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }

        console.log('Attempting sign up with:', email);
        const { data: signUpData, error: signUpError } = await signUpWithEmail(email, password);
        
        if (signUpError) {
          console.error('Sign up error:', signUpError);
          setError(`Sign up failed: ${signUpError.message}`);
          return;
        }

        if (!signUpData.user) {
          setError('Sign up failed. Please try again.');
          return;
        }

        // Create profile for new user
        console.log('Creating profile for new user...');
        try {
          await createProfile(signUpData.user.id, signUpData.user.email);
        } catch (profileError) {
          console.error('Profile creation error:', profileError);
          // Continue even if profile creation fails (might already exist)
        }

        setSuccess('Account created successfully! Redirecting...');
        
        // Auto-login after sign-up
        setTimeout(async () => {
          const { error: signInError } = await signInWithEmail(email, password);
          if (!signInError) {
            const profile = await getMyProfile();
            if (profile) {
              // New users are always clients, redirect to client app
              onClientLogin();
            }
          }
        }, 1500);
      } else {
        // Login flow
        console.log('Attempting login with:', email);
        const { error: signInError } = await signInWithEmail(email, password);
        
        if (signInError) {
          console.error('Sign in error:', signInError);
          setError(`Login failed: ${signInError.message}`);
          return;
        }

        console.log('Sign in successful, getting profile...');
        // Get user profile to check role
        const profile = await getMyProfile();
        console.log('Profile data:', profile);
        
        if (!profile) {
          setError('Profile not found. Please contact administrator.');
          return;
        }

        if (profile.role !== 'admin') {
          // Redirect clients to client app instead of showing error
          console.log(`User with role '${profile.role}' logged in, redirecting to client app...`);
          setLoading(false);
          onClientLogin();
          return;
        }

        console.log('Admin login successful!');
        onLoginSuccess(profile);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : (isSignUp ? 'Sign up failed' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen admin-dashboard flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            {isSignUp ? (
              <UserPlus className="h-8 w-8 text-white" />
            ) : (
              <LogIn className="h-8 w-8 text-white" />
            )}
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {isSignUp ? 'Create Account' : 'Login'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp 
              ? 'Sign up to start booking salon services' 
              : 'Sign in to access your GlamQueue account'}
          </p>
        </div>

        <div className="admin-card p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Back to Landing Page Button */}
            <button
              type="button"
              onClick={onBackToLanding}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-2 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Landing Page</span>
            </button>

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-input"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="admin-input pr-12"
                    placeholder={isSignUp ? 'Create a password (min. 6 characters)' : 'Enter your password'}
                    minLength={isSignUp ? 6 : undefined}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="admin-input pr-12"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="admin-button w-full flex justify-center py-3 px-4 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isSignUp ? 'Creating account...' : 'Signing in...'}
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign in'
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setSuccess(null);
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="w-full flex justify-center py-3 px-4 border-2 border-pink-300 text-sm font-medium rounded-lg text-pink-600 bg-white hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
              >
                {isSignUp ? 'Sign in instead' : 'Sign up for an account'}
              </button>
            </div>
          </form>
        </div>

        {!isSignUp && (
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Enter your credentials to access your account
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
