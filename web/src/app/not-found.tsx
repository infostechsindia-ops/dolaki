'use client';

import React from 'react';
import Link from 'next/link';
import { FiHome, FiShoppingBag, FiInfo } from 'react-icons/fi';

export default function NotFound() {
  const popularCategories = [
    { name: '🍎 Fruits & Veg', link: '/flado/categories/fruits-vegetables' },
    { name: '🥛 Dairy & Bread', link: '/flado/categories/dairy-bread' },
    { name: '⚡ Electronics', link: '/categories/electronics' },
    { name: '👕 Fashion Styles', link: '/categories/fashion' }
  ];

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={graphicStyle}>
          <span style={emojiStyle}>🛒</span>
          <div style={badge404Style}>404</div>
        </div>
        
        <h1 style={titleStyle}>Oops! Page Not Found</h1>
        <p style={subtitleStyle}>
          Looks like the shopping aisle or campaign page you are looking for has wandered off. Let's get you back to checkout!
        </p>

        <div style={buttonGroupStyle}>
          <Link href="/" style={homeBtnStyle}>
            <FiHome style={{ marginRight: '6px' }} /> Return Home
          </Link>
          <Link href="/deals" style={dealsBtnStyle}>
            <FiShoppingBag style={{ marginRight: '6px' }} /> Grab Active Deals
          </Link>
        </div>

        <div style={categoriesSecStyle}>
          <h4 style={secTitleStyle}>Popular Aisles to Explore</h4>
          <div style={gridStyle}>
            {popularCategories.map((cat, i) => (
              <Link key={i} href={cat.link} style={gridItemStyle}>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline styles for high-fidelity rendering without external files or css config conflicts
const containerStyle: React.CSSProperties = {
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#F8FAFC',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '20px'
};

const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  border: '1.5px solid #E2E8F0',
  borderRadius: '24px',
  padding: '45px 35px',
  maxWidth: '520px',
  width: '100%',
  textAlign: 'center',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
};

const graphicStyle: React.CSSProperties = {
  position: 'relative',
  width: '120px',
  height: '120px',
  margin: '0 auto 24px auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const emojiStyle: React.CSSProperties = {
  fontSize: '4.5rem'
};

const badge404Style: React.CSSProperties = {
  position: 'absolute',
  bottom: '-5px',
  right: '0',
  backgroundColor: '#EF4444',
  color: 'white',
  fontWeight: '800',
  fontSize: '0.8rem',
  padding: '4px 10px',
  borderRadius: '20px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const titleStyle: React.CSSProperties = {
  fontSize: '1.75rem',
  fontWeight: '900',
  color: '#0F172A',
  margin: '0 0 10px 0'
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '0.92rem',
  color: '#475569',
  lineHeight: '1.6',
  margin: '0 0 30px 0'
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
  marginBottom: '35px'
};

const homeBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '12px 20px',
  backgroundColor: '#0F172A',
  color: 'white',
  borderRadius: '12px',
  fontSize: '0.88rem',
  fontWeight: '750',
  textDecoration: 'none'
};

const dealsBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '12px 20px',
  backgroundColor: 'white',
  color: '#0F172A',
  border: '1.5px solid #CBD5E1',
  borderRadius: '12px',
  fontSize: '0.88rem',
  fontWeight: '750',
  textDecoration: 'none'
};

const categoriesSecStyle: React.CSSProperties = {
  borderTop: '1px solid #E2E8F0',
  paddingTop: '25px',
  textAlign: 'left'
};

const secTitleStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: '800',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748B',
  margin: '0 0 14px 0'
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '10px'
};

const gridItemStyle: React.CSSProperties = {
  display: 'block',
  padding: '12px 14px',
  backgroundColor: '#F1F5F9',
  borderRadius: '10px',
  color: '#334155',
  fontSize: '0.85rem',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center'
};
