import type { ReactNode } from 'react';
import Footer from './Footer';
import NavBar from './NavBar';
import { getFooterConfig, getNavigation } from '@/lib/content';

interface PublicPageShellProps {
  children: ReactNode;
  backgroundVariant?: 'default' | 'calm';
  mainClassName?: string;
}

export default async function PublicPageShell({
  children,
  backgroundVariant = 'default',
  mainClassName = '',
}: PublicPageShellProps) {
  const [navLinks, footerConfig] = await Promise.all([
    getNavigation(),
    getFooterConfig(),
  ]);

  return (
    <div
      className={`atlas-public-shell atlas-public-shell--${backgroundVariant} col-span-12 flex min-h-screen flex-col text-on-surface`}
    >
      <NavBar links={navLinks} />
      <main className={`flex-1 px-4 py-8 md:px-8 md:py-10 ${mainClassName}`.trim()}>{children}</main>
      <Footer config={footerConfig} />
    </div>
  );
}
