# Supplement Label Designer — Complete AI Skill

> **How to use this file:** Copy the entire contents of this document and paste it into any AI assistant (Claude, ChatGPT, Cursor, etc.) as a system prompt, project knowledge file, or custom instruction. It contains everything needed to design and render print-ready supplement labels from scratch, including the full HTML/CSS template, render scripts, Supliful fulfillment compliance rules, and FDA content checklist. No other files are needed.

---

## Skill Overview

This skill designs print-ready dietary supplement bottle labels using an HTML/CSS template rendered to high-resolution PNG and PDF via Puppeteer (Node.js). It includes a Supliful fulfillment compliance workflow that prevents common label rejections.

---

## Workflow

Creating a supplement label involves five steps:

1. Research the brand (website, existing labels, colors, target audience)
2. Gather supplement facts and regulatory content
3. Copy and customize the HTML template
4. Render to high-res PNG + PDF
5. Verify compliance and iterate

### Step 1: Research the Brand

Visit the brand's website and any existing label references to identify brand colors (primary, secondary, background), logo style, tagline, target audience, and label dimensions. For young male lifters (18-25), use the aggressive/pre-workout design mode (default in the template). Save findings to a working notes file before proceeding.

### Step 2: Gather Supplement Facts

Collect all required label content using the Label Content Checklist (Section 6 below).

**Critical items to collect:** full manufacturer/distributor address (company, street, city, state, ZIP, country), contact info (email or phone), and exact supplement facts (ingredient names, amounts, serving size).

**If using Supliful fulfillment:** Read the Supliful Compliance Guide (Section 5 below) BEFORE customizing the template. The Supplement Facts panel is a RED zone — ingredient names, amounts, and Other Ingredients must match the Supliful product template exactly. Do not modify them.

Sources to check: product listing pages, brand website, Amazon listings, NIH Dietary Supplement Label Database (dsld.od.nih.gov), Supliful product template (if applicable).

### Step 3: Customize the Template

Save the HTML Template (Section 7 below) to a file called `label.html` in the working directory. Then make the following customizations.

**Panel Layout (Default Order):**

| Position | Panel | CSS Class | Content |
|---|---|---|---|
| Left | Suggested Use / Caution / FDA | `.section-info` (540px) | Suggested use, caution, safety warning, FDA disclaimer box |
| Center | Hero Branding | `.section-hero` (560px) | Logo, product name, tagline, benefit pills, capsule count |
| Right | Supplement Facts | `.section-facts` (flex: 1) | Supplement facts, other ingredients, manufacturer address |

The center hero panel is the front-facing panel on the bottle.

**Content to Replace:**

Replace all hardcoded product-specific text in the HTML. Key areas include the hero panel (brand name in `.logo-text`, tagline in `.tagline-text`, product category in `.product-label-top`, product name in `.product-name-line1` and `.product-name-x`, subtitle in `.product-subtitle`, health claim in `.product-tagline` which must include an asterisk, benefit pills, and capsule count), the supplement facts panel (serving size, servings per container, ingredient rows as `<tr class="tr">`, DV footnote, other ingredients, and manufacturer address block), and the info panel (suggested use text, caution text, safety warning, and FDA disclaimer — if using Supliful, use the exact wording from the Supliful Compliance Guide).

**Brand Colors — Search and Replace:**

| Current Value | Role |
|---|---|
| `#00e5ff` | Primary accent (cyan) |
| `#00ffcc` | Secondary accent (teal) |
| `#ff3d3d` | Danger/warning (red) |
| `#020204` | Background dark |

**Font Size Rules:**

The template canvas is 1800 CSS px = 6 inches (300 CSS px per inch). Minimum print-safe font sizes:

| Minimum | CSS px | When to Use |
|---|---|---|
| 5pt (absolute floor) | 21px | Smallest allowed text |
| 6pt | 25px | White/light backgrounds |
| 7pt | 29px | Dark backgrounds (preferred) |

The template defaults to 21px minimum for body text. Do not go below 21 CSS px for any text. To convert CSS px to print points: `pt = (css_px / 300) * 72`.

**Design Customization:**

The template defaults to an aggressive pre-workout aesthetic. See the Design Guide (Section 4 below) for aggressive vs. clean modes, color palettes, and background effects. Remove background effects by deleting their HTML elements (`.bg-slashes`, `.bg-grid`, `.bg-network`, `.speed-lines`, `.energy-glow`).

### Step 4: Render to PNG + PDF

Install Puppeteer in the working directory, then save the two render scripts (Sections 8 and 9 below) and run them:

```bash
cd /path/to/working/dir
npm init -y && npm install puppeteer

# PNG (2x scale = ~600 DPI output)
node render_label.js label.html output.png 2

# PDF (print-ready, matches label dimensions)
node render_pdf.js label.html output.pdf
```

Both scripts wait for Google Fonts to load before rendering.

### Step 5: Verify and Iterate

View the rendered PNG and verify: (1) all text readable at print size with no font below 21 CSS px, (2) proper vertical space distribution across all three panels, (3) color contrast sufficient on dark background, (4) all required regulatory text present per the checklist, and (5) manufacturer name and full address included.

**If using Supliful:** Run through the verification checklist in the Supliful Compliance Guide (Section 5) before submitting. Common rejection reasons include wrong supplement facts, missing manufacturer address, font too small, and missing FDA disclaimer box.

Adjust CSS and re-render until satisfied. Deliver PNG, PDF, and HTML source.

---

## Section 4: Design Guide

### Dimension Reference

| Label Size | CSS Dimensions | Output at 2x Scale |
|---|---|---|
| 2.5" H x 6" W (default) | 750 x 1800 px | 1500 x 3600 px |
| 2" H x 5" W | 600 x 1500 px | 1200 x 3000 px |
| 3" H x 7" W | 900 x 2100 px | 1800 x 4200 px |
| 3.5" H x 8" W | 1050 x 2400 px | 2100 x 4800 px |

Set `.label-wrapper` width and height to match. Update `render_pdf.js` page dimensions accordingly.

### Design Modes

**Aggressive / Pre-Workout (Default)** — For male lifters aged 18-25:

| Element | Setting |
|---|---|
| Background | Near-black (#020204), diagonal slashes + grid overlay |
| Bars | 5px thick, white flash gradient |
| Dividers | 2px with glow dot |
| Corner brackets | 3px, 30px |
| Font weights | 800-900 headers |
| Glow | Double (outer 600px + inner 300px) |
| Shapes | Angular clip-path cut corners |
| Speed lines | 12+ lines, varied opacity |

**Clean / Clinical** — For wellness or premium positioning: remove `bg-slashes` and `bg-grid` divs, reduce glow to single layer at 0.12 opacity, use rounded borders instead of clip-path, thin bars to 3px, reduce font weights to 600-700.

### Brand Color Palettes

| Style | Primary | Secondary | Danger | Audience |
|---|---|---|---|---|
| Cyber / Tech | `#00e5ff` | `#00ffcc` | `#ff3d3d` | Young men, default |
| Fire / Energy | `#ff6b35` | `#ffd700` | `#ff1744` | Pre-workout |
| Clean / Health | `#4caf50` | `#81c784` | `#ff5252` | Wellness |
| Royal / Premium | `#9c27b0` | `#ce93d8` | `#ff5252` | Luxury |
| Electric Blue | `#2979ff` | `#82b1ff` | `#ff5252` | Performance |
| Neon Toxic | `#76ff03` | `#00e676` | `#ff1744` | Extreme energy |

### Typography Stack

| Role | Font | Weight | Usage |
|---|---|---|---|
| Display | Bebas Neue | 400 | Product name (massive gradient) |
| Accent | Black Ops One | 400 | Special characters (glowing) |
| Heading | Orbitron | 700-900 | Section headers, brand name |
| UI | Rajdhani | 600-800 | Labels, badges, taglines |
| Body | Inter | 400-800 | Facts, directions, legal text |

### Background Effects (all optional)

Remove any effect by deleting its HTML element:

| Element | Description |
|---|---|
| `bg-base` | Radial gradient glows behind hero |
| `bg-slashes` | Diagonal slash texture (aggressive only) |
| `bg-grid` | 60px grid overlay (aggressive only) |
| `bg-network` | SVG molecular/vein network |
| `energy-glow` / `energy-glow-inner` | Radial glow behind product name |
| `speed-lines` | Horizontal gradient lines |
| `top-bar` / `bottom-bar` | Glowing accent bars |
| `corner` elements | Tech-style corner brackets |

---

## Section 5: Supliful Fulfillment Compliance Guide

Read this section when the label will be manufactured through Supliful (supliful.com).

### Panel Zone Rules

Supliful enforces a three-panel color-zone system. Violating these zones causes label rejection.

| Zone | Color | Panel | Rules |
|---|---|---|---|
| Green | Freely customizable | Center (hero branding) | Add/remove logo, product name, benefits. Benefits MUST include asterisk (*) referencing FDA disclaimer. No unproven claims. |
| Yellow | Content-only edits | Left (suggested use / caution) | Can provide more dosage info ONLY if manufacturer dosage stays the same. Must include: Suggested Use, Caution, Safety Warning, FDA disclaimer in bordered box. |
| Red | Do NOT modify | Right (supplement facts) | Supplement Facts table, Other Ingredients, and DV footnotes must match the Supliful product template EXACTLY. Do not change ingredient names, amounts, or order. |

### Required Text (Exact Wording)

**Suggested Use:**

> As a dietary supplement adults take two (2) capsules daily. For best results, take with 6-8 oz (177-237ml) of water or as directed by healthcare professional.

**Caution:**

> Do not exceed recommended dose. Pregnant or nursing mothers, children under the age of 18, and individuals with a known medical condition should consult a physician before using this or any dietary supplement.

**Safety Warning (bold/uppercase):**

> KEEP OUT OF REACH OF CHILDREN. DO NOT USE IF SAFETY SEAL IS DAMAGED OR MISSING. STORE IN A COOL, DRY PLACE.

**FDA Disclaimer (in bordered box):**

> *This statement has not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease.

### Font Size Requirements

| Background | Minimum Font Size | At 300 CSS px/inch |
|---|---|---|
| White | 6pt | 25 CSS px |
| Dark/Black | 7pt | 29.2 CSS px |
| Absolute floor | 5pt | 20.8 CSS px |

**Print Math:** The default template canvas is 1800 CSS px = 6 inches. At 2x device scale, the output PNG is 3600x1500 px. To convert: `pt = (css_px / 300) * 72`.

| CSS px | Print pt | Meets 5pt? | Meets 7pt? |
|---|---|---|---|
| 21 | 5.04 | Yes | No |
| 25 | 6.00 | Yes | No |
| 29 | 6.96 | Yes | Borderline |
| 30 | 7.20 | Yes | Yes |

Use 21 CSS px as absolute minimum. Prefer 25+ CSS px for dark backgrounds.

### Pre-Submission Verification Checklist

Before uploading to Supliful, confirm every item:

1. Supplement Facts match product template exactly (RED zone — no changes)
2. Suggested Use text matches exactly
3. Caution text matches exactly
4. Safety warning present (bold, uppercase)
5. FDA disclaimer in bordered box
6. Company name + full address present
7. No font below 21 CSS px (5pt at print)
8. Sufficient contrast on dark background
9. Benefits use asterisk (*) referencing disclaimer
10. No unproven health claims

---

## Section 6: Label Content Checklist

### FDA-Required Elements

1. Product name / identity statement
2. "Dietary Supplement" statement
3. Net quantity (capsule/tablet count or weight)
4. Supplement Facts panel with heading, serving size, servings per container, each ingredient with amount, %DV or ** footnote
5. Other Ingredients list (descending order of predominance)
6. Manufacturer/distributor name and full address (street, city, state, ZIP, country)
7. Directions for use / Suggested Use
8. FDA disclaimer with asterisk linking to benefit claims

### Recommended Elements

1. Caution / Warning text
2. Safety warning (keep out of reach, safety seal, storage)
3. Quality certifications (GMP, 3rd Party Tested, Made in USA)
4. Barcode (UPC/EAN)
5. Brand logo and website URL
6. Contact email or phone

### Information Sources

| Source | What to Get |
|---|---|
| Brand website | Logo, colors, tagline |
| Existing labels | Canva links, photos, PDFs |
| Product listing pages | Amazon, Shopify for supplement facts |
| NIH DSLD (dsld.od.nih.gov) | Verify ingredient name formats |
| Supliful product template | RED zone content (do not modify) |
| User-provided info | Manufacturer address if unavailable online |

---

## Section 7: HTML Label Template

Save the following as `label.html`. This is the complete, Supliful-compliant template with aggressive pre-workout aesthetic, 21px+ minimum fonts, and three-panel layout.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Supplement Label</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=Bebas+Neue&family=Black+Ops+One&display=swap');

  /*
    PRINT MATH:
    Canvas = 1800 CSS px = 6 inches → 300 CSS px/inch
    Minimum font: 5pt = 20.8 CSS px (absolute floor)
    Target min: 6pt = 25 CSS px (white bg), 7pt = 29.2 CSS px (dark bg)
    We'll use ~21px as absolute minimum for smallest legal text.
  */

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 40px;
  }

  .label-wrapper {
    width: 1800px;
    height: 750px;
    position: relative;
    overflow: hidden;
    background: #020204;
  }

  /* === BACKGROUNDS === */
  .bg-base {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 50% 45%, rgba(0, 229, 255, 0.28) 0%, transparent 35%),
      radial-gradient(ellipse at 50% 55%, rgba(0, 180, 255, 0.12) 0%, transparent 40%),
      radial-gradient(ellipse at 0% 50%, rgba(0, 229, 255, 0.08) 0%, transparent 30%),
      radial-gradient(ellipse at 100% 50%, rgba(0, 229, 255, 0.08) 0%, transparent 30%),
      linear-gradient(180deg, #030308 0%, #020206 50%, #030308 100%);
    z-index: 0;
  }

  .bg-slashes {
    position: absolute; inset: 0; z-index: 1;
    opacity: 0.045;
    background: repeating-linear-gradient(-55deg, transparent, transparent 8px, #00e5ff 8px, #00e5ff 9px);
  }

  .bg-grid {
    position: absolute; inset: 0; z-index: 1;
    opacity: 0.03;
    background:
      linear-gradient(rgba(0,229,255,0.5) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.5) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  .bg-network { position: absolute; inset: 0; z-index: 1; }
  .bg-network svg { width: 100%; height: 100%; }

  .energy-glow {
    position: absolute;
    left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: 600px; height: 600px; z-index: 1;
    background: radial-gradient(circle, rgba(0, 229, 255, 0.2) 0%, rgba(0, 229, 255, 0.08) 30%, transparent 55%);
    border-radius: 50%;
  }
  .energy-glow-inner {
    position: absolute;
    left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: 300px; height: 300px; z-index: 1;
    background: radial-gradient(circle, rgba(0, 229, 255, 0.15) 0%, transparent 60%);
    border-radius: 50%;
  }

  .top-bar, .bottom-bar {
    position: absolute; left: 0; right: 0; height: 5px; z-index: 10;
    background: linear-gradient(90deg, #00e5ff, #00ffcc 15%, #00e5ff 30%, #fff 50%, #00e5ff 70%, #00ffcc 85%, #00e5ff);
  }
  .top-bar { top: 0; box-shadow: 0 0 30px rgba(0, 229, 255, 0.7), 0 4px 40px rgba(0, 229, 255, 0.3); }
  .bottom-bar { bottom: 0; box-shadow: 0 0 30px rgba(0, 229, 255, 0.7), 0 -4px 40px rgba(0, 229, 255, 0.3); }

  .speed-lines { position: absolute; inset: 0; z-index: 2; overflow: hidden; }
  .sl { position: absolute; border-radius: 1px; }
  .sl.c { height: 2px; background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.7), rgba(0, 229, 255, 1), rgba(0, 229, 255, 0.5), transparent); }
  .sl.t { height: 2px; background: linear-gradient(90deg, transparent, rgba(0, 255, 204, 0.4), rgba(0, 255, 204, 0.8), rgba(0, 255, 204, 0.3), transparent); }
  .sl.w { height: 1px; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), transparent); }

  .corner { position: absolute; z-index: 10; width: 30px; height: 30px; }
  .corner.tl { top: 8px; left: 8px; border-top: 3px solid rgba(0, 229, 255, 0.7); border-left: 3px solid rgba(0, 229, 255, 0.7); }
  .corner.tr { top: 8px; right: 8px; border-top: 3px solid rgba(0, 229, 255, 0.7); border-right: 3px solid rgba(0, 229, 255, 0.7); }
  .corner.bl { bottom: 8px; left: 8px; border-bottom: 3px solid rgba(0, 229, 255, 0.7); border-left: 3px solid rgba(0, 229, 255, 0.7); }
  .corner.br { bottom: 8px; right: 8px; border-bottom: 3px solid rgba(0, 229, 255, 0.7); border-right: 3px solid rgba(0, 229, 255, 0.7); }

  /* === MAIN LAYOUT === */
  .label-content {
    position: relative; z-index: 5;
    width: 100%; height: 100%;
    display: flex;
  }

  .divider {
    width: 2px; align-self: stretch; margin: 14px 0; flex-shrink: 0;
    background: linear-gradient(to bottom, transparent 5%, rgba(0, 229, 255, 0.8) 20%, #00e5ff 50%, rgba(0, 229, 255, 0.8) 80%, transparent 95%);
    position: relative;
    box-shadow: 0 0 8px rgba(0, 229, 255, 0.4);
  }
  .divider::before {
    content: ''; position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 8px; height: 8px;
    background: #00e5ff; border-radius: 50%;
    box-shadow: 0 0 12px rgba(0, 229, 255, 0.9);
  }

  /* === LEFT: SUGGESTED USE / CAUTION / FDA (Supliful YELLOW zone) === */
  .section-info {
    flex: 0 0 540px;
    padding: 22px 28px 18px;
    display: flex; flex-direction: column;
    justify-content: space-between;
  }

  .info-heading {
    font-family: 'Orbitron', sans-serif; font-weight: 800; font-size: 26px;
    color: #00e5ff; letter-spacing: 3px; text-transform: uppercase;
    margin-bottom: 8px;
    text-shadow: 0 0 12px rgba(0, 229, 255, 0.4);
  }

  .info-body {
    font-family: 'Inter', sans-serif; font-size: 21px;
    color: rgba(255,255,255,0.75); line-height: 1.35; margin-bottom: 12px;
  }

  .section-sep {
    width: 100%; height: 2px;
    background: linear-gradient(90deg, rgba(0, 229, 255, 0.5), rgba(0, 229, 255, 0.1), transparent);
    margin-bottom: 10px;
  }

  .caution-heading {
    font-family: 'Orbitron', sans-serif; font-weight: 800; font-size: 22px;
    color: #ff3d3d; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 6px;
    text-shadow: 0 0 8px rgba(255, 61, 61, 0.3);
  }

  .caution-body {
    font-family: 'Inter', sans-serif; font-size: 21px;
    color: rgba(255,255,255,0.6); line-height: 1.3; margin-bottom: 10px;
  }

  .safety-warning {
    font-family: 'Inter', sans-serif; font-size: 21px; font-weight: 800;
    color: rgba(255,255,255,0.85); line-height: 1.3; margin-bottom: 12px;
    text-transform: uppercase;
  }

  .fda-box {
    border: 2px solid rgba(0, 229, 255, 0.4);
    padding: 10px 14px;
    background: rgba(0, 229, 255, 0.04);
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  }

  .fda-text {
    font-family: 'Inter', sans-serif; font-size: 21px; font-weight: 600;
    color: rgba(255,255,255,0.55); line-height: 1.3;
  }

  /* === CENTER: HERO BRANDING (Supliful GREEN zone) === */
  .section-hero {
    flex: 0 0 560px;
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
    border-bottom: 440px solid rgba(0, 229, 255, 0.015);
  }

  .logo-group { display: flex; align-items: center; gap: 10px; margin-bottom: 2px; }

  .logo-circle {
    width: 38px; height: 38px;
    border: 2.5px solid #00e5ff; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    position: relative;
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.4), inset 0 0 12px rgba(0, 229, 255, 0.1);
  }
  .logo-circle::before {
    content: ''; position: absolute; inset: -6px;
    border-radius: 50%; border: 1.5px solid rgba(0, 229, 255, 0.15);
  }
  .logo-circle svg { width: 18px; height: 18px; }

  .logo-text {
    font-family: 'Orbitron', sans-serif; font-weight: 900;
    font-size: 28px; color: #fff; letter-spacing: 8px;
    text-shadow: 0 0 20px rgba(0, 229, 255, 0.2);
  }

  .tagline-text {
    font-family: 'Rajdhani', sans-serif; font-size: 21px; font-weight: 600;
    color: rgba(0, 229, 255, 0.7); letter-spacing: 3px;
    text-transform: uppercase; margin-bottom: 8px;
  }

  .hero-line {
    width: 160px; height: 2px;
    background: linear-gradient(90deg, transparent, #00e5ff, transparent);
    margin-bottom: 6px;
    box-shadow: 0 0 10px rgba(0, 229, 255, 0.4);
  }

  .product-label-top {
    font-family: 'Orbitron', sans-serif; font-size: 22px; font-weight: 700;
    color: #00e5ff; letter-spacing: 5px; text-transform: uppercase;
    text-shadow: 0 0 15px rgba(0, 229, 255, 0.6);
    margin-bottom: 0;
  }

  .product-name-line1 {
    font-family: 'Bebas Neue', sans-serif; font-size: 100px;
    line-height: 0.85; letter-spacing: 6px; text-align: center;
    background: linear-gradient(180deg, #ffffff 0%, #e0f7fa 25%, #4dd0e1 55%, #00e5ff 80%, #0097a7 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 30px rgba(0, 229, 255, 0.5)) drop-shadow(0 0 60px rgba(0, 229, 255, 0.2));
  }

  .product-name-x {
    font-family: 'Black Ops One', sans-serif; font-size: 66px;
    line-height: 0.7; letter-spacing: 4px; text-align: center;
    color: #00e5ff;
    text-shadow: 0 0 20px rgba(0, 229, 255, 0.8), 0 0 40px rgba(0, 229, 255, 0.4), 0 0 80px rgba(0, 229, 255, 0.2);
  }

  .product-subtitle {
    font-family: 'Rajdhani', sans-serif; font-size: 22px; font-weight: 600;
    color: rgba(255,255,255,0.6); letter-spacing: 3px;
    text-transform: uppercase; margin-top: 4px;
  }

  .product-tagline {
    font-family: 'Rajdhani', sans-serif; font-size: 24px; font-weight: 700;
    color: rgba(0, 229, 255, 0.85); letter-spacing: 4px;
    text-transform: uppercase; margin-top: 8px;
    text-shadow: 0 0 12px rgba(0, 229, 255, 0.3);
  }

  .benefit-row { display: flex; gap: 6px; margin-top: 10px; }
  .benefit-pill {
    font-family: 'Rajdhani', sans-serif; font-size: 21px; font-weight: 800;
    color: #fff; letter-spacing: 2px; text-transform: uppercase;
    padding: 4px 10px;
    border: 2px solid rgba(0, 229, 255, 0.5);
    background: linear-gradient(135deg, rgba(0, 229, 255, 0.15) 0%, rgba(0, 229, 255, 0.03) 100%);
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
    text-shadow: 0 0 6px rgba(0, 229, 255, 0.3);
  }

  .meta-row { display: flex; gap: 12px; margin-top: 10px; align-items: center; }
  .meta-item { font-family: 'Inter', sans-serif; font-size: 21px; color: rgba(255,255,255,0.5); letter-spacing: 2px; text-transform: uppercase; font-weight: 600; }
  .meta-item.hl { color: rgba(255,255,255,0.7); font-weight: 700; }
  .meta-dot { width: 4px; height: 4px; background: #00e5ff; border-radius: 50%; box-shadow: 0 0 6px rgba(0, 229, 255, 0.6); }

  /* === RIGHT: SUPPLEMENT FACTS (Supliful RED zone — do not modify content) === */
  .section-facts {
    flex: 1;
    padding: 18px 24px 16px;
    display: flex; flex-direction: column;
    justify-content: space-between;
  }

  .facts-header {
    font-family: 'Orbitron', sans-serif; font-weight: 900; font-size: 30px;
    color: #fff; letter-spacing: 3px; text-transform: uppercase;
    padding-bottom: 6px;
    border-bottom: 4px solid #00e5ff;
    margin-bottom: 8px;
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
  }

  .serving-block {
    font-family: 'Inter', sans-serif; font-size: 22px;
    color: rgba(255,255,255,0.8); line-height: 1.5; margin-bottom: 6px;
  }
  .serving-block strong { color: #fff; font-weight: 700; }

  .ft { width: 100%; border-collapse: collapse; }
  .ft .th td {
    border-top: 3px solid rgba(0, 229, 255, 0.8);
    border-bottom: 1px solid rgba(0, 229, 255, 0.4);
    padding: 5px 0;
    font-family: 'Rajdhani', sans-serif; font-size: 21px; font-weight: 700;
    color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px;
  }
  .ft .tr td {
    padding: 8px 0;
    font-family: 'Inter', sans-serif; font-size: 22px;
    color: rgba(255,255,255,0.95);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    font-weight: 500;
  }
  .ft .tr td.amt {
    text-align: right; padding-right: 12px;
    color: #00e5ff; font-weight: 800;
    font-family: 'Rajdhani', sans-serif; font-size: 28px;
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
  }
  .ft .tr td.dv { text-align: right; color: rgba(255,255,255,0.4); font-size: 21px; width: 40px; }

  .ft-bottom {
    border-top: 3px solid rgba(0, 229, 255, 0.8);
    margin-top: 2px; padding-top: 5px;
  }

  .dv-note {
    font-family: 'Inter', sans-serif; font-size: 21px;
    color: rgba(255,255,255,0.4); line-height: 1.3; margin-bottom: 8px;
  }

  .other-ing {
    font-family: 'Inter', sans-serif; font-size: 21px;
    color: rgba(255,255,255,0.55); line-height: 1.35; margin-bottom: 8px;
  }
  .other-ing strong { color: rgba(255,255,255,0.75); font-weight: 800; }

  .mfg-line {
    font-family: 'Inter', sans-serif; font-size: 21px;
    color: rgba(255,255,255,0.4); line-height: 1.35; margin-top: 6px;
  }
  .mfg-line strong { color: rgba(255,255,255,0.55); font-weight: 600; }

  .footer-url-right {
    font-family: 'Inter', sans-serif; font-size: 21px;
    color: rgba(0, 229, 255, 0.6); margin-top: 4px; font-weight: 500;
  }

</style>
</head>
<body>

<div class="label-wrapper">
  <div class="bg-base"></div>
  <div class="bg-slashes"></div>
  <div class="bg-grid"></div>

  <div class="bg-network">
    <svg viewBox="0 0 1800 750" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="150" x2="200" y2="120" stroke="#00e5ff" stroke-width="0.7" opacity="0.1"/>
      <line x1="200" y1="120" x2="350" y2="200" stroke="#00e5ff" stroke-width="0.6" opacity="0.08"/>
      <line x1="350" y1="200" x2="420" y2="100" stroke="#00e5ff" stroke-width="0.5" opacity="0.07"/>
      <line x1="0" y1="550" x2="160" y2="510" stroke="#00e5ff" stroke-width="0.7" opacity="0.09"/>
      <line x1="160" y1="510" x2="310" y2="580" stroke="#00e5ff" stroke-width="0.5" opacity="0.07"/>
      <line x1="680" y1="60" x2="840" y2="100" stroke="#00e5ff" stroke-width="0.5" opacity="0.06"/>
      <line x1="1460" y1="80" x2="1640" y2="120" stroke="#00e5ff" stroke-width="0.6" opacity="0.09"/>
      <line x1="1640" y1="120" x2="1800" y2="90" stroke="#00e5ff" stroke-width="0.7" opacity="0.1"/>
      <line x1="1420" y1="620" x2="1600" y2="600" stroke="#00e5ff" stroke-width="0.6" opacity="0.08"/>
      <line x1="1600" y1="600" x2="1760" y2="670" stroke="#00e5ff" stroke-width="0.7" opacity="0.1"/>
      <circle cx="200" cy="120" r="3.5" fill="#00e5ff" opacity="0.35"/>
      <circle cx="350" cy="200" r="3" fill="#00e5ff" opacity="0.25"/>
      <circle cx="160" cy="510" r="3.5" fill="#00e5ff" opacity="0.3"/>
      <circle cx="840" cy="100" r="3" fill="#00e5ff" opacity="0.2"/>
      <circle cx="1640" cy="120" r="3.5" fill="#00e5ff" opacity="0.35"/>
      <circle cx="1600" cy="600" r="3.5" fill="#00e5ff" opacity="0.3"/>
      <polygon points="450,80 480,60 510,80 510,115 480,135 450,115" fill="none" stroke="#00e5ff" stroke-width="0.6" opacity="0.06"/>
      <polygon points="1340,70 1370,55 1400,70 1400,100 1370,115 1340,100" fill="none" stroke="#00e5ff" stroke-width="0.5" opacity="0.06"/>
      <rect x="870" y="340" width="60" height="60" transform="rotate(45 900 370)" fill="none" stroke="#00e5ff" stroke-width="0.4" opacity="0.03"/>
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

  <!-- === MAIN CONTENT: Info | Hero | Facts === -->
  <div class="label-content">

    <!-- LEFT: SUGGESTED USE / CAUTION / FDA (Yellow zone) -->
    <div class="section-info">
      <div>
        <div class="info-heading">Suggested Use</div>
        <div class="info-body">
          As a dietary supplement adults take two (2) capsules daily. For best results, take with 6-8 oz (177-237ml) of water or as directed by healthcare professional.
        </div>

        <div class="section-sep"></div>

        <div class="caution-heading">Caution</div>
        <div class="caution-body">
          Do not exceed recommended dose. Pregnant or nursing mothers, children under the age of 18, and individuals with a known medical condition should consult a physician before using this or any dietary supplement.
        </div>

        <div class="safety-warning">
          Keep out of reach of children. Do not use if safety seal is damaged or missing. Store in a cool, dry place.
        </div>
      </div>

      <div class="fda-box">
        <div class="fda-text">
          *This statement has not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease.
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <!-- CENTER: HERO BRANDING (Green zone — customize freely) -->
    <div class="section-hero">
      <div class="logo-group">
        <div class="logo-circle">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 19V5"/><path d="M5 12l7-7 7 7"/>
          </svg>
        </div>
        <div class="logo-text">AVIERA</div>
      </div>
      <div class="tagline-text">Stop Guessing · Start Progressing</div>
      <div class="hero-line"></div>
      <div class="product-label-top">Nitric Oxide Booster</div>
      <div class="product-name-line1">FLOW STATE</div>
      <div class="product-name-x">X</div>
      <div class="product-subtitle">Capsules</div>
      <div class="product-tagline">Promotes vascular health and circulation*</div>
      <div class="benefit-row">
        <div class="benefit-pill">Pumps</div>
        <div class="benefit-pill">Blood Flow</div>
        <div class="benefit-pill">Recovery</div>
      </div>
      <div class="meta-row">
        <div class="meta-item hl">Dietary Supplement</div>
        <div class="meta-dot"></div>
        <div class="meta-item">60 Capsules</div>
      </div>
    </div>

    <div class="divider"></div>

    <!-- RIGHT: SUPPLEMENT FACTS (Red zone — match Supliful template exactly) -->
    <div class="section-facts">
      <div>
        <div class="facts-header">Supplement Facts</div>
        <div class="serving-block">
          <strong>Serving Size:</strong> 2 Capsules<br>
          <strong>Servings Per Container:</strong> 30
        </div>
        <table class="ft">
          <tr class="th">
            <td style="width: 50%;">Amount Per Serving</td>
            <td style="width: 28%; text-align: right; padding-right: 12px;"></td>
            <td style="width: 22%; text-align: right;">%DV**</td>
          </tr>
          <tr class="tr">
            <td>L-Citrulline DL-Malate</td>
            <td class="amt">400 mg</td>
            <td class="dv">**</td>
          </tr>
          <tr class="tr">
            <td>L-Arginine Hydrochloride</td>
            <td class="amt">350 mg</td>
            <td class="dv">**</td>
          </tr>
          <tr class="tr">
            <td>L-Arginine Alpha-Ketoglutarate</td>
            <td class="amt">50 mg</td>
            <td class="dv">**</td>
          </tr>
        </table>
        <div class="ft-bottom">
          <div class="dv-note">
            **Daily Value (DV) not established.
          </div>
        </div>
        <div class="other-ing">
          <strong>Other Ingredients:</strong> Cellulose (vegetable capsule), Brown Rice Flour.
        </div>
      </div>

      <div>
        <div class="mfg-line">
          <strong>Manufactured for and distributed by:</strong><br>
          AvieraFit<br>
          4437 Lister St<br>
          San Diego, CA 92110 USA<br>
          Questions? info@avierafit.com
        </div>
        <div class="footer-url-right">avierafit.com</div>
      </div>
    </div>

  </div>
</div>

</body>
</html>
```

---

## Section 8: PNG Render Script (render_label.js)

Save the following as `render_label.js`:

```javascript
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node render_label.js <input.html> <output.png> [scale]');
    process.exit(1);
  }

  const inputFile = path.resolve(args[0]);
  const outputFile = path.resolve(args[1]);
  const scale = parseFloat(args[2]) || 2;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 2200, height: 1200, deviceScaleFactor: scale });

  await page.goto(`file://${inputFile}`, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for web fonts
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 2000));

  const labelEl = await page.$('.label-wrapper');
  if (!labelEl) {
    console.error('Error: No element with class "label-wrapper" found in the HTML.');
    process.exit(1);
  }

  await labelEl.screenshot({ path: outputFile, type: 'png', omitBackground: true });

  console.log(`Label rendered → ${outputFile}`);
  console.log(`Scale factor: ${scale}x`);

  await browser.close();
})();
```

---

## Section 9: PDF Render Script (render_pdf.js)

Save the following as `render_pdf.js`:

```javascript
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node render_pdf.js <input.html> <output.pdf>');
    process.exit(1);
  }

  const inputFile = path.resolve(args[0]);
  const outputFile = path.resolve(args[1]);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1800, height: 750, deviceScaleFactor: 1 });

  await page.goto(`file://${inputFile}`, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for web fonts
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 2000));

  // Remove body padding and make label fill viewport
  await page.evaluate(() => {
    document.body.style.background = document.querySelector('.label-wrapper').style.background || '#020204';
    document.body.style.padding = '0';
    document.body.style.margin = '0';
    document.body.style.minHeight = 'auto';
    document.body.style.display = 'block';
    const wrapper = document.querySelector('.label-wrapper');
    wrapper.style.width = '100vw';
    wrapper.style.height = '100vh';
  });

  await page.pdf({
    path: outputFile,
    width: '1800px',
    height: '750px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    pageRanges: '1',
    preferCSSPageSize: false,
  });

  console.log(`PDF exported → ${outputFile}`);

  await browser.close();
})();
```

---

## End of Skill

This document contains the complete Supplement Label Designer skill. All templates, scripts, references, and compliance guides are embedded above. To use: paste this entire document into your AI assistant's context, then ask it to design a supplement label for your product.
