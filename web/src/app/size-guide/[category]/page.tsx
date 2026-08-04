'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiChevronRight, FiInfo, FiMaximize2, FiAlertCircle } from 'react-icons/fi';
import styles from './page.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SizeRow { [key: string]: string; }

interface SizeChart {
  title: string;
  headers: string[];
  rows: SizeRow[];
}

interface HowToMeasure { step: string; title: string; instruction: string; tip: string; }

interface SizeGuideConfig {
  title: string;
  emoji: string;
  subtitle: string;
  description: string;
  accentColor: string;
  bannerUrl: string;
  note?: string;
  charts: SizeChart[];
  howToMeasure: HowToMeasure[];
  fitTips: { emoji: string; title: string; desc: string; }[];
  relatedCategories: { slug: string; label: string; emoji: string; }[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SIZE_GUIDES: Record<string, SizeGuideConfig> = {
  shirts: {
    title: 'Men\'s & Women\'s Topwear Size Guide',
    emoji: '👕',
    subtitle: 'Find Your Perfect Fit — Shirts, Tees & Tops',
    description: 'Use the comprehensive charts below to convert your local sizing to brand sizes. Measurements are in inches (in) and centimetres (cm).',
    accentColor: '#3b82f6',
    bannerUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&h=320&fit=crop',
    note: 'If you\'re between two sizes, we recommend sizing up for a comfortable fit. Slim-fit styles run half a size smaller.',
    charts: [
      {
        title: "Men's Shirt Sizing",
        headers: ['Brand Size', 'Standard Size', 'Chest (in)', 'Chest (cm)', 'Shoulder (in)', 'Front Length (in)'],
        rows: [
          { 'Brand Size': 'XS', 'Standard Size': '36', 'Chest (in)': '36–37', 'Chest (cm)': '91–94', 'Shoulder (in)': '16.5', 'Front Length (in)': '27' },
          { 'Brand Size': 'S',  'Standard Size': '38', 'Chest (in)': '38–39', 'Chest (cm)': '96–99', 'Shoulder (in)': '17',   'Front Length (in)': '27.5' },
          { 'Brand Size': 'M',  'Standard Size': '40', 'Chest (in)': '40–41', 'Chest (cm)': '101–104', 'Shoulder (in)': '17.5', 'Front Length (in)': '28' },
          { 'Brand Size': 'L',  'Standard Size': '42', 'Chest (in)': '42–43', 'Chest (cm)': '106–109', 'Shoulder (in)': '18',   'Front Length (in)': '29' },
          { 'Brand Size': 'XL', 'Standard Size': '44', 'Chest (in)': '44–46', 'Chest (cm)': '111–116', 'Shoulder (in)': '18.5', 'Front Length (in)': '30' },
          { 'Brand Size': 'XXL','Standard Size': '46', 'Chest (in)': '47–49', 'Chest (cm)': '119–124', 'Shoulder (in)': '19.5', 'Front Length (in)': '31' },
        ],
      },
      {
        title: "Women's Top Sizing",
        headers: ['Brand Size', 'IN Size', 'US Size', 'UK Size', 'Bust (in)', 'Waist (in)', 'Hip (in)'],
        rows: [
          { 'Brand Size': 'XS', 'IN Size': '28', 'US Size': '0',  'UK Size': '4',  'Bust (in)': '30–31', 'Waist (in)': '24–25', 'Hip (in)': '33–34' },
          { 'Brand Size': 'S',  'IN Size': '30', 'US Size': '2',  'UK Size': '6',  'Bust (in)': '32–33', 'Waist (in)': '26–27', 'Hip (in)': '35–36' },
          { 'Brand Size': 'M',  'IN Size': '32', 'US Size': '4',  'UK Size': '8',  'Bust (in)': '34–35', 'Waist (in)': '28–29', 'Hip (in)': '37–38' },
          { 'Brand Size': 'L',  'IN Size': '34', 'US Size': '6',  'UK Size': '10', 'Bust (in)': '36–37', 'Waist (in)': '30–31', 'Hip (in)': '39–40' },
          { 'Brand Size': 'XL', 'IN Size': '36', 'US Size': '8',  'UK Size': '12', 'Bust (in)': '38–39', 'Waist (in)': '32–33', 'Hip (in)': '41–42' },
          { 'Brand Size': 'XXL','IN Size': '38', 'US Size': '10', 'UK Size': '14', 'Bust (in)': '40–41', 'Waist (in)': '34–35', 'Hip (in)': '43–44' },
        ],
      },
    ],
    howToMeasure: [
      { step: '01', title: 'Chest / Bust', instruction: 'Wrap a flexible tape measure under your arms, across the fullest part of your chest. Keep the tape parallel to the floor.', tip: 'Breathe naturally — don\'t hold your breath or pull the tape too tight.' },
      { step: '02', title: 'Shoulder Width', instruction: 'Measure across the back from one shoulder seam to the other, from shoulder point to shoulder point.', tip: 'Ask a friend to help — this measurement is tricky to take alone accurately.' },
      { step: '03', title: 'Front Length', instruction: 'Place the end of the tape at the highest point of your shoulder and measure straight down to where you want the shirt hem to fall.', tip: 'Measure in a relaxed, standing position for most accurate results.' },
      { step: '04', title: 'Waist (Women)', instruction: 'Measure around the narrowest part of your natural waist, usually around 1–2 inches above the navel.', tip: 'Exhale naturally before measuring — this gives your true waist size.' },
    ],
    fitTips: [
      { emoji: '📐', title: 'When in Doubt, Size Up', desc: 'For casual wear, going one size up gives a relaxed silhouette that\'s universally flattering.' },
      { emoji: '✂️', title: 'Slim Fit Runs Small', desc: 'Slim and tailored styles run approximately half a size smaller — check the brand-specific guide on each PDP.' },
      { emoji: '🧺', title: 'Pre-Wash Shrinkage', desc: 'Cotton garments may shrink 5–8% after the first wash. Size up if you plan to machine wash.' },
    ],
    relatedCategories: [
      { slug: 'jeans', label: 'Jeans & Trousers', emoji: '👖' },
      { slug: 'shoes', label: 'Footwear', emoji: '👟' },
      { slug: 'ethnic', label: 'Ethnic Wear', emoji: '🥻' },
    ],
  },
  shoes: {
    title: 'Footwear Standard Size Guide',
    emoji: '👟',
    subtitle: 'Find Your Perfect Shoe Size — Sneakers, Boots & More',
    description: 'Compare regional foot sizing standards (UK, US, EU, IN) against actual foot lengths in centimeters to pick the right sneakers, boots, or sandals.',
    accentColor: '#f59e0b',
    bannerUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=320&fit=crop',
    note: 'If your foot is between sizes, go up half a size. Leather shoes tend to stretch slightly after break-in.',
    charts: [
      {
        title: "Men's Shoe Sizing",
        headers: ['UK Size', 'US Size', 'EU Size', 'IN Size', 'Foot Length (cm)', 'Foot Length (in)'],
        rows: [
          { 'UK Size': '5',  'US Size': '6',  'EU Size': '38', 'IN Size': '5',  'Foot Length (cm)': '24.0', 'Foot Length (in)': '9.4' },
          { 'UK Size': '6',  'US Size': '7',  'EU Size': '39', 'IN Size': '6',  'Foot Length (cm)': '24.8', 'Foot Length (in)': '9.8' },
          { 'UK Size': '7',  'US Size': '8',  'EU Size': '41', 'IN Size': '7',  'Foot Length (cm)': '25.7', 'Foot Length (in)': '10.1' },
          { 'UK Size': '8',  'US Size': '9',  'EU Size': '42', 'IN Size': '8',  'Foot Length (cm)': '26.5', 'Foot Length (in)': '10.4' },
          { 'UK Size': '9',  'US Size': '10', 'EU Size': '43', 'IN Size': '9',  'Foot Length (cm)': '27.3', 'Foot Length (in)': '10.8' },
          { 'UK Size': '10', 'US Size': '11', 'EU Size': '44', 'IN Size': '10', 'Foot Length (cm)': '28.0', 'Foot Length (in)': '11.1' },
          { 'UK Size': '11', 'US Size': '12', 'EU Size': '45', 'IN Size': '11', 'Foot Length (cm)': '28.8', 'Foot Length (in)': '11.3' },
          { 'UK Size': '12', 'US Size': '13', 'EU Size': '46', 'IN Size': '12', 'Foot Length (cm)': '29.6', 'Foot Length (in)': '11.7' },
        ],
      },
      {
        title: "Women's Shoe Sizing",
        headers: ['UK Size', 'US Size', 'EU Size', 'IN Size', 'Foot Length (cm)', 'Foot Length (in)'],
        rows: [
          { 'UK Size': '3',   'US Size': '5',  'EU Size': '36', 'IN Size': '3',   'Foot Length (cm)': '22.1', 'Foot Length (in)': '8.7' },
          { 'UK Size': '4',   'US Size': '6',  'EU Size': '37', 'IN Size': '4',   'Foot Length (cm)': '22.8', 'Foot Length (in)': '9.0' },
          { 'UK Size': '5',   'US Size': '7',  'EU Size': '38', 'IN Size': '5',   'Foot Length (cm)': '23.5', 'Foot Length (in)': '9.3' },
          { 'UK Size': '6',   'US Size': '8',  'EU Size': '39', 'IN Size': '6',   'Foot Length (cm)': '24.3', 'Foot Length (in)': '9.6' },
          { 'UK Size': '7',   'US Size': '9',  'EU Size': '40', 'IN Size': '7',   'Foot Length (cm)': '25.0', 'Foot Length (in)': '9.8' },
          { 'UK Size': '8',   'US Size': '10', 'EU Size': '41', 'IN Size': '8',   'Foot Length (cm)': '25.8', 'Foot Length (in)': '10.2' },
        ],
      },
    ],
    howToMeasure: [
      { step: '01', title: 'Trace Your Foot', instruction: 'Place a blank sheet of paper against a wall. Stand barefoot with your heel lightly touching the wall and trace the outline of your foot with a pen held vertically.', tip: 'Measure in the evening — feet are naturally slightly larger at the end of the day.' },
      { step: '02', title: 'Measure Length', instruction: 'Using a ruler, measure from the back of your heel trace to the tip of your longest toe. This measurement in centimeters is your foot length.', tip: 'Measure both feet and use the larger measurement when choosing your size.' },
      { step: '03', title: 'Measure Width', instruction: 'Measure the widest part of your foot outline — usually at the ball of your foot. Wide-fit shoes are available if your width exceeds standard dimensions.', tip: 'If you have wide feet, look for products labeled W (Wide) or EE width.' },
    ],
    fitTips: [
      { emoji: '👆', title: 'Thumb\'s Width of Space', desc: 'There should be about 1 cm (approx. a thumb\'s width) between your longest toe and the shoe tip for comfort.' },
      { emoji: '🌙', title: 'Shop in the Evening', desc: 'Feet swell slightly throughout the day. Shopping in the evening ensures you pick the right size for extended wear.' },
      { emoji: '🧦', title: 'Wear Your Socks', desc: 'When measuring for winter boots or athletic shoes, measure with the specific socks you\'ll be wearing.' },
    ],
    relatedCategories: [
      { slug: 'shirts', label: 'Topwear', emoji: '👕' },
      { slug: 'jeans', label: 'Jeans & Trousers', emoji: '👖' },
      { slug: 'ethnic', label: 'Ethnic Wear', emoji: '🥻' },
    ],
  },
  jeans: {
    title: 'Jeans & Trousers Size Guide',
    emoji: '👖',
    subtitle: 'Waist, Hip & Inseam — Find Your Bottom Wear Size',
    description: 'Bottom wear sizing is determined by waist and inseam length. Use the charts below to find your perfect fit across denim, chinos, and formal trousers.',
    accentColor: '#6366f1',
    bannerUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=1200&h=320&fit=crop',
    note: 'Denim stretches 0.5–1 inch after wear. For a fitted look, choose your exact measurement; for comfort, size up one.',
    charts: [
      {
        title: "Men's Jeans — Waist Sizes",
        headers: ['Waist (in)', 'Waist (cm)', 'Hip (in)', 'Hip (cm)', 'Regular Inseam (in)', 'Short Inseam (in)', 'Long Inseam (in)'],
        rows: [
          { 'Waist (in)': '28', 'Waist (cm)': '71', 'Hip (in)': '35', 'Hip (cm)': '89',  'Regular Inseam (in)': '30', 'Short Inseam (in)': '28', 'Long Inseam (in)': '32' },
          { 'Waist (in)': '30', 'Waist (cm)': '76', 'Hip (in)': '37', 'Hip (cm)': '94',  'Regular Inseam (in)': '30', 'Short Inseam (in)': '28', 'Long Inseam (in)': '32' },
          { 'Waist (in)': '32', 'Waist (cm)': '81', 'Hip (in)': '39', 'Hip (cm)': '99',  'Regular Inseam (in)': '32', 'Short Inseam (in)': '30', 'Long Inseam (in)': '34' },
          { 'Waist (in)': '34', 'Waist (cm)': '86', 'Hip (in)': '41', 'Hip (cm)': '104', 'Regular Inseam (in)': '32', 'Short Inseam (in)': '30', 'Long Inseam (in)': '34' },
          { 'Waist (in)': '36', 'Waist (cm)': '91', 'Hip (in)': '43', 'Hip (cm)': '109', 'Regular Inseam (in)': '32', 'Short Inseam (in)': '30', 'Long Inseam (in)': '34' },
          { 'Waist (in)': '38', 'Waist (cm)': '96', 'Hip (in)': '45', 'Hip (cm)': '114', 'Regular Inseam (in)': '32', 'Short Inseam (in)': '30', 'Long Inseam (in)': '34' },
          { 'Waist (in)': '40', 'Waist (cm)': '101','Hip (in)': '47', 'Hip (cm)': '119', 'Regular Inseam (in)': '34', 'Short Inseam (in)': '32', 'Long Inseam (in)': '36' },
        ],
      },
    ],
    howToMeasure: [
      { step: '01', title: 'Waist Measurement', instruction: 'Measure around the narrowest part of your torso — usually 2–3 inches above the hips. The tape should be snug but not tight.', tip: 'Jeans waist sizes are typically 2 inches smaller than your actual body waist measurement.' },
      { step: '02', title: 'Hip Measurement', instruction: 'Stand with your feet together. Wrap the tape around the fullest part of your seat / buttocks, keeping the tape horizontal.', tip: 'For skinny or slim-fit jeans, your hip measurement is the most critical fit factor.' },
      { step: '03', title: 'Inseam Length', instruction: 'Measure from the crotch point (where the inner seams meet) down to the bottom of the ankle bone.', tip: 'For cropped styles, subtract 4–6 inches from your standard inseam measurement.' },
    ],
    fitTips: [
      { emoji: '🔵', title: 'Denim Stretch Factor', desc: 'All denim stretches with wear. Choose your body\'s exact waist measurement for the first week, then it settles comfortably.' },
      { emoji: '📏', title: 'Inseam is King', desc: 'Always check the inseam length, not just the waist — a perfect waist with wrong inseam leads to awkward proportions.' },
      { emoji: '🪄', title: 'High-Rise vs Mid-Rise', desc: 'High-rise jeans sit 2–3 inches above the navel and tend to run smaller in the waist — size up if trying high-rise for the first time.' },
    ],
    relatedCategories: [
      { slug: 'shirts', label: 'Topwear', emoji: '👕' },
      { slug: 'shoes', label: 'Footwear', emoji: '👟' },
      { slug: 'ethnic', label: 'Ethnic Wear', emoji: '🥻' },
    ],
  },
  ethnic: {
    title: 'Ethnic Wear Size Guide',
    emoji: '🥻',
    subtitle: 'Sarees, Kurtas, Sherwanis & Salwar Kameez',
    description: 'Ethnic wear sizing differs significantly from western sizing. Use the charts below to find the right fit for kurtas, salwar kameez sets, sherwanis, and sarees.',
    accentColor: '#d97706',
    bannerUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&h=320&fit=crop',
    charts: [
      {
        title: "Kurta / Salwar Kameez Sizing (Women)",
        headers: ['IN Size', 'Brand Size', 'Chest (in)', 'Waist (in)', 'Hip (in)', 'Kurta Length (in)'],
        rows: [
          { 'IN Size': '28', 'Brand Size': 'XS', 'Chest (in)': '30', 'Waist (in)': '24', 'Hip (in)': '33', 'Kurta Length (in)': '50' },
          { 'IN Size': '30', 'Brand Size': 'S',  'Chest (in)': '32', 'Waist (in)': '26', 'Hip (in)': '35', 'Kurta Length (in)': '52' },
          { 'IN Size': '32', 'Brand Size': 'M',  'Chest (in)': '34', 'Waist (in)': '28', 'Hip (in)': '37', 'Kurta Length (in)': '54' },
          { 'IN Size': '34', 'Brand Size': 'L',  'Chest (in)': '36', 'Waist (in)': '30', 'Hip (in)': '39', 'Kurta Length (in)': '56' },
          { 'IN Size': '36', 'Brand Size': 'XL', 'Chest (in)': '38', 'Waist (in)': '32', 'Hip (in)': '41', 'Kurta Length (in)': '58' },
          { 'IN Size': '38', 'Brand Size': 'XXL','Chest (in)': '40', 'Waist (in)': '34', 'Hip (in)': '43', 'Kurta Length (in)': '60' },
          { 'IN Size': '40', 'Brand Size': '3XL','Chest (in)': '42', 'Waist (in)': '36', 'Hip (in)': '45', 'Kurta Length (in)': '62' },
        ],
      },
      {
        title: "Sherwani Sizing (Men)",
        headers: ['Brand Size', 'Chest (in)', 'Shoulder (in)', 'Length (in)', 'Sleeve (in)'],
        rows: [
          { 'Brand Size': '36', 'Chest (in)': '36', 'Shoulder (in)': '16.5', 'Length (in)': '42', 'Sleeve (in)': '24.5' },
          { 'Brand Size': '38', 'Chest (in)': '38', 'Shoulder (in)': '17',   'Length (in)': '43', 'Sleeve (in)': '25' },
          { 'Brand Size': '40', 'Chest (in)': '40', 'Shoulder (in)': '17.5', 'Length (in)': '44', 'Sleeve (in)': '25.5' },
          { 'Brand Size': '42', 'Chest (in)': '42', 'Shoulder (in)': '18',   'Length (in)': '45', 'Sleeve (in)': '26' },
          { 'Brand Size': '44', 'Chest (in)': '44', 'Shoulder (in)': '18.5', 'Length (in)': '46', 'Sleeve (in)': '26.5' },
          { 'Brand Size': '46', 'Chest (in)': '46', 'Shoulder (in)': '19',   'Length (in)': '47', 'Sleeve (in)': '27' },
        ],
      },
    ],
    howToMeasure: [
      { step: '01', title: 'Chest / Bust', instruction: 'Measure across the fullest part of your chest. For kameez, add 1–2 inches to your chest measurement for comfortable movement.', tip: 'Ethnic wear typically has extra ease built in — refer to the brand\'s specific ease guidelines.' },
      { step: '02', title: 'Kurta/Sherwani Length', instruction: 'Measure from the highest point of your shoulder straight down to the desired hem length.', tip: 'Standard knee-length kurtas are 42–46 inches; floor-length anarkalis are 52–56 inches.' },
      { step: '03', title: 'Salwar Measurement', instruction: 'Measure your hip at the widest point. Salwars are typically very generously cut, but check if the waistband is elasticated or drawstring.', tip: 'Churidar-style bottoms should be 6–8 inches longer than your inseam to create the gather at the ankle.' },
    ],
    fitTips: [
      { emoji: '🧵', title: 'Stitched vs Unstitched', desc: 'Unstitched fabric is custom-tailored — always add 10–15% to your measurements for seam allowances.' },
      { emoji: '🪡', title: 'Machine vs Hand Embroidery', desc: 'Heavy embroidered pieces may feel tighter around the shoulders — size up if your piece has dense stonework.' },
      { emoji: '🌸', title: 'Sarees Are One-Size', desc: 'Sarees are universally 5.5–6.5 meters — what varies is the blouse. Measure your blouse size separately using your bust and waist.' },
    ],
    relatedCategories: [
      { slug: 'shirts', label: 'Topwear', emoji: '👕' },
      { slug: 'jeans', label: 'Jeans & Trousers', emoji: '👖' },
      { slug: 'shoes', label: 'Footwear', emoji: '👟' },
    ],
  },
};

interface SizeGuidePageProps { params: Promise<{ category: string }>; }

export default function SizeGuidePage({ params }: SizeGuidePageProps) {
  const { category } = use(params);
  const guide = SIZE_GUIDES[category];
  const [activeChart, setActiveChart] = useState(0);
  const [activeHowTo, setActiveHowTo] = useState<number | null>(null);

  if (!guide) notFound();

  const chart = guide.charts[activeChart];

  return (
    <div className={styles.page}>

      {/* ── Banner ─────────────────────────────────── */}
      <div className={styles.banner} style={{ backgroundImage: `url(${guide.bannerUrl})`, '--accent': guide.accentColor } as React.CSSProperties}>
        <div className={styles.bannerOverlay} />
        <div className={styles.bannerContent}>
          <span className={styles.bannerEmoji}>{guide.emoji}</span>
          <h1 className={styles.bannerTitle}>{guide.title}</h1>
          <p className={styles.bannerSubtitle}>{guide.subtitle}</p>
        </div>
      </div>

      <div className={styles.container}>

        {/* ── Description ────────────────────────────── */}
        <div className={styles.descSection}>
          <p className={styles.description}>{guide.description}</p>
          {guide.note && (
            <div className={styles.noteBox} style={{ borderColor: guide.accentColor }}>
              <FiAlertCircle style={{ color: guide.accentColor }} />
              <p>{guide.note}</p>
            </div>
          )}
        </div>

        {/* ── Chart Tabs ─────────────────────────────── */}
        {guide.charts.length > 1 && (
          <div className={styles.chartTabs}>
            {guide.charts.map((c, i) => (
              <button
                key={i}
                className={`${styles.chartTab} ${activeChart === i ? styles.chartTabActive : ''}`}
                style={activeChart === i ? { background: guide.accentColor, borderColor: guide.accentColor } as React.CSSProperties : {}}
                onClick={() => setActiveChart(i)}
              >
                {c.title}
              </button>
            ))}
          </div>
        )}

        {/* ── Size Table ─────────────────────────────── */}
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>{chart.title}</h2>
            <button className={styles.expandBtn} title="View fullscreen">
              <FiMaximize2 /> Full Table
            </button>
          </div>
          <div className={styles.tableScroll}>
            <table className={styles.sizeTable}>
              <thead>
                <tr>
                  {chart.headers.map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chart.rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    {chart.headers.map(h => (
                      <td key={h}>
                        {h === chart.headers[0]
                          ? <strong style={{ color: guide.accentColor }}>{row[h]}</strong>
                          : row[h]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── How to Measure ─────────────────────────── */}
        <div className={styles.howToSection}>
          <h2 className={styles.howToTitle}>
            <FiInfo style={{ color: guide.accentColor }} /> How to Measure
          </h2>
          <div className={styles.howToGrid}>
            {guide.howToMeasure.map((item, i) => (
              <div
                key={i}
                className={`${styles.howToCard} ${activeHowTo === i ? styles.howToCardOpen : ''}`}
                onClick={() => setActiveHowTo(activeHowTo === i ? null : i)}
              >
                <div className={styles.howToCardHeader}>
                  <span className={styles.howToStep} style={{ background: guide.accentColor }}>{item.step}</span>
                  <h3>{item.title}</h3>
                  <span className={styles.howToToggle}>{activeHowTo === i ? '−' : '+'}</span>
                </div>
                {activeHowTo === i && (
                  <div className={styles.howToCardBody}>
                    <p className={styles.howToInstruction}>{item.instruction}</p>
                    <div className={styles.howToTip}>
                      <strong>💡 Tip:</strong> {item.tip}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Fit Tips ───────────────────────────────── */}
        <div className={styles.fitTipsSection}>
          <h2 className={styles.fitTipsTitle}>Expert Fit Tips</h2>
          <div className={styles.fitTipsGrid}>
            {guide.fitTips.map(tip => (
              <div key={tip.title} className={styles.fitTipCard} style={{ '--accent': guide.accentColor } as React.CSSProperties}>
                <span className={styles.fitTipEmoji}>{tip.emoji}</span>
                <h4>{tip.title}</h4>
                <p>{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Related Size Guides ─────────────────────── */}
        <div className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>Other Size Guides</h2>
          <div className={styles.relatedGrid}>
            {guide.relatedCategories.map(r => (
              <Link key={r.slug} href={`/size-guide/${r.slug}`} className={styles.relatedCard} style={{ '--accent': guide.accentColor } as React.CSSProperties}>
                <span className={styles.relatedEmoji}>{r.emoji}</span>
                <span className={styles.relatedLabel}>{r.label}</span>
                <FiChevronRight className={styles.relatedArrow} />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
