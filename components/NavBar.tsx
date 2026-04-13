import Link from 'next/link';
import ActionLink from './ActionLink';
import NavBarSearchButton from './NavBarSearchButton';
import { LinkAction } from '../types/domain';

export default function NavBar({ links }: { links: LinkAction[] }) {
  return (
    <header className="console-window col-span-12 flex flex-col">
      <div className="console-header">
        <span>SYSTEM_ROOT/NAV_MODULE</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-outline-variant"></div>
          <div className="w-2 h-2 bg-primary"></div>
        </div>
      </div>
      <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
        <Link 
          href="/" 
          className="group text-xl font-black tracking-tighter text-primary uppercase font-headline hover:text-white transition-colors duration-300"
        >
          <span className="opacity-50 group-hover:opacity-100 transition-opacity">&lt;</span>
          ARCIUM_ATLAS
          <span className="opacity-50 group-hover:opacity-100 transition-opacity">&gt;</span>
        </Link>
        <nav className="flex flex-wrap justify-center px-4 gap-x-6 gap-y-3 text-[10px] md:text-xs uppercase font-bold tracking-widest max-w-full">
          {links.map((link, idx) => (
            <ActionLink
              key={idx}
              action={link}
              className="text-slate-400 hover:text-white transition-colors"
              unavailableClassName="text-slate-600 cursor-not-allowed"
            >
              /{link.label}
            </ActionLink>
          ))}
        </nav>
        <div className="flex gap-4 font-mono text-[10px] items-center">
          <span className="hidden md:inline bg-primary/10 text-primary px-2 py-1.5 border border-primary/20 rounded-sm">CURATED_GUIDE</span>
          <NavBarSearchButton />
        </div>
      </div>
    </header>
  );
}
