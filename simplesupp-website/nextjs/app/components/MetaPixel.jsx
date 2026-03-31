'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const META_PIXEL_ID = '1600105094374902';

export default function MetaPixel() {
  // Initialize pixel on mount
  useEffect(() => {
    if (typeof window === 'undefined' || window.fbq) return;

    // Meta (Facebook) base pixel code
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }, []);

  // Track page views on route changes
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
}

// Helper functions for tracking events from anywhere
export function fbqTrack(event, params = {}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, params);
  }
}

export function fbqTrackCustom(event, params = {}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', event, params);
  }
}
