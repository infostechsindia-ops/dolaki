import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import { AuraCoinProvider } from '@/context/AuraCoinContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuraAI from '@/components/AuraAI';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AuraMart - Premium Multi-Platform E-Commerce & Fast Delivery',
  description: 'Shop premium electronics, fashion, beauty, home decor, and get 10-minute grocery delivery via Flado Quick Commerce.',
  keywords: 'AuraMart, Flado, Quick Commerce, E-commerce India, Electronics, Fashion, Grocery Delivery',
  authors: [{ name: 'AuraMart Engineering' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <CartProvider>
          <AuraCoinProvider>
            <Header />
            <main style={{ flex: '1 0 auto' }}>
              {children}
            </main>
            <Footer />
            <AuraAI />
          </AuraCoinProvider>
        </CartProvider>
      </body>
    </html>
  );
}
