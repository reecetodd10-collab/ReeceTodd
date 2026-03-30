'use client';

import React, { useState } from 'react';
import { X, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { products as localProducts } from '../data/products';

// ─── Product catalog data (mirrors shop page) ───
const PRODUCT_CATALOG = {
  'flow state x': {
    cat: 'Performance',
    desc: 'L-Citrulline + dual-form L-Arginine. Skin-splitting pumps, insane vascularity. No stim, no crash.',
    tags: ['Pumps', 'Blood Flow', 'No Caffeine'],
    formula: {
      rows: [
        { name: 'L-Citrulline DL-Malate', dose: '400 mg' },
        { name: 'L-Arginine Hydrochloride', dose: '350 mg' },
        { name: 'L-Arginine Alpha-Ketoglutarate', dose: '50 mg' },
      ],
      other: 'Other: Cellulose (vegetable capsule), Brown Rice Flour · 60 caps / 30 servings',
    },
  },
  'creatine': {
    cat: 'Performance',
    desc: 'The most researched supplement ever. Pure creatine monohydrate for strength, power, and muscle volume.',
    tags: ['Strength', 'Power', 'Recovery'],
    formula: {
      rows: [{ name: 'Creatine Monohydrate', dose: '5,000 mg' }],
      other: 'Pure micronized creatine monohydrate · No fillers',
    },
  },
  'whey protein isolate (vanilla)': {
    cat: 'Protein', desc: '100% whey isolate. Fast-absorbing, low-fat, no bloat. Vanilla that mixes smooth.', tags: ['Protein', 'Muscle', 'Recovery'],
    formula: { rows: [{ name: 'Protein (Whey Isolate)', dose: '25 g' }, { name: 'Calories', dose: '120' }, { name: 'Total Fat', dose: '1 g' }, { name: 'Total Carbs', dose: '2 g' }, { name: 'BCAAs', dose: '5.5 g' }], other: 'Whey Protein Isolate, Natural & Artificial Flavors, Lecithin, Sucralose · 30 servings' },
  },
  'whey protein isolate (chocolate)': {
    cat: 'Protein', desc: 'Premium whey isolate in rich Chocolate. High protein per scoop.', tags: ['Protein', 'Muscle', 'Recovery'],
    formula: { rows: [{ name: 'Protein (Whey Isolate)', dose: '25 g' }, { name: 'Calories', dose: '130' }, { name: 'Total Fat', dose: '1.5 g' }, { name: 'Total Carbs', dose: '3 g' }, { name: 'BCAAs', dose: '5.5 g' }], other: 'Whey Protein Isolate, Cocoa Powder, Natural & Artificial Flavors, Lecithin · 30 servings' },
  },
  'plant protein (chocolate)': {
    cat: 'Protein', desc: 'Plant-powered protein for lifters who skip the dairy.', tags: ['Vegan', 'Protein', 'Plant-Based'],
    formula: { rows: [{ name: 'Protein (Pea + Rice)', dose: '20 g' }, { name: 'Calories', dose: '130' }, { name: 'Fiber', dose: '3 g' }, { name: 'Iron', dose: '6 mg' }], other: 'Pea Protein Isolate, Brown Rice Protein, Cocoa, Natural Flavors · 30 servings' },
  },
  'plant protein (vanilla)': {
    cat: 'Protein', desc: "Vegan protein that doesn't taste like dirt.", tags: ['Vegan', 'Protein', 'Plant-Based'],
    formula: { rows: [{ name: 'Protein (Pea + Rice)', dose: '20 g' }, { name: 'Calories', dose: '120' }, { name: 'Fiber', dose: '3 g' }, { name: 'Iron', dose: '6 mg' }], other: 'Pea Protein Isolate, Brown Rice Protein, Natural Vanilla Flavor · 30 servings' },
  },
  'l-glutamine': {
    cat: 'Performance', desc: 'Amino acid for recovery and gut support. Reduces soreness.', tags: ['Recovery', 'Gut Health', 'Muscle'],
    formula: { rows: [{ name: 'L-Glutamine', dose: '5,000 mg' }], other: 'Pure L-Glutamine powder · Unflavored · 60 servings' },
  },
  'beetroot': {
    cat: 'Performance', desc: 'Natural nitrate source for blood flow and endurance.', tags: ['Blood Flow', 'Endurance', 'Nitric Oxide'],
    formula: { rows: [{ name: 'Organic Beetroot Extract', dose: '1,000 mg' }, { name: 'Nitrates (as dietary nitrate)', dose: '~50 mg' }], other: 'Organic Beetroot Powder, Vegetable Capsule · 60 caps / 30 servings' },
  },
  'bcaa shock': {
    cat: 'Recovery', desc: 'Branch-chain aminos for muscle recovery and reduced soreness.', tags: ['BCAAs', 'Recovery', 'Muscle'],
    formula: { rows: [{ name: 'L-Leucine', dose: '3,000 mg' }, { name: 'L-Isoleucine', dose: '1,500 mg' }, { name: 'L-Valine', dose: '1,500 mg' }, { name: 'Total BCAAs (2:1:1)', dose: '6,000 mg' }], other: 'Fruit Punch flavor · 30 servings' },
  },
  'hydration powder (lemonade)': {
    cat: 'Recovery', desc: 'Electrolyte-packed hydration for training and recovery.', tags: ['Hydration', 'Electrolytes', 'Recovery'],
    formula: { rows: [{ name: 'Sodium', dose: '500 mg' }, { name: 'Potassium', dose: '200 mg' }, { name: 'Magnesium', dose: '60 mg' }, { name: 'Calcium', dose: '40 mg' }, { name: 'Vitamin C', dose: '100 mg' }], other: 'Lemonade flavor · Zero sugar · 30 servings' },
  },
  "lion's mane": {
    cat: 'Focus', desc: 'The brain mushroom. Supports cognitive function, memory, and nerve health.', tags: ['Focus', 'Brain Health', 'Mushroom'],
    formula: { rows: [{ name: "Lion's Mane Extract (fruit body)", dose: '1,000 mg' }, { name: 'Beta-Glucans', dose: '≥30%' }], other: 'Organic Lion\'s Mane Mushroom Extract, Vegetable Capsule · 60 caps / 30 servings' },
  },
  'ashwagandha': {
    cat: 'Focus', desc: 'Ancient adaptogen for modern stress. Lowers cortisol, improves recovery.', tags: ['Stress', 'Adaptogen', 'Recovery'],
    formula: { rows: [{ name: 'Ashwagandha Root Extract (KSM-66)', dose: '600 mg' }, { name: 'Withanolides', dose: '≥5%' }], other: 'KSM-66 Ashwagandha, Vegetable Capsule · 60 caps / 30 servings' },
  },
  'sleep formula': {
    cat: 'Sleep', desc: 'Fall asleep faster, stay asleep longer, wake up recovered.', tags: ['Sleep', 'Recovery', 'Relaxation'],
    formula: { rows: [{ name: 'Valerian Root Extract', dose: '500 mg' }, { name: 'GABA', dose: '300 mg' }, { name: 'L-Tryptophan', dose: '200 mg' }, { name: 'Chamomile Extract', dose: '150 mg' }, { name: 'Lemon Balm Extract', dose: '100 mg' }, { name: 'Passion Flower Extract', dose: '100 mg' }, { name: 'Melatonin', dose: '3 mg' }], other: '2 capsules per serving · 30 servings' },
  },
  'sleep support': {
    cat: 'Sleep', desc: 'Gentle sleep support for restless nights. Non-habit forming.', tags: ['Sleep', 'Calm', 'Rest'],
    formula: { rows: [{ name: 'Melatonin', dose: '5 mg' }, { name: 'L-Theanine', dose: '200 mg' }, { name: 'Magnesium (as Glycinate)', dose: '200 mg' }], other: 'Vegetable Capsule · 60 caps / 30 servings' },
  },
  'magnesium': {
    cat: 'Sleep', desc: 'The most absorbable form of magnesium. Supports sleep, reduces cramps.', tags: ['Mineral', 'Sleep', 'Muscle'],
    formula: { rows: [{ name: 'Magnesium (as Magnesium Glycinate)', dose: '400 mg' }, { name: 'Elemental Magnesium', dose: '80 mg' }], other: 'Magnesium Glycinate, Vegetable Capsule · 60 caps / 30 servings' },
  },
  'complete multivitamin': {
    cat: 'Health', desc: 'Complete daily multivitamin with essential vitamins and minerals.', tags: ['Vitamins', 'Daily Health', 'Foundation'],
    formula: { rows: [{ name: 'Vitamin A', dose: '900 mcg' }, { name: 'Vitamin C', dose: '90 mg' }, { name: 'Vitamin D3', dose: '50 mcg (2000 IU)' }, { name: 'Vitamin E', dose: '15 mg' }, { name: 'Vitamin B12', dose: '100 mcg' }, { name: 'Zinc', dose: '11 mg' }, { name: 'Iron', dose: '8 mg' }], other: '+ B-Complex, Selenium, Chromium, Biotin · 60 tablets / 30 servings' },
  },
  'omega-3': {
    cat: 'Health', desc: 'Essential fatty acids for heart, brain, and joint support.', tags: ['Heart', 'Brain', 'Joint Health'],
    formula: { rows: [{ name: 'Fish Oil Concentrate', dose: '1,200 mg' }, { name: 'EPA (Eicosapentaenoic Acid)', dose: '360 mg' }, { name: 'DHA (Docosahexaenoic Acid)', dose: '240 mg' }, { name: 'Total Omega-3s', dose: '720 mg' }], other: 'Molecularly distilled fish oil, softgel capsule · 60 softgels / 30 servings' },
  },
  'probiotic 40': {
    cat: 'Health', desc: 'Double the CFUs plus prebiotics to feed the good bacteria.', tags: ['Gut Health', 'Digestion', 'Prebiotics'],
    formula: { rows: [{ name: 'Probiotic Blend (10 strains)', dose: '40 Billion CFU' }, { name: 'Lactobacillus acidophilus', dose: '10B CFU' }, { name: 'Bifidobacterium lactis', dose: '8B CFU' }, { name: 'Prebiotic Fiber (FOS)', dose: '100 mg' }], other: 'Delayed-release vegetable capsule · 60 caps / 30 servings' },
  },
  'coq10': {
    cat: 'Health', desc: 'Cellular energy production and heart health support.', tags: ['Heart Health', 'Energy', 'Antioxidant'],
    formula: { rows: [{ name: 'Coenzyme Q10 (Ubiquinone)', dose: '200 mg' }, { name: 'BioPerine (Black Pepper Extract)', dose: '5 mg' }], other: 'Enhanced absorption with BioPerine · 60 softgels / 30 servings' },
  },
  'platinum turmeric': {
    cat: 'Health', desc: 'Premium turmeric for inflammation and joint support.', tags: ['Anti-Inflammatory', 'Joint', 'Recovery'],
    formula: { rows: [{ name: 'Turmeric Root Extract', dose: '1,500 mg' }, { name: 'Curcuminoids', dose: '95%' }, { name: 'BioPerine (Black Pepper)', dose: '10 mg' }], other: 'Enhanced absorption formula · 60 caps / 30 servings' },
  },
  'apple cider vinegar': {
    cat: 'Health', desc: 'All the ACV benefits without the taste.', tags: ['Digestion', 'Weight', 'Wellness'],
    formula: { rows: [{ name: 'Apple Cider Vinegar Powder', dose: '500 mg' }, { name: 'Acetic Acid', dose: '5%' }], other: 'With "The Mother" · Vegetable Capsule · 60 caps / 30 servings' },
  },
  'keto bhb': {
    cat: 'Weight', desc: 'Exogenous ketones for keto support and clean energy.', tags: ['Keto', 'Energy', 'Fat Burn'],
    formula: { rows: [{ name: 'BHB Ketone Blend', dose: '2,400 mg' }, { name: 'Calcium BHB', dose: '800 mg' }, { name: 'Sodium BHB', dose: '800 mg' }, { name: 'Magnesium BHB', dose: '800 mg' }], other: '3 capsules per serving · 30 servings' },
  },
  'fat burner': {
    cat: 'Weight', desc: 'Thermogenic fat burner with MCT oil. Burn fat for fuel.', tags: ['Fat Burn', 'MCT', 'Metabolism'],
    formula: { rows: [{ name: 'MCT Oil Powder', dose: '500 mg' }, { name: 'Green Tea Extract (EGCG)', dose: '300 mg' }, { name: 'Caffeine Anhydrous', dose: '200 mg' }, { name: 'L-Carnitine', dose: '500 mg' }, { name: 'CLA', dose: '400 mg' }], other: '2 capsules per serving · 30 servings' },
  },
  'collagen': {
    cat: 'Beauty', desc: 'Grass-fed collagen for skin elasticity, joint support, and recovery.', tags: ['Collagen', 'Skin', 'Joint'],
    formula: { rows: [{ name: 'Hydrolyzed Collagen Peptides (Types I & III)', dose: '10,000 mg' }, { name: 'Vitamin C', dose: '60 mg' }], other: 'Grass-fed, pasture-raised bovine collagen · Unflavored · 30 servings' },
  },
  'green tea extract': {
    cat: 'Weight', desc: 'Natural metabolism booster with EGCG antioxidants.', tags: ['Metabolism', 'Antioxidant', 'Fat Burn'],
    formula: { rows: [{ name: 'Green Tea Leaf Extract', dose: '500 mg' }, { name: 'EGCG', dose: '250 mg' }, { name: 'Caffeine (natural)', dose: '50 mg' }], other: 'Standardized to 50% EGCG · 60 caps / 30 servings' },
  },
  'energy powder': {
    cat: 'Pre-Workout', desc: 'Clean energy without the crash. Smooth, sustained power.', tags: ['Energy', 'Endurance'],
    formula: { rows: [{ name: 'Caffeine', dose: '150 mg' }, { name: 'L-Theanine', dose: '100 mg' }, { name: 'Beta-Alanine', dose: '1,600 mg' }, { name: 'Taurine', dose: '1,000 mg' }], other: 'Fruit Punch / Cotton Candy / Lychee flavors · 30 servings' },
  },
  'alpha energy': {
    cat: 'Pre-Workout', desc: 'Testosterone and energy support in one.', tags: ['Testosterone', 'Drive', 'Vitality'],
    formula: { rows: [{ name: 'Tongkat Ali Extract', dose: '300 mg' }, { name: 'Fenugreek Extract', dose: '300 mg' }, { name: 'Zinc', dose: '15 mg' }, { name: 'Vitamin D3', dose: '2000 IU' }, { name: 'Ashwagandha (KSM-66)', dose: '300 mg' }], other: '3 capsules per serving · 30 servings' },
  },
  'nootropic powder': {
    cat: 'Focus', desc: 'Lock in mentally. Nootropic powder for deep focus.', tags: ['Focus', 'Clarity', 'Nootropic'],
    formula: { rows: [{ name: 'Alpha-GPC', dose: '300 mg' }, { name: "Lion's Mane Extract", dose: '500 mg' }, { name: 'L-Tyrosine', dose: '500 mg' }, { name: 'Caffeine', dose: '100 mg' }, { name: 'L-Theanine', dose: '200 mg' }], other: 'Sour Gummi Worm / Sour Candy flavors · 30 servings' },
  },
};

const OSWALD = 'var(--font-oswald), Oswald, sans-serif';
const SPACE_MONO = 'var(--font-space-mono), Space Mono, monospace';

function getCatalogData(title) {
  const t = (title || '').toLowerCase();
  const keys = Object.keys(PRODUCT_CATALOG).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (t.includes(key)) return PRODUCT_CATALOG[key];
  }
  return null;
}

function parseIngredientsFromHtml(html) {
  if (!html) return null;
  const stripTags = (s) => s.replace(/<[^>]*>/g, '').trim();
  let ingredients = [];
  let servingInfo = null;

  const servingMatch = html.match(/serving\s*size[:\s]*([^<\n]+)/i);
  if (servingMatch) servingInfo = stripTags(servingMatch[1]);

  const listMatch = html.match(/ingredients?\s*:?\s*<\/(?:strong|b|p|h\d)>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i)
    || html.match(/<ul[^>]*>([\s\S]*?)<\/ul>\s*$/i);
  if (listMatch) {
    const items = listMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    if (items && items.length > 0) ingredients = items.map(li => stripTags(li)).filter(Boolean);
  }

  if (ingredients.length === 0) {
    const boldMatch = html.match(/<(?:strong|b)>\s*(?:other\s+)?ingredients?\s*:?\s*<\/(?:strong|b)>\s*([^<]+)/i);
    if (boldMatch) ingredients = boldMatch[1].split(',').map(s => s.trim()).filter(Boolean);
  }

  if (ingredients.length === 0) {
    const plainMatch = html.match(/(?:other\s+)?ingredients?\s*:\s*([^<]+)/i);
    if (plainMatch) ingredients = plainMatch[1].split(',').map(s => s.trim()).filter(Boolean);
  }

  if (ingredients.length === 0) return null;
  return { ingredients, servingInfo };
}

function getFormulaData(product) {
  const catalog = getCatalogData(product.title);
  if (catalog && catalog.formula) {
    return { type: 'formula', ...catalog.formula };
  }

  const title = (product.title || '').toLowerCase();
  const localMatch = localProducts.find(lp => {
    const sName = (lp.suplifulName || '').toLowerCase();
    const pName = (lp.name || '').toLowerCase();
    return title.includes(sName) || sName.includes(title) || title.includes(pName);
  });
  if (localMatch && localMatch.ingredients) {
    const ingredientList = localMatch.ingredients.split(',').map(s => s.trim()).filter(Boolean);
    const servingLine = localMatch.servingSize
      ? `Serving Size: ${localMatch.servingSize}${localMatch.servings ? ` · ${localMatch.servings} servings` : ''}`
      : null;
    return { type: 'ingredients-list', ingredients: ingredientList, servingLine };
  }

  if (product.descriptionHtml) {
    const parsed = parseIngredientsFromHtml(product.descriptionHtml);
    if (parsed) {
      return { type: 'ingredients-list', ingredients: parsed.ingredients, servingLine: parsed.servingInfo ? `Serving Size: ${parsed.servingInfo}` : null };
    }
  }

  if (product.images && product.images.length >= 2) {
    return { type: 'label-image', labelImage: product.images[product.images.length - 1] };
  }

  return { type: 'fallback' };
}

function FormulaSection({ formulaData }) {
  if (!formulaData) return null;

  return (
    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ fontFamily: OSWALD, fontSize: '12px', letterSpacing: '0.2em', color: '#00ffcc', textTransform: 'uppercase', marginBottom: '8px' }}>
        The Formula
      </div>

      {formulaData.type === 'formula' && (
        <>
          {formulaData.rows.map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '11px' }}>
              <span style={{ color: '#ccc' }}>{row.name}</span>
              <span style={{ fontFamily: OSWALD, fontWeight: 700, color: '#00ffcc' }}>{row.dose}</span>
            </div>
          ))}
          {formulaData.other && (
            <div style={{ fontSize: '9px', color: '#444', marginTop: '6px' }}>{formulaData.other}</div>
          )}
        </>
      )}

      {formulaData.type === 'ingredients-list' && (
        <>
          {formulaData.servingLine && (
            <div style={{ fontSize: '9px', color: '#666', marginBottom: '6px' }}>{formulaData.servingLine}</div>
          )}
          {formulaData.ingredients.map((ing, i) => (
            <div key={i} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '11px', color: '#ccc' }}>
              {ing}
            </div>
          ))}
        </>
      )}

      {formulaData.type === 'label-image' && formulaData.labelImage && (
        <div style={{ textAlign: 'center', marginTop: '4px' }}>
          <img src={formulaData.labelImage} alt="Supplement Facts" style={{ maxWidth: '100%', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }} />
          <div style={{ fontSize: '8px', color: '#444', marginTop: '4px' }}>Supplement Facts Label</div>
        </div>
      )}

      {formulaData.type === 'fallback' && (
        <div style={{ fontSize: '10px', color: '#666', fontStyle: 'italic' }}>Full formula available on product label</div>
      )}
    </div>
  );
}

/**
 * ProductDetailModal - Full-screen overlay showing product details, images, formula/ingredients.
 *
 * Props:
 * - product: Shopify product object { title, image, images, price, description, descriptionHtml, variantId }
 * - onClose: callback to close the modal
 * - onAddToCart: optional callback when "Add to Cart" is clicked
 * - adding: boolean, whether currently adding to cart
 * - added: boolean, whether item was just added
 */
export default function ProductDetailModal({ product, onClose, onAddToCart, adding, added }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const catalog = getCatalogData(product.title);
  const formulaData = getFormulaData(product);
  const displayDesc = catalog ? catalog.desc : product.description;
  const displayTags = catalog ? catalog.tags : [];
  const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
        style={{ background: '#0a0a0a', border: '1px solid rgba(0,255,204,0.15)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="flex justify-end p-3 pb-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1 bg-transparent border-none cursor-pointer"
            style={{ fontFamily: SPACE_MONO, fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}
          >
            <X size={14} /> Close
          </button>
        </div>

        {/* Image carousel */}
        {images.length > 0 && (
          <div className="relative" style={{ width: '100%', height: '220px', background: 'linear-gradient(145deg, #111, #0a0a0a)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img
              src={images[currentImageIndex]}
              alt={product.title}
              style={{ maxHeight: '200px', maxWidth: '90%', objectFit: 'contain' }}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 border-none rounded-full p-1.5 cursor-pointer"
                  style={{ color: '#fff' }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 border-none rounded-full p-1.5 cursor-pointer"
                  style={{ color: '#fff' }}
                >
                  <ChevronRight size={18} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <div
                      key={i}
                      className="rounded-full cursor-pointer"
                      style={{ width: '6px', height: '6px', background: i === currentImageIndex ? '#00ffcc' : 'rgba(255,255,255,0.3)' }}
                      onClick={() => setCurrentImageIndex(i)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '16px' }}>
          {/* Category */}
          {catalog?.cat && (
            <div style={{ fontFamily: SPACE_MONO, fontSize: '9px', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '3px' }}>
              {Array.isArray(catalog.cat) ? catalog.cat[0] : catalog.cat}
            </div>
          )}

          {/* Title */}
          <h3 style={{ fontFamily: OSWALD, fontSize: '22px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 6px 0', color: '#fff' }}>
            {product.title}
          </h3>

          {/* Description */}
          <p style={{ fontSize: '11px', color: '#888', lineHeight: 1.5, marginBottom: '10px' }}>
            {displayDesc}
          </p>

          {/* Tags */}
          {displayTags.length > 0 && (
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {displayTags.map((tag) => (
                <span
                  key={tag}
                  style={{ fontSize: '7px', fontWeight: 700, textTransform: 'uppercase', padding: '2px 6px', border: '1px solid rgba(168,85,247,0.25)', borderRadius: '2px', color: '#a855f7' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          {product.price && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontFamily: OSWALD, fontSize: '28px', fontWeight: 700, color: '#fff' }}>
                ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
              </span>
            </div>
          )}

          {/* Add to Cart */}
          {onAddToCart && (
            <button
              onClick={onAddToCart}
              disabled={adding}
              style={{
                display: 'block',
                width: '100%',
                padding: '14px',
                background: added ? '#111' : '#00ffcc',
                border: added ? '1px solid #00ffcc' : 'none',
                borderRadius: '6px',
                fontFamily: OSWALD,
                fontSize: '16px',
                letterSpacing: '0.12em',
                color: added ? '#00ffcc' : '#000',
                textTransform: 'uppercase',
                fontWeight: 700,
                textAlign: 'center',
                cursor: adding ? 'wait' : 'pointer',
                opacity: adding ? 0.7 : 1,
                transition: 'all 0.2s',
                marginBottom: '8px',
              }}
            >
              {adding ? 'Adding...' : added ? 'Added \u2713' : 'Add to Cart'}
            </button>
          )}

          {/* Trust badges */}
          <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '8px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '8px' }}>
            <span>{'\u2713'} Free ship $50+</span>
            <span>{'\u2713'} 30-day guarantee</span>
            <span>{'\u2713'} GMP</span>
          </div>

          {/* Formula / Ingredients */}
          <FormulaSection formulaData={formulaData} />
        </div>
      </div>
    </div>
  );
}
