import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'POS Inventory Billing',
  description: 'A web-based POS inventory and billing system for businesses to manage sales, track inventory, and streamline invoicing efficiently.',
  keywords: 'POS system, POS inventory software, web-based billing system, business management software, sales tracking, inventory management, invoicing solution, PHP MySQL POS, retail management system, small business POS software, e-commerce POS',
  authors: [{ name: 'Your Name' }],
  robots: 'index, follow',
  openGraph: {
    title: 'POS Inventory Billing',
    description: 'A web-based POS inventory and billing system for businesses to manage sales, track inventory, and streamline invoicing efficiently.',
    url: 'https://yourwebsite.com',
    siteName: 'POS Inventory Billing',
    images: [
      {
        url: 'URL_to_your_website_thumbnail',
        width: 1200,
        height: 630,
        alt: 'POS Inventory Billing System',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
} 