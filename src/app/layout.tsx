import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Angry Birds',
  description: 'Launch birds, smash pigs! A full-featured Angry Birds clone built with Next.js and TypeScript.',
  keywords: ['angry birds', 'game', 'physics', 'nextjs', 'typescript'],
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="overflow-hidden antialiased">{children}</body>
    </html>
  );
}
