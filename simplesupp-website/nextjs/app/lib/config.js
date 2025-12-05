// ============================================
// TESTING MODE CONFIGURATION
// ============================================
// Set to TRUE to bypass all premium gates during development
// Set to FALSE for production or to test premium flow
// 
// When TESTING_MODE = true:
//   - All premium features are accessible
//   - No upgrade modals appear
//   - "Free Tier" badge shows as "Testing Mode"
//   - AI features can be tested without Stripe subscription
//
// When TESTING_MODE = false:
//   - Normal premium gating applies
//   - Users see upgrade prompts
//   - Free tier restrictions enforced
//   - Stripe checkout required for premium features
//
// ⚠️ IMPORTANT: Set TESTING_MODE = false before production deployment!
// ============================================

// Testing mode should only be enabled in development
export const TESTING_MODE = process.env.NODE_ENV === 'development';

// Helper function to check if user has premium access
export const hasPremiumAccess = (userIsPremium = false) => {
  return TESTING_MODE || userIsPremium;
};

