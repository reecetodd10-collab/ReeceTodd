# Supliful Integration Guide

## You Have 3 Days to Connect This!

Your Supliful trial includes:
- ✅ 1 store integration (Shopify)
- ✅ Automated fulfillment
- ✅ Sample discounts
- ✅ Basic mockups
- ✅ Help center & email support

## Step-by-Step Integration

### PHASE 1: Match Products (DO THIS FIRST!)

1. **Log into your Supliful dashboard**
   - Go to https://supliful.com/catalog
   - Browse their 267 products

2. **Find matching products for our 30 supplements**
   - Open `src/App.jsx`
   - Search for `SUPPLEMENT_DATABASE`
   - For each supplement, find the matching Supliful product
   - Replace `SUPLIFUL_XXX_ID` with actual Supliful product IDs

**Example:**
```javascript
'Creatine Monohydrate': {
  // ... other fields
  suplifulId: 'ACTUAL_SUPLIFUL_PRODUCT_ID_HERE', // Replace this!
  price: 24.99, // Update to match Supliful's price
}
```

3. **Create a spreadsheet** to track:
   | Our Supplement | Supliful Product Name | Supliful ID | Price |
   |---|---|---|---|
   | Creatine Monohydrate | [Find in catalog] | [ID] | $XX.XX |
   | Whey Protein Isolate | [Find in catalog] | [ID] | $XX.XX |
   | ... | ... | ... | ... |

### PHASE 2: Shopify Setup (Use Your Trial!)

#### Option A: New Shopify Store (Recommended)

1. **Sign up for Shopify** (3-day trial or $1/month for 3 months)
   - Go to https://shopify.com
   - Create store: "SimpleSupplement" or your brand name

2. **Install Supliful App**
   - Shopify Admin → Apps → App Store
   - Search "Supliful"
   - Install and connect your Supliful account

3. **Import Products**
   - In Supliful app → Catalog
   - Add the 30 supplements to your store
   - Customize labels with your branding

#### Option B: Existing Shopify Store

1. Install Supliful app (same as above)
2. Import products to existing store

### PHASE 3: Connect React App to Shopify

You have **3 options**:

#### Option 1: Shopify Buy Button (EASIEST - Start Here!)

1. In Shopify Admin:
   - Sales Channels → Online Store → Preferences
   - Enable "Buy Button" channel

2. Create Buy Buttons for each supplement:
   - Products → Select product → More actions → Create Buy Button
   - Copy embed code

3. Update `App.jsx`:
   ```javascript
   const SUPPLEMENT_DATABASE = {
     'Creatine Monohydrate': {
       // ... existing fields
       shopifyBuyButtonId: 'YOUR_BUY_BUTTON_ID',
       shopifyCheckoutUrl: 'https://your-store.myshopify.com/cart/add?id=VARIANT_ID'
     }
   }
   ```

4. Replace checkout button in cart:
   ```javascript
   // In shopping cart checkout button:
   const handleCheckout = () => {
     // Build Shopify cart URL with all items
     const cartItems = cart.map(item => `${item.variantId}:${item.quantity}`).join(',');
     window.location.href = `https://your-store.myshopify.com/cart/${cartItems}`;
   };
   ```

#### Option 2: Shopify Storefront API (More Control)

1. Generate Storefront API token in Shopify Admin
2. Install Shopify JS Buy SDK:
   ```bash
   npm install shopify-buy
   ```

3. Create Shopify client in `App.jsx`:
   ```javascript
   import Client from 'shopify-buy';

   const shopifyClient = Client.buildClient({
     domain: 'your-store.myshopify.com',
     storefrontAccessToken: 'YOUR_TOKEN'
   });
   ```

4. Add to cart functionality:
   ```javascript
   const checkout = await shopifyClient.checkout.create();
   // Add line items from cart
   const checkoutWithItems = await shopifyClient.checkout.addLineItems(
     checkout.id,
     cart.map(item => ({
       variantId: item.shopifyVariantId,
       quantity: item.quantity
     }))
   );
   // Redirect to checkout
   window.location.href = checkoutWithItems.webUrl;
   ```

#### Option 3: Direct Link to Shopify Store (SIMPLEST)

1. Just link to your Shopify store!
2. Update checkout button:
   ```javascript
   <a href="https://your-store.myshopify.com">
     Checkout on Shopify
   </a>
   ```

### PHASE 4: Get Product IDs from Supliful

**How to find Supliful Product IDs:**

1. **Via Shopify Admin** (after Supliful integration):
   - Products → Select product
   - Look at URL: `.../products/12345678`
   - That's your product ID!

2. **Via Supliful Dashboard**:
   - Catalog → Select product
   - Product details will show ID or SKU
   - Copy to `src/App.jsx`

3. **Via Shopify API**:
   ```bash
   # If you have API access:
   GET /admin/api/2025-01/products.json
   ```

### PHASE 5: Update Prices

1. Check Supliful catalog for actual prices
2. Update each supplement in `SUPPLEMENT_DATABASE`:
   ```javascript
   price: 34.99, // Update to Supliful's price
   ```

### PHASE 6: Testing Workflow

1. **Test Quiz → Recommendations**
   - Go through full quiz
   - Verify correct supplements recommended

2. **Test Cart**
   - Add supplements to cart
   - Adjust quantities
   - Remove items

3. **Test Checkout** (IMPORTANT!)
   - Click "Checkout with Supliful"
   - Should redirect to Shopify checkout
   - Complete test order with test payment
   - Verify Supliful receives order
   - Check that fulfillment is triggered

4. **Test Fulfillment**
   - Supliful should show order in dashboard
   - Status should change to "Fulfilling"
   - Test address gets shipping notification

## Quick Win: Get Running in 1 Hour

**Minimum Viable Integration:**

1. ✅ Find 5-10 most popular Supliful products (creatine, protein, collagen, etc.)
2. ✅ Add them to Shopify via Supliful app
3. ✅ Get Shopify product URLs
4. ✅ Update "Checkout" button to link to your Shopify store
5. ✅ Test one full order

**You don't need ALL 30 supplements to launch!** Start with the essentials:
- Creatine
- Whey Protein
- Pre-Workout
- Collagen
- Magnesium
- Omega-3
- Multivitamin

## Alternative: Wait for Supliful API

Supliful is building a **developer API in 2025**. When it launches:

1. You can integrate directly (no Shopify needed)
2. Checkout happens in your React app
3. Orders sent to Supliful via API
4. Completely white-labeled experience

For now, Shopify is the fastest path!

## Troubleshooting

**"I can't find a supplement in Supliful's catalog"**
- Search for similar products
- Or remove from recommendations (comment out in code)
- Focus on the ones they DO have

**"Prices don't match"**
- Update `price:` field in `SUPPLEMENT_DATABASE`
- Supliful prices may include your markup

**"Checkout isn't working"**
- Check Shopify product IDs are correct
- Verify checkout URL format
- Test with Shopify's test mode

## Get Help

- **Supliful Support**: help@supliful.com
- **Shopify Support**: https://help.shopify.com
- **This app**: Check console errors in browser DevTools

## Next: Deploy to Vercel

Once integrated:
```bash
npm run build
# Deploy dist/ folder to Vercel
```

Your funnel will be:
**User takes quiz → Gets recommendations → Adds to cart → Shopify checkout → Supliful fulfills → Customer gets supplements!**

You handle NO inventory! 🚀

---

**ACTION ITEMS FOR YOUR 3-DAY TRIAL:**

- [ ] Day 1: Map 10 most important supplements to Supliful products
- [ ] Day 1: Set up Shopify + install Supliful app
- [ ] Day 2: Connect checkout button to Shopify
- [ ] Day 2: Test full order flow
- [ ] Day 3: Deploy to Vercel
- [ ] Day 3: Share with first users!

Good luck! 💪
