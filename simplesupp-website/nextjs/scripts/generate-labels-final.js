const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ── Configuration ──────────────────────────────────────────────────────────
const DATA_PATH = 'C:/Users/reece/Desktop/Aviera_Supplement_Facts_Data.json';
const OUTPUT_DIR = 'C:/Users/reece/Desktop/Aviera_Labels';

const CATEGORY_COLORS = {
  'Performance': '#00e5ff',
  'Pre-Workout': '#FF3B3B',
  'Protein':     '#8B5CF6',
  'Recovery':    '#FFD700',
  'Sleep':       '#6366F1',
  'Focus':       '#3B82F6',
  'Weight':      '#F97316',
  'Beauty':      '#EC4899',
  'Health':      '#22C55E',
};

function getCat(name) {
  const n = name.toLowerCase();
  if (/flow state x$/i.test(n)) return 'Performance';
  if (/nitric(?!.*shock)|creatine|beetroot|glutamine/i.test(n)) return 'Performance';
  if (/pre.?workout|alpha energy|nitric shock|coq10|ubiquinone/i.test(n)) return 'Pre-Workout';
  if (/protein|whey|plant protein/i.test(n)) return 'Protein';
  if (/hydration|electrolyte|bcaa/i.test(n)) return 'Recovery';  // ALL BCAAs → Recovery
  if (/energy powder/i.test(n)) return 'Pre-Workout';  // Energy powders → Pre-Workout (Red)
  if (/nootropic|lion.?s mane|methylene|focus|cognitive/i.test(n)) return 'Focus';
  if (/sleep|melatonin|magnesium|ashwagandha/i.test(n)) return 'Sleep';
  if (/fat.?burn|keto|weight|metabolism|thermogenic|green tea/i.test(n)) return 'Weight';
  if (/collagen|hyaluronic|vitamin glow|skin|beauty|hair/i.test(n)) return 'Beauty';
  return 'Health';
}

// ── Helpers ────────────────────────────────────────────────────────────────

function safeName(name) {
  return name.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '');
}

/** Per-product label size overrides from Supliful (width x height in inches at 300dpi) */
const SIZE_OVERRIDES = {
  'Creatine Monohydrate': { w: 1800, h: 750 },                              // 6" x 2.5"
  'Pre Workout (Fruit Punch)': { w: 2700, h: 1200 },                       // 9" x 4"
  'Advanced 100% Whey Protein Isolate (Chocolate)': { w: 4500, h: 1350 }, // 15" x 4.5"
  'Advanced 100% Whey Protein Isolate (Vanilla)': { w: 4500, h: 1350 },   // 15" x 4.5"
  'Plant Protein (Chocolate)': { w: 4500, h: 1350 },                       // 15" x 4.5"
  'Plant Protein (Vanilla)': { w: 4500, h: 1350 },                         // 15" x 4.5"
  'BCAA Shock Powder (Fruit Punch)': { w: 2700, h: 1200 },                 // 9" x 4"
  'BCAA Post Workout Powder (Honeydew/Watermelon)': { w: 2700, h: 1200 }, // 9" x 4" (matches BCAA Shock)
  'Creatine + Electrolyte Powder': { w: 3300, h: 900 },                   // 11" x 3"
  'L-Glutamine Powder': { w: 1800, h: 750 },                               // 6" x 2.5"
  'Beetroot Powder': { w: 3225, h: 495 },                                  // 10.75" x 1.65"
  "Lion's Mane Mushroom": { w: 1650, h: 525 },                             // 5.5" x 1.75"
  'Vitamin Glow Serum': { w: 1050, h: 450 },                               // 3.5" x 1.5"
  'Hyaluronic Acid Serum': { w: 1050, h: 450 },                            // 3.5" x 1.5"
  'Grass-Fed Hydrolyzed Collagen Peptides': { w: 2700, h: 1200 },          // 9" x 4"
};

/** Return {width, height} in pixels at 300 dpi */
function getDimensions(productName, data) {
  // Check per-product overrides first
  if (SIZE_OVERRIDES[productName]) return SIZE_OVERRIDES[productName];
  if (data.type === 'powder') return { w: 2550, h: 600 };  // 8.5" x 2"
  return { w: 1800, h: 750 };  // 6" x 2.5"
}

/** Derive a lighter tint for gradient endpoints */
function lightenHex(hex, mix) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  const lr = Math.round(r + (255-r)*mix), lg = Math.round(g + (255-g)*mix), lb = Math.round(b + (255-b)*mix);
  return `#${lr.toString(16).padStart(2,'0')}${lg.toString(16).padStart(2,'0')}${lb.toString(16).padStart(2,'0')}`;
}

/** Derive a darker shade for gradient endpoint */
function darkenHex(hex, factor) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  const dr = Math.round(r*factor), dg = Math.round(g*factor), db = Math.round(b*factor);
  return `#${dr.toString(16).padStart(2,'0')}${dg.toString(16).padStart(2,'0')}${db.toString(16).padStart(2,'0')}`;
}

function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

/** Escape HTML entities */
function esc(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Smart product name splitting ───────────────────────────────────────────

function parseProductDisplay(fullName) {
  // Try to split "Product Name (Flavor)" or "Product Name — Flavor"
  let line1 = fullName;
  let flavor = '';
  let subtitle = '';

  // Extract parenthetical as flavor
  const parenMatch = fullName.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (parenMatch) {
    line1 = parenMatch[1].trim();
    flavor = parenMatch[2].trim();
  }

  return { line1, flavor };
}

function getFormType(data) {
  if (data.type === 'powder') return 'Powder';
  if (data.type === 'liquid') return 'Serum';
  if (data.servingSize && /gumm/i.test(data.servingSize)) return 'Gummies';
  if (data.servingSize && /softgel/i.test(data.servingSize)) return 'Softgels';
  return 'Capsules';
}

function getTagline(productName, category) {
  const n = productName.toLowerCase();
  if (/alpha energy/i.test(n)) return 'Testosterone support & male vitality*';
  if (/^pre workout|nitric shock/i.test(n)) return 'Maximum pump & explosive energy*';
  if (/flow state x$/i.test(n)) return 'Nitric oxide & blood flow support*';
  if (/nootropic|flow state.*powder/i.test(n)) return 'Focus, memory & mental clarity*';
  if (/creatine.*electrolyte|electrolyte.*creatine/i.test(n)) return 'Muscle strength & electrolyte balance*';
  if (/creatine/i.test(n)) return 'Strength, power & muscle support*';
  if (/bcaa shock/i.test(n)) return 'Muscle recovery & endurance*';
  if (/bcaa post/i.test(n)) return 'Post-workout recovery & repair*';
  if (/hydration/i.test(n)) return 'Replenishes electrolytes & supports recovery*';
  if (/whey.*protein/i.test(n)) return 'Premium isolate for lean muscle*';
  if (/plant.*protein/i.test(n)) return 'Plant-powered muscle recovery*';
  if (/collagen/i.test(n)) return 'Skin, hair, nails & joint support*';
  if (/hyaluronic/i.test(n)) return 'Deep hydration & skin plumping*';
  if (/vitamin glow/i.test(n)) return 'Radiant skin & glow support*';
  if (/sleep support/i.test(n)) return 'Deep, restful sleep support*';
  if (/sleep formula/i.test(n)) return 'Calm relaxation & sleep quality*';
  if (/ashwagandha/i.test(n)) return 'Stress relief & calm focus*';
  if (/magnesium/i.test(n)) return 'Relaxation, sleep & muscle recovery*';
  if (/lion.?s mane/i.test(n)) return 'Brain health & cognitive support*';
  if (/omega/i.test(n)) return 'Heart, brain & joint health*';
  if (/coq10/i.test(n)) return 'Cellular energy & heart health*';
  if (/turmeric.*gumm/i.test(n)) return 'Joint comfort & antioxidant support*';
  if (/turmeric|platinum/i.test(n)) return 'Joint health & inflammation support*';
  if (/probiotic.*40/i.test(n)) return 'Advanced gut health with prebiotics*';
  if (/probiotic/i.test(n)) return 'Digestive balance & immune support*';
  if (/gut health/i.test(n)) return 'Digestive wellness & gut balance*';
  if (/apple cider/i.test(n)) return 'Digestive support & metabolism*';
  if (/keto.?5/i.test(n)) return 'Thermogenic fat burning support*';
  if (/keto.*bhb/i.test(n)) return 'Exogenous ketones for ketosis*';
  if (/fat burner/i.test(n)) return 'Metabolic boost & fat oxidation*';
  if (/beetroot.*powder/i.test(n)) return 'Nitric oxide & endurance support*';
  if (/beetroot/i.test(n)) return 'Natural nitric oxide booster*';
  if (/glutamine/i.test(n)) return 'Muscle recovery & gut health*';
  if (/multivitamin.*gumm/i.test(n)) return 'Daily nutrition made delicious*';
  if (/multivitamin|complete multi/i.test(n)) return 'Complete daily nutrition*';
  if (/energy powder/i.test(n)) return 'Clean energy & sustained focus*';
  return 'Premium quality supplement*';
}

function getBenefits(productName, category) {
  const n = productName.toLowerCase();
  if (/alpha energy/i.test(n)) return ['Energy','Strength','Vitality'];
  if (/^pre workout|nitric shock/i.test(n)) return ['Pump','Energy','Endurance'];
  if (/flow state x$/i.test(n)) return ['Blood Flow','Pump','Performance'];
  if (/nootropic|flow state.*powder/i.test(n)) return ['Focus','Memory','Clarity'];
  if (/creatine.*electrolyte|electrolyte.*creatine/i.test(n)) return ['Strength','Hydration','Recovery'];
  if (/creatine/i.test(n)) return ['Strength','Power','Recovery'];
  if (/bcaa/i.test(n)) return ['Recovery','Endurance','Lean Muscle'];
  if (/hydration/i.test(n)) return ['Hydration','Electrolytes','Recovery'];
  if (/whey.*protein|plant.*protein/i.test(n)) return ['Muscle','Recovery','Lean'];
  if (/collagen/i.test(n)) return ['Skin','Joints','Hair'];
  if (/hyaluronic/i.test(n)) return ['Hydration','Plumping','Glow'];
  if (/vitamin glow/i.test(n)) return ['Glow','Radiance','Nourish'];
  if (/sleep/i.test(n)) return ['Sleep','Calm','Recovery'];
  if (/ashwagandha/i.test(n)) return ['Calm','Focus','Adapto'];
  if (/magnesium/i.test(n)) return ['Relax','Sleep','Muscle'];
  if (/lion.?s mane/i.test(n)) return ['Brain','Focus','Memory'];
  if (/omega/i.test(n)) return ['Heart','Brain','Joints'];
  if (/coq10/i.test(n)) return ['Heart','Energy','Cells'];
  if (/turmeric|platinum/i.test(n)) return ['Joints','Comfort','Anti-Ox'];
  if (/probiotic/i.test(n)) return ['Gut','Immune','Balance'];
  if (/gut health|apple cider/i.test(n)) return ['Digest','Balance','Wellness'];
  if (/keto|fat burner/i.test(n)) return ['Burn','Energy','Metabolism'];
  if (/beetroot/i.test(n)) return ['Endurance','Nitric Oxide','Stamina'];
  if (/glutamine/i.test(n)) return ['Recovery','Gut','Muscle'];
  if (/multivitamin/i.test(n)) return ['Vitamins','Minerals','Daily'];
  if (/energy powder/i.test(n)) return ['Energy','Focus','Endurance'];
  return ['Health','Wellness','Daily'];
}

// ── Net Quantity Calculation ───────────────────────────────────────────────

function getNetQuantity(data) {
  // Allow per-product override (e.g., Supliful says 90 capsules)
  if (data.netQuantity) return data.netQuantity;

  if (!data.servingSize || !data.servings || data.servings === 'N/A') return '';
  const servings = parseInt(data.servings, 10);
  if (isNaN(servings)) return '';

  const ss = data.servingSize.toLowerCase();

  // Parse unit count from serving size (e.g., "4 Capsules" → 4, "2 Gummies" → 2)
  const countMatch = ss.match(/(\d+)\s*(capsule|softgel|gumm|vegan capsule|tablet)/i);
  if (countMatch) {
    const perServing = parseInt(countMatch[1], 10);
    const total = perServing * servings;
    const unit = ss.includes('gumm') ? 'Gummies' : ss.includes('softgel') ? 'Softgels' : 'Capsules';
    return `${total} ${unit}`;
  }

  // For powders, compute net weight — match "(5.4g)" or "(7g)"
  const weightMatch = ss.match(/\((\d+\.?\d*)\s*g\)/i);
  if (weightMatch) {
    const perServing = parseFloat(weightMatch[1]);
    const totalG = Math.round(perServing * servings);
    const totalOz = (totalG / 28.3495).toFixed(1);
    return `Net Wt. ${totalG}g (${totalOz} oz)`;
  }

  // Match "6.5 g" or "10 g" (no parentheses)
  const bareWeightMatch = ss.match(/^(\d+\.?\d*)\s*g\b/i);
  if (bareWeightMatch) {
    const perServing = parseFloat(bareWeightMatch[1]);
    const totalG = Math.round(perServing * servings);
    const totalOz = (totalG / 28.3495).toFixed(1);
    return `Net Wt. ${totalG}g (${totalOz} oz)`;
  }

  // Fallback for "X Grams" style
  const gramMatch = ss.match(/(\d+\.?\d*)\s*gram/i);
  if (gramMatch) {
    const perServing = parseFloat(gramMatch[1]);
    const totalG = Math.round(perServing * servings);
    const totalOz = (totalG / 28.3495).toFixed(1);
    return `Net Wt. ${totalG}g (${totalOz} oz)`;
  }

  return '';
}

// ── HTML Generation ────────────────────────────────────────────────────────

function buildLabelHTML(productName, data) {
  const cat = getCat(productName);
  const color = CATEGORY_COLORS[cat];
  const { w, h } = getDimensions(productName, data);
  const light = lightenHex(color, 0.4);
  const dark = darkenHex(color, 0.45);
  const { line1, flavor } = parseProductDisplay(productName);
  const formType = getFormType(data);
  const tagline = getTagline(productName, cat);
  const benefits = getBenefits(productName, cat);
  const isCosmetic = data.isCosmetic || false;
  const isPowder = data.type === 'powder';
  const isLarge = (w >= 2700 || h >= 1200);

  // Panel flex sizing — use percentages so it scales to any label width
  // Hero always centered at ~30%, facts and info split the rest
  const isSmall = w < 1200;  // tiny labels like serums
  const isWide = w >= 4000;  // protein tub labels
  const factsPct = isWide ? '40%' : isSmall ? '35%' : '35%';
  const heroPct = isWide ? '28%' : isSmall ? '30%' : '32%';
  const infoPct = isWide ? '32%' : isSmall ? '35%' : '33%';
  const factsFlex = `flex: 0 0 ${factsPct};`;
  const heroFlex = `flex: 0 0 ${heroPct};`;
  const infoFlex = `flex: 0 0 ${infoPct};`;

  // Font sizes scale based on label height, with width boost for protein tub labels
  const fontScale = Math.max(0.55, Math.min(1.8, h / 750));
  const wideBoost = isWide ? 1.4 : 1;  // bump text on wide protein labels
  const sw = (base) => Math.round(base * fontScale * wideBoost) + 'px';
  const s = (base) => Math.round(base * fontScale) + 'px';
  const nameFontSize = sw(80);
  const flavorFontSize = sw(46);
  const factsFontSize = sw(16);
  const factsAmtSize = sw(18);
  const factsHeaderSize = sw(26);
  const servingSize = sw(19);
  const infoHeadingSize = sw(22);
  const infoBodySize = Math.max(14, Math.round(18 * fontScale * wideBoost)) + 'px';
  const cautionHeadSize = Math.max(14, Math.round(18 * fontScale * wideBoost)) + 'px';
  const cautionBodySize = Math.max(13, Math.round(17 * fontScale * wideBoost)) + 'px';
  const safetySize = Math.max(13, Math.round(17 * fontScale * wideBoost)) + 'px';
  const fdaSize = Math.max(13, Math.round(13 * fontScale * wideBoost)) + 'px'; // FDA min 1/16 inch
  const mfgSize = sw(13);
  const logoSize = sw(28);
  const taglineSize = sw(21);
  const catLabelSize = sw(16);
  const productLabelSize = sw(22);
  const subtitleSize = sw(22);
  const pillSize = sw(21);
  const metaSize = sw(21);
  const rowPadV = Math.max(1, Math.round(3 * fontScale * wideBoost * (data.rows && data.rows.length > 12 ? 0.5 : 1)));
  const rowPad = `${rowPadV}px 0`;

  // Build supplement facts rows
  let factsRows = '';
  if (data.rows && data.rows.length > 0) {
    for (const row of data.rows) {
      factsRows += `
          <tr class="tr">
            <td>${esc(row.name)}</td>
            <td class="amt">${esc(row.dose)}</td>
            <td class="dv">${esc(row.dv)}</td>
          </tr>`;
    }
  }

  // Blend note (proprietary blend detail)
  let blendNoteHTML = '';
  if (data.blendNote) {
    blendNoteHTML = `<div class="blend-note" style="font-family:'Inter',sans-serif;font-size:13px;color:rgba(255,255,255,0.45);line-height:1.2;margin-top:2px;margin-bottom:2px;padding-left:8px;border-left:2px solid ${hexToRgba(color, 0.3)};">${esc(data.blendNote)}</div>`;
  }

  // Other ingredients
  let otherHTML = '';
  if (data.other && data.other !== 'None') {
    otherHTML = `<div class="other-ing"><strong>Other Ingredients:</strong> ${esc(data.other)}</div>`;
  }

  // For cosmetic products, use different facts header
  const factsTitle = isCosmetic ? 'Ingredients' : 'Supplement Facts';
  const servingBlock = isCosmetic ? '' : `
        <div class="serving-block">
          <strong>Serving Size:</strong> ${esc(data.servingSize)}<br>
          <strong>Servings Per Container:</strong> ${esc(data.servings)}
        </div>`;

  // DV note
  const dvNote = isCosmetic ? '' : `
          <div class="dv-note">
            **Percent Daily Value (DV) is based on a 2,000 calorie diet.${data.rows && data.rows.some(r => r.dv === '**' || r.dv === '***') ? ' **Daily Value not established.' : ''}
          </div>`;

  // Cosmetic products: simple ingredient list, no table
  let factsContent;
  if (isCosmetic && (!data.rows || data.rows.length === 0)) {
    factsContent = `
      <div>
        <div class="facts-header">${factsTitle}</div>
        <div class="other-ing" style="margin-top:12px;font-size:17px;line-height:1.5;">
          ${esc(data.other)}
        </div>
      </div>`;
  } else {
    factsContent = `
      <div>
        <div class="facts-header">${factsTitle}</div>
        ${servingBlock}
        <table class="ft">
          <tr class="th">
            <td style="width: 50%;">Amount Per Serving</td>
            <td style="width: 26%; text-align: right; padding-right: 8px;"></td>
            <td style="width: 24%; text-align: right;">%DV**</td>
          </tr>
          ${factsRows}
        </table>
        <div class="ft-bottom">
          ${dvNote}
        </div>
        ${blendNoteHTML}
        ${otherHTML}
      </div>`;
  }

  // Directions / caution heading
  const directionsHeading = isCosmetic ? 'How to Use' : 'Suggested Use';
  const cautionHeading = isCosmetic ? 'Warning' : 'Caution';

  // FDA disclaimer
  const fdaText = isCosmetic
    ? 'This product is not intended to diagnose, treat, cure or prevent any disease.'
    : '*This statement has not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease.';

  // Net quantity
  const netQty = getNetQuantity(data);

  // Meta row
  const metaServings = (data.servings && data.servings !== 'N/A')
    ? `<div class="meta-dot"></div><div class="meta-item">${data.servings} Servings</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Aviera ${esc(productName)} Label</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=Bebas+Neue&family=Black+Ops+One&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #000;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .label-wrapper {
    width: ${w}px;
    height: ${h}px;
    position: relative;
    overflow: hidden;
    background: #020204;
  }

  /* === BACKGROUNDS === */
  .bg-base {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 50% 45%, ${hexToRgba(color, 0.24)} 0%, transparent 35%),
      radial-gradient(ellipse at 50% 55%, ${hexToRgba(color, 0.10)} 0%, transparent 40%),
      radial-gradient(ellipse at 0% 50%, ${hexToRgba(color, 0.06)} 0%, transparent 30%),
      radial-gradient(ellipse at 100% 50%, ${hexToRgba(color, 0.06)} 0%, transparent 30%),
      linear-gradient(180deg, #030308 0%, #020206 50%, #030308 100%);
    z-index: 0;
  }

  .bg-slashes {
    position: absolute; inset: 0; z-index: 1;
    opacity: 0.04;
    background: repeating-linear-gradient(-55deg, transparent, transparent 8px, ${color} 8px, ${color} 9px);
  }

  .bg-grid {
    position: absolute; inset: 0; z-index: 1;
    opacity: 0.025;
    background:
      linear-gradient(${hexToRgba(color, 0.5)} 1px, transparent 1px),
      linear-gradient(90deg, ${hexToRgba(color, 0.5)} 1px, transparent 1px);
    background-size: 60px 60px;
  }

  .bg-network { position: absolute; inset: 0; z-index: 1; }
  .bg-network svg { width: 100%; height: 100%; }

  .energy-glow {
    position: absolute;
    left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: 600px; height: 600px; z-index: 1;
    background: radial-gradient(circle, ${hexToRgba(color, 0.16)} 0%, ${hexToRgba(color, 0.06)} 30%, transparent 55%);
    border-radius: 50%;
  }
  .energy-glow-inner {
    position: absolute;
    left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: 300px; height: 300px; z-index: 1;
    background: radial-gradient(circle, ${hexToRgba(color, 0.12)} 0%, transparent 60%);
    border-radius: 50%;
  }

  .top-bar, .bottom-bar {
    position: absolute; left: 0; right: 0; height: 5px; z-index: 10;
    background: linear-gradient(90deg, ${color}, ${light} 15%, ${color} 30%, #fff 50%, ${color} 70%, ${light} 85%, ${color});
  }
  .top-bar { top: 0; box-shadow: 0 0 30px ${hexToRgba(color, 0.6)}, 0 4px 40px ${hexToRgba(color, 0.25)}; }
  .bottom-bar { bottom: 0; box-shadow: 0 0 30px ${hexToRgba(color, 0.6)}, 0 -4px 40px ${hexToRgba(color, 0.25)}; }

  .speed-lines { position: absolute; inset: 0; z-index: 2; overflow: hidden; }
  .sl { position: absolute; border-radius: 1px; }
  .sl.c { height: 2px; background: linear-gradient(90deg, transparent, ${hexToRgba(color, 0.6)}, ${hexToRgba(color, 0.9)}, ${hexToRgba(color, 0.4)}, transparent); }
  .sl.t { height: 2px; background: linear-gradient(90deg, transparent, ${hexToRgba(light, 0.35)}, ${hexToRgba(light, 0.7)}, ${hexToRgba(light, 0.25)}, transparent); }
  .sl.w { height: 1px; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), transparent); }

  .corner { position: absolute; z-index: 10; width: 30px; height: 30px; }
  .corner.tl { top: 8px; left: 8px; border-top: 3px solid ${hexToRgba(color, 0.6)}; border-left: 3px solid ${hexToRgba(color, 0.6)}; }
  .corner.tr { top: 8px; right: 8px; border-top: 3px solid ${hexToRgba(color, 0.6)}; border-right: 3px solid ${hexToRgba(color, 0.6)}; }
  .corner.bl { bottom: 8px; left: 8px; border-bottom: 3px solid ${hexToRgba(color, 0.6)}; border-left: 3px solid ${hexToRgba(color, 0.6)}; }
  .corner.br { bottom: 8px; right: 8px; border-bottom: 3px solid ${hexToRgba(color, 0.6)}; border-right: 3px solid ${hexToRgba(color, 0.6)}; }

  /* === MAIN LAYOUT === */
  .label-content {
    position: relative; z-index: 5;
    width: 100%; height: 100%;
    display: flex;
  }

  .divider {
    width: 2px; align-self: stretch; margin: 14px 0; flex-shrink: 0;
    background: linear-gradient(to bottom, transparent 5%, ${hexToRgba(color, 0.7)} 20%, ${color} 50%, ${hexToRgba(color, 0.7)} 80%, transparent 95%);
    position: relative;
    box-shadow: 0 0 8px ${hexToRgba(color, 0.35)};
  }
  .divider::before {
    content: ''; position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 8px; height: 8px;
    background: ${color}; border-radius: 50%;
    box-shadow: 0 0 12px ${hexToRgba(color, 0.8)};
  }

  /* === DIRECTIONS / WARNINGS PANEL === */
  .section-info {
    ${infoFlex}
    padding: ${isWide ? '28px 40px 24px' : '16px 24px 14px'};
    display: flex; flex-direction: column;
    justify-content: space-between;
    background: rgba(0,0,0,0.25);
  }

  .info-heading {
    font-family: 'Orbitron', sans-serif; font-weight: 800; font-size: ${infoHeadingSize};
    color: ${color}; letter-spacing: 3px; text-transform: uppercase;
    margin-bottom: 8px;
    text-shadow: 0 0 12px ${hexToRgba(color, 0.35)};
  }

  .info-body {
    font-family: 'Inter', sans-serif; font-size: ${infoBodySize};
    color: rgba(255,255,255,0.75); line-height: 1.3; margin-bottom: 8px;
  }

  .section-sep {
    width: 100%; height: 2px;
    background: linear-gradient(90deg, ${hexToRgba(color, 0.45)}, ${hexToRgba(color, 0.1)}, transparent);
    margin-bottom: 10px;
  }

  .caution-heading {
    font-family: 'Orbitron', sans-serif; font-weight: 800; font-size: ${cautionHeadSize};
    color: #ff3d3d; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 6px;
    text-shadow: 0 0 8px rgba(255, 61, 61, 0.3);
  }

  .caution-body {
    font-family: 'Inter', sans-serif; font-size: ${cautionBodySize};
    color: rgba(255,255,255,0.6); line-height: 1.25; margin-bottom: 6px;
  }

  .safety-warning {
    font-family: 'Inter', sans-serif; font-size: ${safetySize}; font-weight: 800;
    color: rgba(255,255,255,0.85); line-height: 1.25; margin-bottom: 8px;
    text-transform: uppercase;
  }

  .fda-mfg-block {
    margin-top: auto;
    padding-top: 6px;
  }

  .fda-box {
    background: #ffffff;
    border: ${isWide ? '3px' : '2px'} solid #000000;
    padding: ${isWide ? '14px 18px' : '8px 10px'};
    margin-bottom: 6px;
  }

  .fda-box .fda-text {
    font-family: 'Inter', sans-serif; font-size: ${fdaSize}; font-weight: 700;
    color: #000000; line-height: 1.25;
  }

  .mfg-left {
    font-family: 'Inter', sans-serif; font-size: 13px;
    color: rgba(255,255,255,0.35); line-height: 1.25; margin-top: 2px;
  }
  .mfg-left strong { color: rgba(255,255,255,0.45); font-weight: 600; }

  /* === HERO BRANDING === */
  .section-hero {
    ${heroFlex}
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 14px 16px;
    position: relative;
  }

  .section-hero::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 0; height: 0;
    border-left: 220px solid transparent;
    border-right: 220px solid transparent;
    border-bottom: 440px solid ${hexToRgba(color, 0.012)};
  }

  .logo-group { display: flex; align-items: center; gap: 10px; margin-bottom: 2px; }

  .logo-circle {
    width: 38px; height: 38px;
    border: 2.5px solid ${color}; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    position: relative;
    box-shadow: 0 0 20px ${hexToRgba(color, 0.35)}, inset 0 0 12px ${hexToRgba(color, 0.08)};
  }
  .logo-circle::before {
    content: ''; position: absolute; inset: -6px;
    border-radius: 50%; border: 1.5px solid ${hexToRgba(color, 0.12)};
  }
  .logo-circle svg { width: 18px; height: 18px; }

  .logo-text {
    font-family: 'Orbitron', sans-serif; font-weight: 900;
    font-size: ${logoSize}; color: #fff; letter-spacing: 8px;
    text-shadow: 0 0 20px ${hexToRgba(color, 0.15)};
  }

  .tagline-text {
    font-family: 'Rajdhani', sans-serif; font-size: 21px; font-weight: 600;
    color: ${hexToRgba(color, 0.65)}; letter-spacing: 3px;
    text-transform: uppercase; margin-bottom: 8px;
  }

  .hero-line {
    width: 160px; height: 2px;
    background: linear-gradient(90deg, transparent, ${color}, transparent);
    margin-bottom: 6px;
    box-shadow: 0 0 10px ${hexToRgba(color, 0.35)};
  }

  .product-label-top {
    font-family: 'Orbitron', sans-serif; font-size: 22px; font-weight: 700;
    color: ${color}; letter-spacing: 5px; text-transform: uppercase;
    text-shadow: 0 0 15px ${hexToRgba(color, 0.5)};
    margin-bottom: 0;
  }

  .product-name-line1 {
    font-family: 'Bebas Neue', sans-serif; font-size: ${nameFontSize};
    line-height: 0.85; letter-spacing: 6px; text-align: center;
    background: linear-gradient(180deg, #ffffff 0%, ${lightenHex(color, 0.85)} 25%, ${light} 55%, ${color} 80%, ${dark} 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 30px ${hexToRgba(color, 0.4)}) drop-shadow(0 0 60px ${hexToRgba(color, 0.15)});
  }

  .product-name-flavor {
    font-family: 'Black Ops One', sans-serif; font-size: ${flavorFontSize};
    line-height: 0.75; letter-spacing: 3px; text-align: center;
    color: ${color};
    text-shadow: 0 0 20px ${hexToRgba(color, 0.7)}, 0 0 40px ${hexToRgba(color, 0.3)}, 0 0 80px ${hexToRgba(color, 0.15)};
  }

  .product-subtitle {
    font-family: 'Rajdhani', sans-serif; font-size: 22px; font-weight: 600;
    color: rgba(255,255,255,0.6); letter-spacing: 3px;
    text-transform: uppercase; margin-top: 6px;
  }

  .product-tagline {
    font-family: 'Rajdhani', sans-serif; font-size: 24px; font-weight: 700;
    color: ${hexToRgba(color, 0.8)}; letter-spacing: 4px;
    text-transform: uppercase; margin-top: 8px;
    text-shadow: 0 0 12px ${hexToRgba(color, 0.25)};
  }

  .benefit-row { display: flex; gap: 6px; margin-top: 10px; }
  .benefit-pill {
    font-family: 'Rajdhani', sans-serif; font-size: ${pillSize}; font-weight: 800;
    color: #fff; letter-spacing: 1.5px; text-transform: uppercase;
    padding: 4px 10px;
    border: 2px solid ${hexToRgba(color, 0.45)};
    background: linear-gradient(135deg, ${hexToRgba(color, 0.12)} 0%, ${hexToRgba(color, 0.02)} 100%);
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
    text-shadow: 0 0 6px ${hexToRgba(color, 0.25)};
  }

  .meta-row { display: flex; gap: 12px; margin-top: 10px; align-items: center; }
  .meta-item { font-family: 'Inter', sans-serif; font-size: ${metaSize}; color: rgba(255,255,255,0.5); letter-spacing: 2px; text-transform: uppercase; font-weight: 600; }
  .meta-item.hl { color: rgba(255,255,255,0.7); font-weight: 700; }
  .meta-dot { width: 4px; height: 4px; background: ${color}; border-radius: 50%; box-shadow: 0 0 6px ${hexToRgba(color, 0.5)}; }

  .net-qty {
    font-family: 'Inter', sans-serif; font-size: ${metaSize}; font-weight: 700;
    color: rgba(255,255,255,0.7); letter-spacing: 2px; text-transform: uppercase;
    margin-top: 6px; text-align: center;
  }

  /* === SUPPLEMENT FACTS PANEL === */
  .section-facts {
    ${factsFlex}
    padding: ${isWide ? '24px 36px 20px' : '14px 22px 12px'};
    display: flex; flex-direction: column;
    justify-content: space-between;
    background: rgba(0,0,0,0.25);
  }

  .facts-header {
    font-family: 'Orbitron', sans-serif; font-weight: 900; font-size: ${factsHeaderSize};
    color: #fff; letter-spacing: 3px; text-transform: uppercase;
    padding-bottom: 4px;
    border-bottom: 4px solid ${color};
    margin-bottom: 6px;
    text-shadow: 0 0 10px ${hexToRgba(color, 0.25)};
  }

  .serving-block {
    font-family: 'Inter', sans-serif; font-size: 17px;
    color: rgba(255,255,255,0.8); line-height: 1.35; margin-bottom: 3px;
  }
  .serving-block strong { color: #fff; font-weight: 700; }

  .ft { width: 100%; border-collapse: collapse; }
  .ft .th td {
    border-top: 3px solid ${hexToRgba(color, 0.7)};
    border-bottom: 1px solid ${hexToRgba(color, 0.35)};
    padding: 2px 0;
    font-family: 'Rajdhani', sans-serif; font-size: 16px; font-weight: 700;
    color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px;
  }
  .ft .tr td {
    padding: ${rowPad};
    font-family: 'Inter', sans-serif; font-size: ${factsFontSize};
    color: rgba(255,255,255,0.95);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    font-weight: 500;
  }
  .ft .tr td.amt {
    text-align: right; padding-right: 8px;
    color: ${color}; font-weight: 800;
    font-family: 'Rajdhani', sans-serif; font-size: ${factsAmtSize};
    text-shadow: 0 0 10px ${hexToRgba(color, 0.25)};
  }
  .ft .tr td.dv { text-align: right; color: rgba(255,255,255,0.4); font-size: 15px; width: 36px; }

  .ft-bottom {
    border-top: 3px solid ${hexToRgba(color, 0.7)};
    margin-top: 2px; padding-top: 5px;
  }

  .dv-note {
    font-family: 'Inter', sans-serif; font-size: 14px;
    color: rgba(255,255,255,0.4); line-height: 1.2; margin-bottom: 3px;
  }

  .other-ing {
    font-family: 'Inter', sans-serif; font-size: 14px;
    color: rgba(255,255,255,0.55); line-height: 1.25; margin-bottom: 3px;
  }
  .other-ing strong { color: rgba(255,255,255,0.75); font-weight: 800; }
</style>
</head>
<body>

<div class="label-wrapper">
  <div class="bg-base"></div>
  <div class="bg-slashes"></div>
  <div class="bg-grid"></div>

  <div class="bg-network">
    <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="${Math.round(h*0.2)}" x2="200" y2="${Math.round(h*0.16)}" stroke="${color}" stroke-width="0.7" opacity="0.1"/>
      <line x1="200" y1="${Math.round(h*0.16)}" x2="350" y2="${Math.round(h*0.27)}" stroke="${color}" stroke-width="0.6" opacity="0.08"/>
      <line x1="350" y1="${Math.round(h*0.27)}" x2="420" y2="${Math.round(h*0.13)}" stroke="${color}" stroke-width="0.5" opacity="0.07"/>
      <line x1="0" y1="${Math.round(h*0.87)}" x2="160" y2="${Math.round(h*0.81)}" stroke="${color}" stroke-width="0.7" opacity="0.09"/>
      <line x1="160" y1="${Math.round(h*0.81)}" x2="310" y2="${Math.round(h*0.91)}" stroke="${color}" stroke-width="0.5" opacity="0.07"/>
      <line x1="680" y1="${Math.round(h*0.08)}" x2="840" y2="${Math.round(h*0.13)}" stroke="${color}" stroke-width="0.5" opacity="0.06"/>
      <line x1="${Math.round(w*0.6)}" y1="${Math.round(h*0.11)}" x2="${Math.round(w*0.7)}" y2="${Math.round(h*0.16)}" stroke="${color}" stroke-width="0.6" opacity="0.09"/>
      <line x1="${Math.round(w*0.7)}" y1="${Math.round(h*0.16)}" x2="${Math.round(w*0.8)}" y2="${Math.round(h*0.12)}" stroke="${color}" stroke-width="0.7" opacity="0.1"/>
      <line x1="${Math.round(w*0.55)}" y1="${Math.round(h*0.96)}" x2="${Math.round(w*0.65)}" y2="${Math.round(h*0.93)}" stroke="${color}" stroke-width="0.6" opacity="0.08"/>
      <line x1="${Math.round(w*0.65)}" y1="${Math.round(h*0.93)}" x2="${Math.round(w*0.75)}" y2="${Math.round(h*1.02)}" stroke="${color}" stroke-width="0.7" opacity="0.1"/>
      <circle cx="200" cy="${Math.round(h*0.16)}" r="3.5" fill="${color}" opacity="0.3"/>
      <circle cx="350" cy="${Math.round(h*0.27)}" r="3" fill="${color}" opacity="0.2"/>
      <circle cx="160" cy="${Math.round(h*0.81)}" r="3.5" fill="${color}" opacity="0.25"/>
      <circle cx="840" cy="${Math.round(h*0.13)}" r="3" fill="${color}" opacity="0.18"/>
      <circle cx="${Math.round(w*0.7)}" cy="${Math.round(h*0.16)}" r="3.5" fill="${color}" opacity="0.3"/>
      <circle cx="${Math.round(w*0.65)}" cy="${Math.round(h*0.93)}" r="3.5" fill="${color}" opacity="0.25"/>
      <polygon points="450,${Math.round(h*0.11)} 480,${Math.round(h*0.08)} 510,${Math.round(h*0.11)} 510,${Math.round(h*0.15)} 480,${Math.round(h*0.18)} 450,${Math.round(h*0.15)}" fill="none" stroke="${color}" stroke-width="0.6" opacity="0.05"/>
      <polygon points="${Math.round(w*0.55)},${Math.round(h*0.09)} ${Math.round(w*0.55)+30},${Math.round(h*0.07)} ${Math.round(w*0.55)+60},${Math.round(h*0.09)} ${Math.round(w*0.55)+60},${Math.round(h*0.13)} ${Math.round(w*0.55)+30},${Math.round(h*0.15)} ${Math.round(w*0.55)},${Math.round(h*0.13)}" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.05"/>
      <rect x="${Math.round(w*0.38)}" y="${Math.round(h*0.58)}" width="60" height="60" transform="rotate(45 ${Math.round(w*0.38)+30} ${Math.round(h*0.58)+30})" fill="none" stroke="${color}" stroke-width="0.4" opacity="0.025"/>
    </svg>
  </div>

  <div class="energy-glow"></div>
  <div class="energy-glow-inner"></div>

  <div class="speed-lines">
    <div class="sl c" style="top:8%;left:0;width:200px;"></div>
    <div class="sl w" style="top:14%;left:0;width:280px;opacity:0.6;"></div>
    <div class="sl t" style="top:22%;left:1%;width:140px;opacity:0.7;"></div>
    <div class="sl c" style="top:35%;left:0;width:90px;opacity:0.5;"></div>
    <div class="sl t" style="top:65%;left:0;width:160px;opacity:0.8;"></div>
    <div class="sl c" style="top:78%;left:1%;width:120px;opacity:0.6;"></div>
    <div class="sl w" style="top:88%;left:0;width:220px;opacity:0.5;"></div>
    <div class="sl t" style="top:12%;right:0;left:auto;width:160px;opacity:0.6;"></div>
    <div class="sl w" style="top:28%;right:0;left:auto;width:200px;opacity:0.5;"></div>
    <div class="sl c" style="top:42%;right:0;left:auto;width:90px;opacity:0.4;"></div>
    <div class="sl t" style="top:58%;right:0;left:auto;width:130px;opacity:0.7;"></div>
    <div class="sl c" style="top:85%;right:0;left:auto;width:140px;opacity:0.5;"></div>
  </div>

  <div class="top-bar"></div>
  <div class="bottom-bar"></div>
  <div class="corner tl"></div>
  <div class="corner tr"></div>
  <div class="corner bl"></div>
  <div class="corner br"></div>

  <div class="label-content">

    <!-- LEFT: SUPPLEMENT FACTS -->
    <div class="section-facts">
      ${factsContent}
    </div>

    <div class="divider"></div>

    <!-- CENTER: HERO BRANDING -->
    <div class="section-hero">
      <div class="logo-group">
        <div class="logo-circle">
          <svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 19V5"/><path d="M5 12l7-7 7 7"/>
          </svg>
        </div>
        <div class="logo-text">AVIERA</div>
      </div>
      <div class="tagline-text">Stop Guessing &middot; Start Progressing</div>
      <div class="hero-line"></div>
      <div class="product-label-top">${esc(cat)}</div>
      <div class="product-name-line1">${esc(line1.toUpperCase())}</div>
      ${flavor ? `<div class="product-name-flavor">${esc(flavor.toUpperCase())}</div>` : ''}
      <div class="product-subtitle">${esc(formType)}</div>
      <div class="product-tagline">${esc(tagline)}</div>
      <div class="benefit-row">
        ${benefits.map(b => `<div class="benefit-pill">${esc(b)}*</div>`).join('\n        ')}
      </div>
      <div class="meta-row">
        <div class="meta-item hl">Dietary Supplement</div>
        ${metaServings}
      </div>
      ${netQty ? `<div class="net-qty">${esc(netQty)}</div>` : ''}
    </div>

    <div class="divider"></div>

    <!-- RIGHT: DIRECTIONS, WARNINGS, MANUFACTURER -->
    <div class="section-info">
      <div>
        <div class="info-heading">${esc(directionsHeading)}</div>
        <div class="info-body">
          ${esc(data.directions)}
        </div>

        <div class="section-sep"></div>

        <div class="caution-heading">${esc(cautionHeading)}</div>
        <div class="caution-body">
          ${esc(data.warning)}
        </div>

        <div class="safety-warning">
          Keep out of reach of children. Do not use if safety seal is damaged or missing. Store in a cool, dry place.
        </div>
      </div>

      <div class="fda-mfg-block">
        <div class="fda-box">
          <div class="fda-text">
            ${esc(fdaText)}
          </div>
        </div>
        <div class="mfg-left">
          <strong>Manufactured for and distributed by:</strong>
          AvieraFit &middot; 4437 Lister St, San Diego, CA 92110 USA<br>
          Questions? info@avierafit.com &middot; <span style="color: ${hexToRgba(color, 0.5)};">avierafit.com</span>
        </div>
      </div>
    </div>
    </div>

  </div>
</div>

</body>
</html>`;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Aviera Label Generator (Final) ===\n');

  // Load data
  const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
  const products = JSON.parse(rawData);
  const productNames = Object.keys(products);
  console.log(`Loaded ${productNames.length} products from JSON.\n`);

  // Ensure output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Launch Puppeteer
  console.log('Launching Puppeteer...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });

  const pdfPages = []; // { name, base64png, w, h }

  for (let i = 0; i < productNames.length; i++) {
    const name = productNames[i];
    const data = products[name];
    const safe = safeName(name);
    const { w, h } = getDimensions(name, data);
    const cat = getCat(name);

    console.log(`[${i+1}/${productNames.length}] ${name} (${cat}, ${w}x${h})`);

    // Generate HTML
    const html = buildLabelHTML(name, data);

    // Create a new page
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait a moment for fonts to load
    await page.evaluate(() => document.fonts.ready);

    // Screenshot as PNG
    const pngPath = path.join(OUTPUT_DIR, `Aviera_${safe}_Label.png`);
    await page.screenshot({ path: pngPath, type: 'png', clip: { x: 0, y: 0, width: w, height: h } });

    // Read png as base64 for PDF embedding
    const pngBuffer = fs.readFileSync(pngPath);
    const base64 = pngBuffer.toString('base64');
    pdfPages.push({ name, base64, w, h, safe });

    // Generate individual PDF for this product
    const pdfPath = path.join(OUTPUT_DIR, `Aviera_${safe}_Label.pdf`);

    // Create single-page PDF by fitting image to exact page dimensions
    const pdfPage = await browser.newPage();
    const pdfW = w / 300; // pixels to inches at 300dpi
    const pdfH = h / 300;

    await pdfPage.setContent(`<!DOCTYPE html><html><head><style>
      @page { size: ${pdfW}in ${pdfH}in; margin: 0; }
      * { margin: 0; padding: 0; }
      html, body { width: ${pdfW}in; height: ${pdfH}in; overflow: hidden; }
      img { width: ${pdfW}in; height: ${pdfH}in; display: block; object-fit: fill; }
    </style></head><body>
      <img src="data:image/png;base64,${base64}"/>
    </body></html>`, { waitUntil: 'load' });

    await pdfPage.pdf({
      path: pdfPath,
      width: `${pdfW}in`,
      height: `${pdfH}in`,
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      preferCSSPageSize: true,
    });

    await pdfPage.close();
    await page.close();

    console.log(`   -> PNG: ${pngPath}`);
    console.log(`   -> PDF: ${pdfPath}`);
  }

  // Generate combined single-page PDF with all labels
  console.log('\nGenerating combined PDF catalog...');
  const catalogPage = await browser.newPage();

  // Build a long HTML page with all labels stacked
  const catalogHtml = `<!DOCTYPE html>
<html><head><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #000; }
  .label-entry {
    page-break-after: always;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .label-entry:last-child { page-break-after: auto; }
  .label-title {
    font-family: Arial, sans-serif;
    color: #fff;
    font-size: 24px;
    padding: 20px 0 10px;
    text-align: center;
    letter-spacing: 2px;
  }
  img { display: block; max-width: 100%; }
</style></head>
<body>
${pdfPages.map(p => `
  <div class="label-entry">
    <div class="label-title">${esc(p.name)}</div>
    <img src="data:image/png;base64,${p.base64}" style="width:${p.w}px;height:${p.h}px;"/>
  </div>
`).join('')}
</body></html>`;

  // Use a wide viewport for the largest labels
  await catalogPage.setViewport({ width: 2700, height: 1400 });
  await catalogPage.setContent(catalogHtml, { waitUntil: 'load' });

  const catalogPath = path.join(OUTPUT_DIR, 'Aviera_ALL_Labels_Catalog.pdf');
  await catalogPage.pdf({
    path: catalogPath,
    width: '10in',
    height: '6in',
    printBackground: true,
    margin: { top: '0.1in', right: '0.1in', bottom: '0.1in', left: '0.1in' },
  });
  await catalogPage.close();
  console.log(`Combined catalog: ${catalogPath}`);

  await browser.close();

  console.log(`\n=== DONE === Generated ${productNames.length} label PNGs + PDFs to ${OUTPUT_DIR}`);
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
