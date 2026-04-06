import {
  BrainCircuit,
  LineChart,
  Gamepad2,
  Network,
  Wallet,
  Users,
  Database,
  Link as LinkIcon,
  Image as ImageIcon,
  Box,
} from 'lucide-react';

/**
 * Returns a Lucide icon element mapped to an ecosystem category slug.
 * Used across the Ecosystem Directory, Category pages, and Territories index.
 */
export function getCategoryIcon(slug: string, color: string, size = 20) {
  const props = { size, color, className: 'drop-shadow-[0_0_8px_currentColor]' };
  switch (slug) {
    case 'ai': return <BrainCircuit {...props} />;
    case 'defi': return <LineChart {...props} />;
    case 'gaming': return <Gamepad2 {...props} />;
    case 'depin': return <Network {...props} />;
    case 'payments': return <Wallet {...props} />;
    case 'consumer': return <Users {...props} />;
    case 'analytics': return <Database {...props} />;
    case 'interoperability': return <LinkIcon {...props} />;
    case 'nfts': return <ImageIcon {...props} />;
    default: return <Box {...props} />;
  }
}
