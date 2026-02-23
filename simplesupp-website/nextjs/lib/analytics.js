/**
 * Analytics utility for tracking events.
 * Uses window.gtag if available, otherwise no-ops.
 */
export function trackEvent(name, props = {}) {
    if (typeof window === 'undefined') return;

    // No-op in production if gtag is not present
    if (process.env.NODE_ENV === 'production' && !window.gtag) {
        return;
    }

    // Log in development
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[Analytics Event] ${name}:`, props);
    }

    // Send to Google Analytics
    if (window.gtag) {
        window.gtag('event', name, props);
    }
}
