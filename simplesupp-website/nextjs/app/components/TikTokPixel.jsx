'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const TIKTOK_PIXEL_ID = 'D743DPRC77U40JR6AEB0';

export default function TikTokPixel() {
  // Initialize pixel on mount
  useEffect(() => {
    if (typeof window === 'undefined' || window.ttq) return;

    // TikTok base pixel code
    !function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = w[t] = w[t] || [];
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
      ttq.setAndDefer = function (t, e) {
        t[e] = function () {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (t) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      };
      ttq.load = function (e, n) {
        var r = "https://analytics.tiktok.com/i18n/pixel/events.js", o = n && n.partner;
        ttq._i = ttq._i || {};
        ttq._i[e] = [];
        ttq._i[e]._u = r;
        ttq._t = ttq._t || {};
        ttq._t[e] = +new Date;
        ttq._o = ttq._o || {};
        ttq._o[e] = n || {};
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = r + "?sdkid=" + e + "&lib=" + t;
        var first = document.getElementsByTagName("script")[0];
        first.parentNode.insertBefore(script, first);
      };

      ttq.load(TIKTOK_PIXEL_ID);
      ttq.page();
    }(window, document, 'ttq');
  }, []);

  // Track page views on route changes
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.page();
    }
  }, [pathname]);

  return null;
}

// Helper functions for tracking events from anywhere
export function ttqTrack(event, params = {}) {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(event, params);
  }
}

export function trackAddToCart({ contentId, contentName, price, quantity = 1, currency = 'USD' }) {
  ttqTrack('AddToCart', {
    content_id: contentId,
    content_name: contentName,
    content_type: 'product',
    quantity,
    price,
    value: price * quantity,
    currency,
  });
}

export function trackInitiateCheckout({ contentIds = [], value = 0, currency = 'USD' }) {
  ttqTrack('InitiateCheckout', {
    content_ids: contentIds,
    value,
    currency,
  });
}

export function trackViewContent({ contentId, contentName, price, currency = 'USD' }) {
  ttqTrack('ViewContent', {
    content_id: contentId,
    content_name: contentName,
    content_type: 'product',
    price,
    value: price,
    currency,
  });
}
