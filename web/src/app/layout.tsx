import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { CartProvider } from '@/context/CartContext';
import { AuraCoinProvider } from '@/context/AuraCoinContext';
import Shell from '@/components/layout/Shell';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuraAI from '@/components/AuraAI';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'AuraMart - Premium Multi-Platform E-Commerce & Fast Delivery',
  description: 'Shop premium electronics, fashion, beauty, home decor, and get 10-minute grocery delivery via Flado Quick Commerce.',
  keywords: 'AuraMart, Flado, Quick Commerce, E-commerce India, Electronics, Fashion, Grocery Delivery',
  authors: [{ name: 'AuraMart Engineering' }],
  manifest: '/manifest.json',
  openGraph: {
    title: 'AuraMart - Premium Commerce OS & Fast Delivery',
    description: 'Shop electronics, fashion, beauty, and 10-minute grocery delivery.',
    url: 'https://auramart.in',
    siteName: 'AuraMart',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AuraMart Commerce OS',
    description: 'Premium shopping & 10-minute instant delivery.',
  },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AuraMart',
  url: 'https://auramart.in',
  logo: 'https://auramart.in/favicon.ico',
  sameAs: ['https://twitter.com/auramart', 'https://facebook.com/auramart'],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const surface = pathname.startsWith('/flado') ? 'QUICK_COMMERCE' : 'MARKETPLACE';

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <CartProvider>
          <AuraCoinProvider>
            <Header surface={surface} />
            <Shell surface={surface}>
              {children}
            </Shell>
            <Footer surface={surface} />
            <MobileBottomNav surface={surface} />
            <AuraAI />
          </AuraCoinProvider>
        </CartProvider>
      </body>
    </html>
  );
}
