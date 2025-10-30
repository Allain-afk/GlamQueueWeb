import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const { install, isInstalled, isInstallable } = usePWAInstall();

  useEffect(() => {
    // Don't show if dismissed recently (within 7 days)
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < sevenDays) {
        setShowPrompt(false);
        return;
      }
    }

    // Show prompt if installable and not installed
    if (isInstallable && !isInstalled) {
      setShowPrompt(true);
    } else {
      setShowPrompt(false);
    }
  }, [isInstallable, isInstalled]);

  const handleInstallClick = async () => {
    await install();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-install-content">
        <div className="pwa-install-icon">
          <Download size={24} />
        </div>
        <div className="pwa-install-text">
          <h3>Install GlamQueue</h3>
          <p>Add to your home screen for quick access</p>
        </div>
        <div className="pwa-install-actions">
          <button onClick={handleInstallClick} className="pwa-install-button">
            Install
          </button>
          <button onClick={handleDismiss} className="pwa-dismiss-button">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

