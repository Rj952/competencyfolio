'use client';

import { useState, useEffect } from 'react';

export default function InstallPrompt({ variant = 'sidebar', collapsed = false }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        setIsInstalled(true);
        return;
      }

      // Detect iOS
      const ua = window.navigator.userAgent;
      const isiOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
      setIsIOS(isiOS);
    }

    // Listen for the beforeinstallprompt event (Chrome, Edge, Samsung)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  // Don't show if already installed
  if (isInstalled) return null;

  // Only show if we can install (has prompt) or is iOS
  if (!deferredPrompt && !isIOS) return null;

  // ─── SIDEBAR VARIANT ───────────────────────────────────
  if (variant === 'sidebar') {
    return (
      <>
        <div
          onClick={handleInstall}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: collapsed ? '10px 0' : '9px 14px',
            borderRadius: 10,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            background: 'linear-gradient(135deg, rgba(15,118,110,0.12), rgba(14,116,144,0.12))',
            color: '#0f766e',
            border: '1px solid rgba(15,118,110,0.2)',
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'all 0.15s',
          }}
        >
          <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>📲</span>
          {!collapsed && <span style={{ fontSize: 12 }}>Install App</span>}
        </div>

        {/* iOS Install Guide Modal */}
        {showIOSGuide && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: 20,
            }}
            onClick={() => setShowIOSGuide(false)}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 28,
                maxWidth: 340,
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>📲</div>
              <h3
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#115e59',
                  marginBottom: 12,
                }}
              >
                Install CompetencyFolio
              </h3>
              <div style={{ textAlign: 'left', fontSize: 14, color: '#44403c', lineHeight: 1.8 }}>
                <p style={{ margin: '0 0 12px' }}>
                  To install on your iPhone or iPad:
                </p>
                <ol style={{ margin: 0, paddingLeft: 20 }}>
                  <li>
                    Tap the <strong>Share</strong> button{' '}
                    <span style={{ fontSize: 16 }}>⬆</span> at the bottom of Safari
                  </li>
                  <li>
                    Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>
                  </li>
                  <li>
                    Tap <strong>&quot;Add&quot;</strong> in the top right
                  </li>
                </ol>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                style={{
                  marginTop: 20,
                  padding: '10px 28px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#0f766e',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Got it!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // ─── BANNER VARIANT (for landing page) ─────────────────
  return (
    <>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 24px',
          borderRadius: 12,
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
          background: 'linear-gradient(135deg, #115e59, #0e7490)',
          color: '#fff',
          border: 'none',
          transition: 'all 0.2s',
          boxShadow: '0 4px 12px rgba(15,118,110,0.3)',
        }}
        onClick={handleInstall}
      >
        <span style={{ fontSize: 18 }}>📲</span>
        <span>Install App</span>
      </div>

      {/* iOS Install Guide Modal */}
      {showIOSGuide && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
          }}
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 28,
              maxWidth: 340,
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>📲</div>
            <h3
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 20,
                fontWeight: 700,
                color: '#115e59',
                marginBottom: 12,
              }}
            >
              Install CompetencyFolio
            </h3>
            <div style={{ textAlign: 'left', fontSize: 14, color: '#44403c', lineHeight: 1.8 }}>
              <p style={{ margin: '0 0 12px' }}>
                To install on your iPhone or iPad:
              </p>
              <ol style={{ margin: 0, paddingLeft: 20 }}>
                <li>
                  Tap the <strong>Share</strong> button{' '}
                  <span style={{ fontSize: 16 }}>⬆</span> at the bottom of Safari
                </li>
                <li>
                  Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>
                </li>
                <li>
                  Tap <strong>&quot;Add&quot;</strong> in the top right
                </li>
              </ol>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              style={{
                marginTop: 20,
                padding: '10px 28px',
                borderRadius: 10,
                border: 'none',
                background: '#0f766e',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
