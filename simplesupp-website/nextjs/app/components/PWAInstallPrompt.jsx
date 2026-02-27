'use client';

import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if user hasn't dismissed before
      const dismissed = localStorage.getItem('aviera_pwa_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('aviera_pwa_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-[55] rounded-[14px] p-4 flex items-center gap-3"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
    >
      <div
        className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.2)' }}
      >
        <Download size={18} style={{ color: '#00d9ff' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold" style={{ color: 'var(--txt)' }}>
          Install Aviera
        </p>
        <p className="text-[11px]" style={{ color: 'var(--txt-muted)' }}>
          Add to your home screen for quick access.
        </p>
      </div>
      <button
        onClick={handleInstall}
        className="px-3 py-1.5 rounded-[8px] text-[12px] font-semibold flex-shrink-0"
        style={{ background: '#00d9ff', color: '#09090b' }}
      >
        Install
      </button>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1"
      >
        <X size={14} style={{ color: 'var(--txt-dim)' }} />
      </button>
    </div>
  );
}
