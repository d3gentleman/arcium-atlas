import ActionLink from './ActionLink';
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
      <div className="p-4 flex flex-wrap justify-between items-center gap-6">
        <div className="text-xl font-black tracking-tighter text-primary uppercase font-headline">
          [ARCIUM_ATLAS.V3]
        </div>
        <nav className="flex flex-wrap gap-6 text-xs uppercase font-bold tracking-widest">
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
        <div className="hidden md:flex gap-4 font-mono text-[10px] text-primary">
          <span className="bg-primary/10 px-2 py-1">SYS_SYNC: OK</span>
          <span className="bg-primary/10 px-2 py-1">COORD: 37.77N_122.41W</span>
        </div>
      </div>
    </header>
  );
}
