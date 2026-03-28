import ActionLink from './ActionLink';
import { FooterConfig } from '../types/domain';

export default function Footer({ config }: { config: FooterConfig }) {
  return (
    <footer className="console-window col-span-12 flex flex-col items-center py-10 relative">
      <div className="console-header w-full absolute top-0">
        <span>TERMINAL_EXIT</span>
        <span>STATUS_STABLE</span>
      </div>

      <div className="text-2xl font-black text-primary mb-6 mt-4 tracking-tighter uppercase font-headline">
        ARCIUM ATLAS // THE_CENTRAL_MAINFRAME
      </div>

      <div className="flex flex-wrap justify-center gap-8 text-[10px] uppercase font-bold text-slate-500 mb-8 tracking-widest">
        {config.links.map((link, idx) => (
          <ActionLink
            key={idx}
            action={link}
            className="hover:text-primary transition-colors"
            unavailableClassName="cursor-not-allowed opacity-50"
          >
            {link.label}
          </ActionLink>
        ))}
      </div>

      <div className="text-[9px] text-center text-outline/40 uppercase leading-loose font-mono">
        {config.metadata.copyright} <br />
        {config.metadata.coords} <br />
        <span className="text-primary/40">{config.metadata.mission}</span>
      </div>
    </footer>
  );
}
