'use client';

import { useDiscovery } from './DiscoveryShell';
import { Search } from 'lucide-react';

export default function NavBarSearchButton() {
  const { toggleDiscovery } = useDiscovery();

  return (
    <button
      onClick={(e) => toggleDiscovery(e.currentTarget)}
      className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 transition-colors duration-300 rounded-sm border border-primary/20"
      aria-label="Open global search menu"
    >
      <Search size={14} />
      <span className="hidden sm:inline font-mono text-[10px] tracking-widest uppercase">Search_Atlas</span>
      <span className="hidden md:inline font-mono text-[9px] opacity-70 ml-2 border-l border-primary/30 pl-2">CTRL+K</span>
    </button>
  );
}
