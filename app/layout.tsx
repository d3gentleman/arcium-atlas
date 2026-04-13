import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono, Inter } from 'next/font/google';
import ShellSwitcher from './ShellSwitcher';
import { getDiscoveryIndex, getUIConfig } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { getSiteUrl } from '@/lib/site';
import './globals.css';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono'
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  ...buildMetadata(),
};

import { Providers } from './providers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const discoveryItems = await getDiscoveryIndex();
  const ui = await getUIConfig();

  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} selection:bg-primary/30 selection:text-primary min-h-screen antialiased bg-black text-white font-body`}>
        <Providers>
          <ShellSwitcher discoveryItems={discoveryItems} ui={ui}>
            {children}
          </ShellSwitcher>
        </Providers>
      </body>
    </html>
  );
}
