'use client';

import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { trackViewContent } from '../lib/tracking';
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
      other: 'Other: Cellulose (vegetable capsule), Brown Rice Flour · 2 Capsules · 30 servings · 60 caps',
    },
  },
  'creatine + electrolyte': {
    cat: 'Performance', desc: '5g creatine monohydrate + full electrolyte profile in one scoop.', tags: ['Creatine', 'Electrolytes', 'Hydration', 'Strength'],
    formula: { rows: [{ name: 'Creatine (as Creatine Monohydrate)', dose: '5,000 mg' }, { name: 'Sodium (as Sea Salt)', dose: '1,000 mg' }, { name: 'Potassium (as Potassium Chloride)', dose: '200 mg' }, { name: 'Magnesium (as Magnesium Malate)', dose: '60 mg' }], other: 'Natural Flavors, Stevia Extract (Leaf), Silicon Dioxide · 1 Scoop (10g) · 30 servings · 10.6 oz (300g)' },
  },
  'creatine': {
    cat: 'Performance',
    desc: 'The most researched supplement ever. Pure creatine monohydrate for strength, power, and muscle volume.',
    tags: ['Strength', 'Power', 'Recovery'],
    formula: {
      rows: [{ name: 'Creatine Monohydrate', dose: '5,000 mg' }],
      other: 'Pure micronized creatine monohydrate · 1 Scoop (5g) · 50 servings',
    },
  },
  'whey protein isolate (vanilla)': {
    cat: 'Protein', desc: '100% whey isolate. Fast-absorbing, low-fat, no bloat. Vanilla that mixes smooth.', tags: ['Protein', 'Muscle', 'Recovery'],
    formula: { rows: [{ name: 'Calories', dose: '120' }, { name: 'Total Fat', dose: '1 g' }, { name: 'Saturated Fat', dose: '1 g' }, { name: 'Cholesterol', dose: '13 mg' }, { name: 'Total Carbs', dose: '5 g' }, { name: 'Total Sugars', dose: '2 g' }, { name: 'Protein', dose: '22 g' }, { name: 'Vitamin D', dose: '4 mcg' }, { name: 'Calcium', dose: '105 mg' }, { name: 'Sodium', dose: '115 mg' }, { name: 'Potassium', dose: '110 mg' }], other: 'Whey Protein Isolate, Natural Flavors, MCT Oil Powder, Apple Pectin Powder, Stevia Extract · 2 Scoops (34g) · 24 servings' },
  },
  'whey protein isolate (chocolate)': {
    cat: 'Protein', desc: 'Premium whey isolate in rich Chocolate. High protein per scoop.', tags: ['Protein', 'Muscle', 'Recovery'],
    formula: { rows: [{ name: 'Calories', dose: '120' }, { name: 'Total Fat', dose: '1.5 g' }, { name: 'Saturated Fat', dose: '1.5 g' }, { name: 'Cholesterol', dose: '13 mg' }, { name: 'Total Carbs', dose: '4 g' }, { name: 'Dietary Fiber', dose: '1 g' }, { name: 'Protein', dose: '22 g' }, { name: 'Vitamin D', dose: '4 mcg' }, { name: 'Calcium', dose: '109 mg' }, { name: 'Iron', dose: '2 mg' }, { name: 'Sodium', dose: '180 mg' }, { name: 'Potassium', dose: '250 mg' }], other: 'Whey Protein Isolate, Nidau Cocoa Powder, MCT Oil Powder, Natural Flavors, Sunflower Lecithin · 2 Scoops (35g) · 24 servings' },
  },
  'plant protein (chocolate)': {
    cat: 'Protein', desc: 'Plant-powered protein for lifters who skip the dairy.', tags: ['Vegan', 'Protein', 'Plant-Based'],
    formula: { rows: [{ name: 'Calories', dose: '110' }, { name: 'Total Fat', dose: '1.5 g' }, { name: 'Total Carbs', dose: '4 g' }, { name: 'Dietary Fiber', dose: '1 g' }, { name: 'Protein', dose: '21 g' }, { name: 'Vitamin D', dose: '2 mcg' }, { name: 'Iron', dose: '1 mg' }, { name: 'Sodium', dose: '200 mg' }, { name: 'Potassium', dose: '125 mg' }], other: 'Tendra Fava Bean Protein, YESTEIN Fermented Yeast Protein, Nidau Cocoa Powder, MCT Oil Powder · 2 Scoops (35g) · 24 servings' },
  },
  'plant protein (vanilla)': {
    cat: 'Protein', desc: "Vegan protein that doesn't taste like dirt.", tags: ['Vegan', 'Protein', 'Plant-Based'],
    formula: { rows: [{ name: 'Calories', dose: '110' }, { name: 'Total Fat', dose: '0.5 g' }, { name: 'Total Carbs', dose: '6 g' }, { name: 'Total Sugars', dose: '4 g' }, { name: 'Protein', dose: '20 g' }, { name: 'Sodium', dose: '180 mg' }], other: 'Tendra Fava Bean Protein, Natural Flavors, YESTEIN Fermented Yeast Protein, MCT Oil Powder · 2 Scoops (35g) · 24 servings' },
  },
  'l-glutamine': {
    cat: 'Performance', desc: 'Amino acid for recovery and gut support. Reduces soreness.', tags: ['Recovery', 'Gut Health', 'Muscle'],
    formula: { rows: [{ name: 'L-Glutamine Powder', dose: '2,000 mg' }], other: 'Pure L-Glutamine powder · Unflavored · 1/2 tsp · 150 servings' },
  },
  'beetroot powder': {
    cat: 'Performance', desc: 'Concentrated beetroot powder for nitric oxide and endurance.', tags: ['Nitric Oxide', 'Endurance', 'Stamina'],
    formula: { rows: [{ name: 'Beet Root Powder (Beta vulgaris)', dose: '1,375 mg' }, { name: 'Hibiscus Powder (flower)', dose: '1,000 mg' }, { name: 'Apple Juice Powder (fruit)', dose: '500 mg' }], other: 'Maltodextrin, Stevia Extract (leaf) · 1 Scoop (3.25g) · 30 servings' },
  },
  'beetroot': {
    cat: 'Performance', desc: 'Natural nitrate source for blood flow and endurance.', tags: ['Blood Flow', 'Endurance', 'Nitric Oxide'],
    formula: { rows: [{ name: 'Organic Beetroot Powder (beta vulgaris)', dose: '1,300 mg' }], other: 'Hypromellose (vegetable capsule), Microcrystalline Cellulose, Magnesium stearate · 2 Capsules · 30 servings · 60 caps' },
  },
  'bcaa shock': {
    cat: 'Recovery', desc: 'Branch-chain aminos for muscle recovery and reduced soreness.', tags: ['BCAAs', 'Recovery', 'Muscle'],
    formula: { rows: [{ name: 'Vitamin B6 (Pyridoxine HCl)', dose: '2.5 mg' }, { name: 'L-Glutamine', dose: '1,000 mg' }, { name: 'BCAA 2:1:1', dose: '4,000 mg' }], other: 'Citric Acid, Fruit Punch Flavor, Potassium Citrate, Sucralose, Silicon Dioxide · 6.5g per scoop · 45 servings' },
  },
  'bcaa post workout': {
    cat: 'Recovery', desc: 'Post-workout BCAA recovery with honeydew watermelon flavor.', tags: ['BCAAs', 'Recovery', 'Post-Workout'],
    formula: { rows: [{ name: 'Vitamin B6 (Pyridoxine HCl)', dose: '2.5 mg' }, { name: 'L-Glutamine', dose: '1,000 mg' }, { name: 'BCAA 2:1:1', dose: '4,000 mg' }], other: 'Citric Acid, Honeydew Flavor, Watermelon Flavor, Potassium Citrate, Silicon Dioxide · 6.5g per scoop · 45 servings' },
  },
  'hydration powder (lemonade)': {
    cat: 'Recovery', desc: 'Full-spectrum electrolyte replenishment. Zero sugar, real lemonade flavor.', tags: ['Hydration', 'Electrolytes', 'Recovery'],
    formula: { rows: [{ name: 'Thiamin (Thiamine HCl)', dose: '0.40 mg' }, { name: 'Riboflavin (Vitamin B2)', dose: '0.43 mg' }, { name: 'Niacin (Vitamin B3)', dose: '5.20 mg NE' }, { name: 'Vitamin B6', dose: '0.56 mg' }, { name: 'Folate', dose: '133 mcg DFE' }, { name: 'Vitamin B12', dose: '0.80 mcg' }, { name: 'Pantothenic Acid', dose: '1.66 mg' }, { name: 'Calcium (Calcium Citrate)', dose: '40 mg' }, { name: 'Magnesium (Mag. Citrate)', dose: '20 mg' }, { name: 'Sodium (Sodium Citrate)', dose: '100 mg' }, { name: 'Potassium (Potassium Citrate)', dose: '200 mg' }], other: 'Polydextrose, Citric Acid, N&A Flavors, Sucralose, Calcium Silicate, Beta Carotene · 1 Scoop (5.4g) · 30 servings' },
  },
  'hydration powder (matcha)': {
    cat: 'Recovery', desc: 'Electrolyte hydration with matcha green tea.', tags: ['Hydration', 'Electrolytes', 'Matcha'],
    formula: { rows: [{ name: 'Thiamin (Thiamine HCl)', dose: '0.40 mg' }, { name: 'Riboflavin (Vitamin B2)', dose: '0.43 mg' }, { name: 'Niacin (Vitamin B3)', dose: '5.20 mg NE' }, { name: 'Vitamin B6', dose: '0.56 mg' }, { name: 'Folate', dose: '133 mcg DFE' }, { name: 'Vitamin B12', dose: '0.80 mcg' }, { name: 'Pantothenic Acid', dose: '1.66 mg' }, { name: 'Calcium (Calcium Citrate)', dose: '40 mg' }, { name: 'Magnesium (Mag. Citrate)', dose: '20 mg' }, { name: 'Sodium (Sodium Citrate)', dose: '100 mg' }, { name: 'Potassium (Potassium Citrate)', dose: '200 mg' }], other: 'Polydextrose, Citric acid, N&A Flavors, Sucralose, Calcium Silicate, Vegetable Juice Powder · 1 Scoop (5.4g) · 30 servings' },
  },
  'hydration powder (peach)': {
    cat: 'Recovery', desc: 'Peach mango electrolyte hydration powder.', tags: ['Hydration', 'Electrolytes', 'Recovery'],
    formula: { rows: [{ name: 'Thiamin (Thiamine HCl)', dose: '0.40 mg' }, { name: 'Riboflavin (Vitamin B2)', dose: '0.43 mg' }, { name: 'Niacin (Vitamin B3)', dose: '5.20 mg NE' }, { name: 'Vitamin B6', dose: '0.56 mg' }, { name: 'Calcium (Calcium Citrate)', dose: '40 mg' }, { name: 'Magnesium (Mag. Citrate)', dose: '20 mg' }, { name: 'Sodium (Sodium Citrate)', dose: '100 mg' }, { name: 'Potassium (Potassium Citrate)', dose: '200 mg' }], other: 'Polydextrose, Citric acid, N&A Flavors, Sucralose, Calcium Silicate, Beta Carotene · 1 Scoop (5.4g) · 30 servings' },
  },
  "lion's mane": {
    cat: 'Focus', desc: 'The brain mushroom. Supports cognitive function, memory, and nerve health.', tags: ['Focus', 'Brain Health', 'Mushroom'],
    formula: { rows: [{ name: "Organic Lion's Mane Mushroom Fruiting Body & Mycelium Powder (40% polysaccharides)", dose: '1,000 mg' }], other: 'Organic capsule (pullulan, water), organic pea starch · 2 Vegan Capsules · 30 servings · 60 caps' },
  },
  'ashwagandha': {
    cat: 'Sleep', desc: 'Ancient adaptogen for modern stress. Lowers cortisol, improves recovery.', tags: ['Stress', 'Adaptogen', 'Recovery'],
    formula: { rows: [{ name: 'Organic Ashwagandha (Withania somnifera)(root)', dose: '650 mg' }, { name: 'Organic Black Pepper (Piper nigrum)(fruit)', dose: '5 mg' }], other: 'Pullulan capsules · 1 Capsule · 60 servings · 60 caps' },
  },
  'sleep formula': {
    cat: 'Sleep', desc: 'Fall asleep faster, stay asleep longer, wake up recovered.', tags: ['Sleep', 'Recovery', 'Relaxation'],
    formula: { rows: [{ name: 'Valerian Extract (root)', dose: '150 mg' }, { name: 'Chamomile Extract (flower)', dose: '100 mg' }, { name: 'GABA', dose: '100 mg' }, { name: 'L-Tryptophan', dose: '100 mg' }, { name: 'Lemon Balm Extract', dose: '100 mg' }, { name: 'Passion Flower Extract', dose: '100 mg' }, { name: 'Melatonin', dose: '2 mg' }], other: 'Gelatin (capsule), Brown Rice Flour · 2 Capsules · 30 servings · 60 caps' },
  },
  'sleep support': {
    cat: 'Sleep', desc: 'Advanced sleep support with 14-ingredient proprietary blend.', tags: ['Sleep', 'Calm', 'Melatonin'],
    formula: { rows: [{ name: 'Vitamin B6 (Pyridoxine HCl)', dose: '1.8 mg' }, { name: 'Calcium (Calcium Carbonate)', dose: '17 mg' }, { name: 'Magnesium (Magnesium Citrate)', dose: '13 mg' }, { name: 'Melatonin', dose: '10 mg' }, { name: 'Sleep Formula Proprietary Blend', dose: '905 mg' }], other: 'Blend: L-Tryptophan, Lycium, Chamomile, Lemon Balm, Passion Flower, L-Taurine, Hops, St. John\'s Wort, GABA, Skullcap, L-Theanine, Ashwagandha, Inositol, 5-HTP · 2 Capsules · 30 servings' },
  },
  'magnesium': {
    cat: 'Sleep', desc: 'The most absorbable form of magnesium. Supports sleep, reduces cramps.', tags: ['Mineral', 'Sleep', 'Muscle'],
    formula: { rows: [{ name: 'Magnesium (from 2,500 mg Mag. Glycinate)', dose: '275 mg' }], other: 'Hypromellose (capsule), Magnesium Stearate, Silicon Dioxide, Rice Flour · 3 Capsules · 30 servings · 90 caps' },
  },
  'complete multivitamin': {
    cat: 'Health', desc: 'Complete daily multivitamin with essential vitamins and minerals.', tags: ['Vitamins', 'Daily Health', 'Foundation'],
    formula: { rows: [{ name: 'Vitamin A (Beta-Carotene)', dose: '600 mcg RAE' }, { name: 'Vitamin C (Ascorbic Acid)', dose: '150 mg' }, { name: 'Vitamin D (Cholecalciferol)', dose: '10 mcg' }, { name: 'Vitamin E', dose: '13.5 mg' }, { name: 'Vitamin B1', dose: '7.5 mg' }, { name: 'Vitamin B2', dose: '7.5 mg' }, { name: 'Niacin', dose: '30 mg NE' }, { name: 'Vitamin B6', dose: '7.5 mg' }, { name: 'Folate', dose: '667 mcg DFE' }, { name: 'Vitamin B12', dose: '27 mcg' }, { name: 'Biotin', dose: '300 mcg' }, { name: 'Zinc', dose: '15 mg' }, { name: 'Selenium', dose: '30 mcg' }, { name: 'Chromium', dose: '120 mcg' }], other: 'Rice Flour, Hypromellose (vegetable capsule), Magnesium stearate · 2 Capsules · 30 servings · 60 caps' },
  },
  'omega-3': {
    cat: 'Health', desc: 'Essential fatty acids for heart, brain, and joint support.', tags: ['Heart', 'Brain', 'Joint Health'],
    formula: { rows: [{ name: 'Fish Oil Concentrate', dose: '1,000 mg' }, { name: 'EPA (Eicosapentaenoic Acid)', dose: '180 mg' }, { name: 'DHA (Docosahexaenoic Acid)', dose: '120 mg' }], other: 'Softgel (gelatin, glycerin, water), Vitamin E. Contains: Fish (Sardines, Anchovies) · 1 Softgel · 100 servings · 100 softgels' },
  },
  'probiotic 20': {
    cat: 'Health', desc: '13-strain probiotic for digestive balance and immune support.', tags: ['Gut Health', 'Digestion', 'Immune'],
    formula: { rows: [{ name: '13 Strain Probiotic', dose: '317 mg (20 Billion CFU)' }], other: 'Strains: L. Acidophilus, L. Salivarius, L. Plantarum, L. Rhamnosus, B. Lactis, B. Bifidum, L. Fermentum, L. Reuteri, B. Longum & more · 1 Capsule · 30 servings' },
  },
  'probiotic 40': {
    cat: 'Health', desc: 'Double the CFUs plus prebiotics to feed the good bacteria.', tags: ['Gut Health', 'Digestion', 'Prebiotics'],
    formula: { rows: [{ name: 'Proprietary Probiotic Blend (40 Billion CFU)', dose: '800 mg' }, { name: 'Complex Marine Polysaccharide', dose: '60 mg' }, { name: 'Fructooligosaccharide', dose: '24 mg' }], other: 'MAKTREK Bi-Pass Technology, L. Acidophilus, B. Lactis, L. Plantarum, L. Paracasei · 2 Capsules · 30 servings · 60 caps' },
  },
  'coq10': {
    cat: 'Health', desc: 'Cellular energy production and heart health support.', tags: ['Heart Health', 'Energy', 'Antioxidant'],
    formula: { rows: [{ name: 'Coenzyme Q-10 (Ubiquinone)', dose: '200 mg' }], other: 'Rice Flour, Hypromellose (vegetable capsule) · 1 Capsule · 30 servings · 30 caps' },
  },
  'platinum turmeric': {
    cat: 'Health', desc: 'Premium turmeric complex for joints and inflammation.', tags: ['Anti-Inflammatory', 'Joint', 'Recovery'],
    formula: { rows: [{ name: 'Turmeric Root Powder', dose: '800 mg' }, { name: 'Glucosamine Sulfate 2KCl', dose: '200 mg' }, { name: 'Turmeric 95% Curcuminoids', dose: '100 mg' }, { name: 'Ginger Root Extract', dose: '100 mg' }, { name: 'Chondroitin Sulfate', dose: '50 mg' }, { name: 'Boswellia Extract', dose: '40 mg' }, { name: 'BioPerine', dose: '10 mg' }, { name: 'MSM', dose: '10 mg' }, { name: 'Quercetin Dihydrate', dose: '8 mg' }, { name: 'Bromelain', dose: '8 mg' }], other: 'Hypromellose (vegetable capsule), Rice Flour. CONTAINS: Shellfish · 2 Capsules · 30 servings · 60 caps' },
  },
  'apple cider vinegar': {
    cat: 'Health', desc: 'All the ACV benefits without the taste.', tags: ['Digestion', 'Weight', 'Wellness'],
    formula: { rows: [{ name: 'Organic Apple Cider Vinegar Powder', dose: '1,000 mg' }, { name: 'Inulin (jerusalem artichoke root)', dose: '200 mg' }, { name: 'DigeZyme', dose: '100 mg' }, { name: 'Lactobacillus acidophilus LA85', dose: '10 mg (1 Billion CFU)' }], other: 'HPMC (vegetable capsule), Brown Rice Flour, Magnesium Stearate, Olive Oil · 2 Capsules · 30 servings · 60 caps' },
  },
  'gut health': {
    cat: 'Health', desc: 'Digestive wellness and gut balance with ACV and probiotics.', tags: ['Gut Health', 'Digestion', 'Wellness'],
    formula: { rows: [{ name: 'Organic Apple Cider Vinegar Powder', dose: '1,000 mg' }, { name: 'Inulin (jerusalem artichoke root)', dose: '200 mg' }, { name: 'DigeZyme', dose: '100 mg' }, { name: 'Lactobacillus acidophilus LA85', dose: '10 mg (1 Billion CFU)' }], other: 'HPMC (vegetable capsule), Brown Rice Flour, Magnesium Stearate · 2 Capsules · 30 servings · 60 caps' },
  },
  'keto bhb': {
    cat: 'Weight', desc: 'Exogenous ketones for keto support and clean energy.', tags: ['Keto', 'Energy', 'Fat Burn'],
    formula: { rows: [{ name: 'Calcium (calcium citrate, calcium BHB)', dose: '146 mg' }, { name: 'Magnesium (magnesium BHB)', dose: '1 mg' }, { name: 'Sodium (sodium BHB)', dose: '1 mg' }, { name: 'Keto Proprietary Blend', dose: '800 mg' }], other: 'Gelatin (capsule), Brown Rice Flour · 2 Capsules · 30 servings · 60 caps' },
  },
  'keto-5': {
    cat: 'Weight', desc: 'Thermogenic keto blend with raspberry ketone and green tea.', tags: ['Keto', 'Fat Burn', 'Thermogenic'],
    formula: { rows: [{ name: 'Keto Blend', dose: '650 mg' }], other: 'Blend: Raspberry Ketone (98%), Green Tea (leaf)(98% polyphenols), Caffeine Anhydrous, Green Coffee Bean, Garcinia Cambogia · 1 Capsule · 60 servings. CONTAINS CAFFEINE.' },
  },
  'fat burner': {
    cat: 'Weight', desc: 'Comprehensive fat burner with MCT oil, CLA, and thermogenic botanicals.', tags: ['Fat Burn', 'MCT', 'Metabolism'],
    formula: { rows: [{ name: 'Vitamin C (Ascorbic Acid)', dose: '60 mg' }, { name: 'Vitamin B-6 (Pyridoxine HCl)', dose: '25 mg' }, { name: 'Choline (Choline Bitartrate)', dose: '200 mg' }, { name: 'Chromium (Chromium Polynicotinate)', dose: '200 mcg' }, { name: 'Inositol', dose: '500 mg' }, { name: 'Garcinia cambogia Fruit Extract', dose: '200 mg' }, { name: 'CLA (Conjugated Linoleic Acid)', dose: '100 mg' }, { name: 'Medium Chain Triglycerides Oil', dose: '70 mg' }, { name: 'Bladderwrack Thallus Powder', dose: '50 mg' }, { name: 'L-Carnitine (L-Carnitine Tartrate)', dose: '25 mg' }, { name: 'Gymnema sylvestre Leaf', dose: '25 mg' }, { name: 'Turmeric Root (95% extract)', dose: '25 mg' }, { name: 'GLA (Gamma-Linolenic Acid)', dose: '5 mg' }, { name: 'Coenzyme Q10', dose: '5 mg' }], other: 'Gelatin (bovine), rice flour, vegetable magnesium stearate, silicon dioxide, chlorophyll · 4 Capsules · 22 servings · 88 caps' },
  },
  'collagen': {
    cat: 'Beauty', desc: 'Grass-fed collagen for skin elasticity, joint support, and recovery.', tags: ['Collagen', 'Skin', 'Joint'],
    formula: { rows: [{ name: 'Calories', dose: '70' }, { name: 'Protein', dose: '18 g' }, { name: 'Calcium', dose: '26 mg' }, { name: 'Hydrolyzed Collagen Peptides (bovine)', dose: '20 g' }], other: 'Bovine hide collagen peptides · 1 Scoop (20g) · 14 servings' },
  },
  'hyaluronic acid serum': {
    cat: 'Beauty', desc: 'Deep hydration and skin plumping serum.', tags: ['Hydration', 'Plumping', 'Glow'],
    formula: { rows: [{ name: 'Sodium Hyaluronate', dose: 'Active' }], other: 'Water, Sodium Hyaluronate, Phenoxyethanol, Ethylhexylglycerin · Topical serum' },
  },
  'vitamin glow serum': {
    cat: 'Beauty', desc: 'Radiant skin & glow support serum with niacinamide and vitamin C.', tags: ['Glow', 'Radiance', 'Nourish'],
    formula: { rows: [{ name: 'Niacinamide', dose: 'Active' }, { name: 'Tocopheryl Acetate (Vitamin E)', dose: 'Active' }, { name: 'Ascorbic Acid (Vitamin C)', dose: 'Active' }, { name: 'Sodium Hyaluronate', dose: 'Active' }], other: 'Water, Phenoxyethanol, Ethylhexylglycerin · Topical serum' },
  },
  'energy powder': {
    cat: 'Pre-Workout', desc: 'Clean energy without the crash. Smooth, sustained power.', tags: ['Energy', 'Focus', 'Endurance'],
    formula: { rows: [{ name: 'Thiamin (Thiamine HCl)', dose: '0.40 mg' }, { name: 'Riboflavin (Vitamin B2)', dose: '0.43 mg' }, { name: 'Niacin (Vitamin B3)', dose: '5.20 mg NE' }, { name: 'Vitamin B6', dose: '0.56 mg' }, { name: 'Vitamin B12', dose: '0.80 mcg' }, { name: 'Magnesium (Mag. Citrate)', dose: '36 mg' }, { name: 'Sodium (Sodium Citrate)', dose: '60 mg' }, { name: 'Potassium (Potassium Citrate)', dose: '130 mg' }, { name: 'Taurine', dose: '1,000 mg' }, { name: 'Natural Caffeine (from Green Tea)', dose: '200 mg' }, { name: 'L-Theanine', dose: '100 mg' }], other: 'Polydextrose, Citric acid, N&A Flavors, Sucralose · 2 Scoops (7g) · 20 servings. Contains caffeine.' },
  },
  'alpha energy': {
    cat: 'Pre-Workout', desc: 'Male vitality and testosterone support with tribulus and zinc.', tags: ['Testosterone', 'Drive', 'Vitality'],
    formula: { rows: [{ name: 'Magnesium (as Magnesium Oxide)', dose: '200 mg' }, { name: 'Zinc (as Zinc Oxide)', dose: '30 mg' }, { name: 'Tribulus Terrestris (fruit)', dose: '750 mg' }, { name: 'Chrysin (Oroxylum indicum)(seed)', dose: '75 mg' }, { name: 'Horny Goat Weed (aerial)', dose: '50 mg' }, { name: 'Longjack (Eurycoma longifolia)(root)', dose: '50 mg' }, { name: 'Saw Palmetto Berries (berry)', dose: '50 mg' }, { name: 'Hawthorn Berries (berry)', dose: '50 mg' }, { name: 'Cissus Quadrangularis (stem)', dose: '50 mg' }], other: 'Hypromellose (vegetable capsule), Rice Flour, Magnesium Stearate · 3 Capsules · 30 servings · 90 caps' },
  },
  'nitric shock': {
    cat: 'Pre-Workout', desc: 'Maximum pump and explosive energy pre-workout.', tags: ['Pump', 'Energy', 'Pre-Workout'],
    formula: { rows: [{ name: 'Dicreatine Malate', dose: '1,500 mg' }, { name: 'L-Arginine Alpha Ketoglutarate', dose: '1,500 mg' }, { name: 'Energy/Endurance/Focus Blend', dose: '550 mg' }, { name: 'Calcium (Dicalcium Phosphate)', dose: '120 mg' }, { name: 'Sodium (Sodium Citrate)', dose: '80 mg' }, { name: 'Beta Alanine', dose: '75 mg' }, { name: 'Vitamin B3 (Niacin)', dose: '20 mg' }], other: 'Maltodextrin, Citric Acid, Fruit Punch Flavor, Dextrose, Sucralose · 1 Scoop (10g) · 30 servings' },
  },
  'nootropic powder': {
    cat: 'Focus', desc: 'Lock in mentally. Nootropic powder for deep focus.', tags: ['Focus', 'Clarity', 'Nootropic'],
    formula: { rows: [{ name: 'L-Arginine HCl', dose: '1,000 mg' }, { name: 'Inositol', dose: '600 mg' }, { name: 'Alpha GPC', dose: '300 mg' }, { name: 'Natural Caffeine (from Green Tea)', dose: '200 mg' }, { name: 'L-Theanine', dose: '100 mg' }, { name: 'Asian Ginseng Extract', dose: '50 mg' }, { name: 'Black Pepper Extract', dose: '5 mg' }], other: 'Polydextrose, Malic Acid, N&A Flavors, Citric Acid, Blue Spirulina · 2 Scoops · 20 servings. Contains caffeine.' },
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
  // Priority 1: Hardcoded catalog formulas (verified from real labels — has accurate dosage amounts)
  const catalog = getCatalogData(product.title);
  if (catalog && catalog.formula) {
    return { type: 'formula', ...catalog.formula };
  }

  // Priority 2: Shopify descriptionHtml
  if (product.descriptionHtml) {
    const parsed = parseIngredientsFromHtml(product.descriptionHtml);
    if (parsed) {
      return { type: 'ingredients-list', ingredients: parsed.ingredients, servingLine: parsed.servingInfo ? `Serving Size: ${parsed.servingInfo}` : null };
    }
  }

  // Priority 3: Local products.js data
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

  // Priority 4: Label image fallback
  if (product.images && product.images.length >= 2) {
    return { type: 'label-image', labelImage: product.images[product.images.length - 1] };
  }

  return { type: 'fallback' };
}

function FormulaSection({ formulaData, accentColor = '#00ffcc' }) {
  if (!formulaData) return null;

  return (
    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ fontFamily: OSWALD, fontSize: '12px', letterSpacing: '0.2em', color: accentColor, textTransform: 'uppercase', marginBottom: '8px' }}>
        The Formula
      </div>

      {formulaData.type === 'formula' && (
        <>
          {formulaData.rows.map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '12px' }}>
              <span style={{ color: '#e0e0e0', flex: 1, paddingRight: '8px' }}>{row.name}</span>
              <span style={{ fontFamily: OSWALD, fontWeight: 700, color: accentColor, whiteSpace: 'nowrap' }}>{row.dose}</span>
            </div>
          ))}
          {formulaData.other && (
            <div style={{ fontSize: '10px', color: '#999', marginTop: '8px', lineHeight: 1.5 }}>{formulaData.other}</div>
          )}
        </>
      )}

      {formulaData.type === 'ingredients-list' && (
        <>
          {formulaData.servingLine && (
            <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '6px' }}>{formulaData.servingLine}</div>
          )}
          {formulaData.ingredients.map((ing, i) => (
            <div key={i} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', color: '#e0e0e0' }}>
              {ing}
            </div>
          ))}
        </>
      )}

      {formulaData.type === 'label-image' && formulaData.labelImage && (
        <div style={{ textAlign: 'center', marginTop: '4px' }}>
          <img src={formulaData.labelImage} alt="Supplement Facts" style={{ maxWidth: '100%', borderRadius: '6px', background: '#ffffff', padding: '4px' }} />
          <div style={{ fontSize: '8px', color: '#666', marginTop: '4px' }}>Supplement Facts Label</div>
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
// Category color system — matches dashboard CATEGORY_COLOR_MAP
const CATEGORY_COLORS = {
  'Performance': '#00e5ff',
  'Pre-Workout': '#FF3B3B',
  'Protein': '#8B5CF6',
  'Recovery': '#FFD700',
  'Sleep': '#a855f7',      // user spec: bright purple
  'Focus': '#3B82F6',
  'Weight': '#F97316',
  'Beauty': '#EC4899',
  'Health': '#22C55E',
};

function getCategoryForProduct(name = '') {
  const n = name.toLowerCase();
  // Nootropics + Lion's Mane → Focus
  if (/nootropic|lion.?s mane/i.test(n)) return 'Focus';
  // Pre-Workout & Energy — energy powders, alpha energy, pre-workout, CoQ10
  if (/pre.?workout|alpha energy|nitric shock|energy powder|coq10|ubiquinone/i.test(n)) return 'Pre-Workout';
  // Protein
  if (/whey|plant protein|protein isolate/i.test(n)) return 'Protein';
  // Recovery & Hydration
  if (/hydration|electrolyte|bcaa/i.test(n)) return 'Recovery';
  // Sleep
  if (/sleep|melatonin|magnesium|ashwagandha/i.test(n)) return 'Sleep';
  // Weight
  if (/fat.?burn|keto|weight|metabolism|thermogenic/i.test(n)) return 'Weight';
  // Beauty & Skin
  if (/collagen|hyaluronic|vitamin glow|skin|beauty|hair/i.test(n)) return 'Beauty';
  // Performance — Flow State X, Creatine, Beetroot, L-Glutamine
  if (/flow state x(?!.*nootropic)|flow state(?!.*nootropic)|creatine|beetroot|glutamine/i.test(n)) return 'Performance';
  // Health & Wellness default (multivitamin, probiotic, turmeric, omega-3, ACV, gut health)
  return 'Health';
}

function getProductTheme(title) {
  const cat = getCategoryForProduct(title);
  const color = CATEGORY_COLORS[cat] || '#00ffcc';
  return {
    accent: color,
    border: `rgba(${hexToRgb(color)}, 0.2)`,
    tagColor: color,
    tagBorder: `rgba(${hexToRgb(color)}, 0.3)`,
    catColor: color,
    formulaAccent: color,
    categoryLabel: {
      'Performance': 'PERFORMANCE', 'Pre-Workout': 'PRE-WORKOUT & ENERGY', 'Protein': 'PROTEIN',
      'Recovery': 'RECOVERY & HYDRATION', 'Sleep': 'SLEEP', 'Focus': 'FOCUS & COGNITIVE',
      'Weight': 'WEIGHT MANAGEMENT', 'Beauty': 'BEAUTY & SKIN', 'Health': 'HEALTH & WELLNESS',
    }[cat] || 'HEALTH & WELLNESS',
  };
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export default function ProductDetailModal({ product, onClose, onAddToCart, adding, added }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomedImage, setZoomedImage] = useState(null);

  // Fire ViewContent when modal opens
  useEffect(() => {
    if (product) {
      trackViewContent(product.title, product.variantId || product.id, typeof product.price === 'number' ? product.price : 0);
    }
  }, [product]);

  if (!product) return null;

  const catalog = getCatalogData(product.title);
  const formulaData = getFormulaData(product);
  const displayDesc = catalog ? catalog.desc : product.description;
  const displayTags = catalog ? catalog.tags : [];
  const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
  const theme = getProductTheme(product.title);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
        style={{ background: '#0a0a0a', border: `1px solid ${theme.border}` }}
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

        {/* Zoom overlay */}
        {zoomedImage && (
          <div
            onClick={() => setZoomedImage(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(255,255,255,0.97)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', padding: '20px' }}
          >
            <img src={zoomedImage} alt="Zoomed" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', background: '#fff', borderRadius: '8px', padding: '8px' }} />
            <button onClick={() => setZoomedImage(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', color: '#333', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={20} />
            </button>
          </div>
        )}

        {/* Image carousel */}
        {images.length > 0 && (
          <div className="relative" style={{ width: '100%', height: '220px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img
              src={images[currentImageIndex]}
              alt={product.title}
              style={{ maxHeight: '200px', maxWidth: '90%', objectFit: 'contain', cursor: 'zoom-in' }}
              onClick={() => setZoomedImage(images[currentImageIndex])}
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
                      style={{ width: '6px', height: '6px', background: i === currentImageIndex ? theme.accent : 'rgba(0,0,0,0.25)' }}
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
          <div style={{ fontFamily: SPACE_MONO, fontSize: '9px', color: theme.catColor, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '3px' }}>
            {theme.categoryLabel}
          </div>

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
                  style={{ fontSize: '7px', fontWeight: 700, textTransform: 'uppercase', padding: '2px 6px', border: `1px solid ${theme.tagBorder}`, borderRadius: '2px', color: theme.tagColor }}
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
                background: added ? '#111' : theme.accent,
                border: added ? `1px solid ${theme.accent}` : 'none',
                borderRadius: '6px',
                fontFamily: OSWALD,
                fontSize: '16px',
                letterSpacing: '0.12em',
                color: added ? theme.accent : '#000',
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
          <FormulaSection formulaData={formulaData} accentColor={theme.formulaAccent} />
        </div>
      </div>
    </div>
  );
}
