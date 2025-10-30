import React, { useState } from 'react';
import { RedesignedLandingPage } from './components/RedesignedLandingPage';
import { AdminLogin } from './admin/components/AdminLogin';
import { AdminDashboard } from './admin/components/AdminDashboard';
import { ClientApp } from './client/ClientApp';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { type Profile } from './api/profile';
import './index.css';

type AppState = 'landing' | 'login' | 'admin-dashboard' | 'client-app';

function AppContent() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const { signOut } = useAuth();

  const handleGetStarted = () => {
    console.log('Book Now clicked - Redirecting to sign-up');
    setIsSignUpMode(true);
    setAppState('login');
  };

  const handleLogin = () => {
    setIsSignUpMode(false);
    setAppState('login');
  };

  const handleBackToLanding = () => {
    setIsSignUpMode(false);
    setAppState('landing');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLoginSuccess = (_profile: Profile) => {
    setAppState('admin-dashboard');
  };

  const handleClientLogin = () => {
    setIsSignUpMode(false);
    setAppState('client-app');
  };

  const handleLogout = async () => {
    await signOut();
    setAppState('landing');
  };


  switch (appState) {
    case 'login':
      return (
        <AdminLogin 
          onLoginSuccess={handleLoginSuccess}
          onClientLogin={handleClientLogin}
          onBackToLanding={handleBackToLanding}
          initialMode={isSignUpMode ? 'signup' : 'login'}
        />
      );
    
    case 'admin-dashboard':
      return (
        <AdminDashboard 
          onLogout={handleLogout}
        />
      );
    
    case 'client-app':
      return (
        <ClientApp 
          onBackToLanding={handleBackToLanding}
          onLogout={handleLogout}
          onRequireLogin={() => {
            setIsSignUpMode(true);
            setAppState('login');
          }}
        />
      );
    
    default:
      return (
        <RedesignedLandingPage 
          onGetStarted={handleGetStarted}
          onLogin={handleLogin}
        />
      );
  }
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
