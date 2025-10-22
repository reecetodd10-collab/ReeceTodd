# SimpleSupplement - Personalized Supplement Stack Builder

🎉 **EXPANDED TO 30+ SUPPLEMENTS WITH SHOPPING CART!**

## What We Built

A personalized supplement recommendation engine with:

- ✅ **30 Premium Supplements** across 6 categories
- ✅ **Smart Recommendation Engine** based on user quiz
- ✅ **Full Shopping Cart** functionality
- ✅ **Supliful Integration Ready** (product IDs included)
- ✅ **Beautiful UI** with modern design
- ✅ **Mobile Responsive**

## Supplement Database (30 Total)

### Muscle & Strength (8)
1. Creatine Monohydrate
2. Whey Protein Isolate
3. Pre-Workout Formula
4. BCAAs
5. L-Citrulline
6. Beta-Alanine
7. HMB
8. EAAs

### Fat Loss & Metabolism (6)
1. Caffeine
2. Green Tea Extract
3. L-Carnitine
4. CLA
5. Fiber Supplement
6. Apple Cider Vinegar

### Beauty & Anti-Aging (5)
1. Collagen Peptides
2. Biotin
3. Hyaluronic Acid
4. Vitamin C
5. Keratin

### Sleep & Recovery (5)
1. Magnesium Glycinate
2. L-Theanine
3. Melatonin
4. Ashwagandha
5. ZMA

### Focus & Brain (4)
1. Caffeine + L-Theanine Combo
2. Alpha-GPC
3. Lion's Mane Mushroom
4. Rhodiola Rosea

### Longevity & Wellness (7)
1. Omega-3 Fish Oil
2. Vitamin D3 + K2
3. Complete Multivitamin
4. CoQ10
5. Turmeric Curcumin
6. Probiotics
7. Vitamin B12

### Athletic Performance (5)
1. Electrolyte Formula
2. Beetroot Powder
3. Cordyceps Mushroom
4. Tart Cherry Extract
5. Glutamine

## Features

### Quiz System
- Goal selection (8 categories)
- Personal info collection
- Diet type & specific goals
- Smart recommendation algorithm

### Shopping Cart
- Add individual supplements
- Add entire stack with one click
- Quantity controls
- Real-time total calculation
- Beautiful cart modal

### Supliful Integration
- Product IDs included for all supplements
- Price data embedded
- Ready to connect to Supliful API
- Checkout button ready for integration

## Getting Started

### Run Development Server
```bash
npm run dev
```
Server runs on http://localhost:5173

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Next Steps for Supliful Integration

See `SUPLIFUL_INTEGRATION.md` for detailed instructions on:
1. Matching supplements to actual Supliful products
2. Connecting to Shopify (for your 3-day trial)
3. Setting up automated fulfillment
4. Testing the full checkout flow

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Lucide React** - Icons
- **Pure CSS** - No dependencies, fast loading

## File Structure

```
simplesupplement/
├── src/
│   ├── App.jsx          # Main app with 30 supplements + cart
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML entry
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

## How It Works

1. **User takes quiz** → Selects goal (muscle, fat loss, beauty, etc.)
2. **Fills personal info** → Age, activity level, diet type, etc.
3. **Selects specific goals** → Multiple checkboxes based on category
4. **Gets personalized stack** → 5-8 supplements from database of 30
5. **Adds to cart** → Individual or entire stack
6. **Checkout** → (Connect to Supliful for fulfillment)

## Deployment

Ready to deploy to:
- **Vercel** (recommended for React)
- **Netlify**
- **GitHub Pages**
- Any static hosting

## License

MIT

---

Built for dropshipping via Supliful 🚀
