/**
 * Unified tracking utility — fires events to both TikTok and Meta pixels.
 *
 * Import these functions instead of calling ttqTrack/fbqTrack directly.
 * If one pixel isn't loaded (e.g. Meta ID not set yet), calls are no-ops.
 */

import { ttqTrack, trackAddToCart as ttAddToCart, trackViewContent as ttViewContent, trackInitiateCheckout as ttInitiateCheckout } from '../components/TikTokPixel';
import { fbqTrack } from '../components/MetaPixel';

// ─── Page View ───
// Handled automatically by TikTokPixel.jsx and MetaPixel.jsx on route change.
// Only call this manually if you need an extra page view (rare).
export function trackPageView() {
  if (typeof window !== 'undefined') {
    if (window.ttq) window.ttq.page();
    if (window.fbq) window.fbq('track', 'PageView');
  }
}

// ─── View Content (product detail opened) ───
export function trackViewContent(productName, productId, price) {
  ttViewContent({
    contentId: productId || productName,
    contentName: productName,
    price: price || 0,
  });
  fbqTrack('ViewContent', {
    content_name: productName,
    content_ids: [productId || productName],
    content_type: 'product',
    value: price || 0,
    currency: 'USD',
  });
}

// ─── Start Quiz ───
export function trackStartQuiz(quizName = 'Supplement Quiz') {
  ttqTrack('StartTrial', { content_name: quizName });
  fbqTrack('StartTrial', { content_name: quizName });
}

// ─── Complete Quiz (lead event) ───
export function trackCompleteQuiz(quizName = 'Supplement Quiz', category = '') {
  ttqTrack('CompleteRegistration', {
    content_name: quizName,
    content_category: category,
  });
  fbqTrack('CompleteRegistration', {
    content_name: quizName,
    content_category: category,
    status: true,
  });
}

// ─── Add to Cart ───
export function trackAddToCart(productName, productId, price, quantity = 1) {
  ttAddToCart({
    contentId: productId || productName,
    contentName: productName,
    price: price || 0,
    quantity,
  });
  fbqTrack('AddToCart', {
    content_name: productName,
    content_ids: [productId || productName],
    content_type: 'product',
    value: (price || 0) * quantity,
    currency: 'USD',
    num_items: quantity,
  });
}

// ─── Initiate Checkout ───
export function trackInitiateCheckout(cartValue, contentIds = []) {
  ttInitiateCheckout({
    contentIds,
    value: cartValue || 0,
  });
  fbqTrack('InitiateCheckout', {
    content_ids: contentIds,
    value: cartValue || 0,
    currency: 'USD',
    num_items: contentIds.length,
  });
}

// ─── Purchase ───
export function trackPurchase(orderValue, contentIds = []) {
  ttqTrack('CompletePayment', {
    content_ids: contentIds,
    value: orderValue || 0,
    currency: 'USD',
  });
  fbqTrack('Purchase', {
    content_ids: contentIds,
    value: orderValue || 0,
    currency: 'USD',
    num_items: contentIds.length,
  });
}

// ─── Submit Form (email capture) ───
export function trackSubmitForm(formName = '') {
  ttqTrack('SubmitForm', { content_name: formName });
  fbqTrack('Lead', { content_name: formName });
}
