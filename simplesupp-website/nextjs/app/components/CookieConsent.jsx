'use client';

import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            const timer = setTimeout(() => {
                setShowBanner(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        setShowBanner(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookieConsent', 'declined');
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                maxWidth: '430px',
                width: 'calc(100% - 32px)',
                background: '#0a0a0a',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                animation: 'cookieFadeIn 0.4s ease-out forwards',
            }}
        >
            <style>{`
                @keyframes cookieFadeIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(12px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `}</style>

            {/* Text */}
            <div style={{ flex: 1 }}>
                <p
                    style={{
                        fontFamily: "'Oswald', sans-serif",
                        fontSize: '10px',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'rgba(255, 255, 255, 0.5)',
                        margin: '0 0 4px 0',
                    }}
                >
                    Cookies
                </p>
                <p
                    style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '9.5px',
                        lineHeight: '1.5',
                        color: 'rgba(255, 255, 255, 0.45)',
                        margin: 0,
                    }}
                >
                    We use cookies to keep you signed in and improve your experience.
                </p>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <button
                    onClick={handleDecline}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '9px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '6px 10px',
                    }}
                >
                    Decline
                </button>
                <button
                    onClick={handleAccept}
                    style={{
                        background: '#00ffcc',
                        border: 'none',
                        borderRadius: '4px',
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '9px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#000',
                        cursor: 'pointer',
                        padding: '6px 14px',
                    }}
                >
                    Accept
                </button>
            </div>
        </div>
    );
}
