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
//
// When TESTING_MODE = false:
//   - Normal premium gating applies
//   - Users see upgrade prompts
//   - Free tier restrictions enforced
// ============================================

export const TESTING_MODE = false; // Set to false to enable real Stripe checkout

// Helper function to check if user has premium access
export const hasPremiumAccess = (userIsPremium = false) => {
  return TESTING_MODE || userIsPremium;
};

