'use client';

import { usePathname } from 'next/navigation';
import DiscoveryShell from '@/components/DiscoveryShell';
import { DiscoveryItem, UIConfig } from '@/types/domain';

interface ShellSwitcherProps {
  children: React.ReactNode;
  discoveryItems: DiscoveryItem[];
  ui: UIConfig;
}

/**
 * ShellSwitcher conditionally renders the DiscoveryShell based on the current path.
 * This prevents the global atlas UI (grid, scanlines, discovery) from interfering
 * with the Keystatic Admin dashboard and login pages.
 */
export default function ShellSwitcher({ children, discoveryItems, ui }: ShellSwitcherProps) {
  const pathname = usePathname();
  
  // Define paths that should NOT have the global DiscoveryShell
  const isAdminPath = 
    pathname.startsWith('/keystatic') || 
    pathname.startsWith('/login') || 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/admin');
  
  const isReadingPath = pathname.startsWith('/about');


  return (
    <DiscoveryShell items={discoveryItems} ui={ui} headless={isAdminPath}>
      {!isReadingPath && !isAdminPath ? (
        <div className="fixed inset-0 scanline-effect z-[100] pointer-events-none opacity-40 backdrop-blur-[0.5px]"></div>
      ) : null}
      <div className={isAdminPath ? "" : "max-w-[1400px] mx-auto grid grid-cols-12 gap-4 relative z-10 w-full h-full"}>
        {children}
      </div>
    </DiscoveryShell>
  );
}
