import ActionLink from './ActionLink';
import { LinkAction } from '../types/domain';

interface HeroProps {
  hero: {
    subtitle: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    primaryCta: LinkAction;
    secondaryCta: LinkAction;
  };
  quickLinks: LinkAction[];
  liveStatusFeed: unknown[];
}

export default function Hero({ hero, quickLinks, liveStatusFeed }: HeroProps) {
  return (
    <section className="col-span-12 lg:col-span-12 mb-12 relative overflow-hidden bg-surface-container-low/30 border border-outline-variant/20 p-8 md:p-12 shadow-[12px_12px_0px_rgba(0,0,0,0.4)]">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
        <div className="flex-1 max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-primary"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary drop-shadow-[0_0_8px_rgba(0,255,163,0.5)]">
              {hero.subtitle}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black leading-[0.9] uppercase tracking-tighter mb-8 font-headline">
            <span className="block text-white">{hero.titleLine1}</span>
            <span className="block text-primary drop-shadow-[0_0_15px_rgba(0,255,163,0.3)]">{hero.titleLine2}</span>
          </h1>
          
          <p className="text-on-surface-variant/80 text-lg leading-relaxed mb-10 border-l-2 border-outline-variant/30 pl-6 max-w-xl">
            {hero.description}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <ActionLink
              action={hero.primaryCta}
              className="px-8 py-4 bg-primary text-on-primary font-black uppercase tracking-widest text-xs hover:bg-white transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]"
            >
              {hero.primaryCta.label}
            </ActionLink>
            
            <ActionLink
              action={hero.secondaryCta}
              className="px-8 py-4 border border-outline-variant/50 bg-surface-container-high/50 text-white font-black uppercase tracking-widest text-xs hover:bg-surface-container-highest transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]"
            >
              {hero.secondaryCta.label}
            </ActionLink>
          </div>
        </div>
        
        <div className="w-full lg:w-80 flex flex-col gap-8">
          <div className="p-6 bg-black/40 border border-outline-variant/20 backdrop-blur-md rounded-sm">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Live_Status_Feed
            </div>
            <div className="space-y-3 font-mono text-[10px]">
              {liveStatusFeed.map((item: any, i) => (
                <div key={i} className="flex justify-between items-center border-b border-outline-variant/10 pb-2 last:border-0 last:pb-0">
                  <span className="text-on-surface-variant/60">[{item.status}]</span>
                  <span className="text-on-surface-variant truncate ml-2">{'//'} {item.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 bg-primary/5 border border-primary/20 backdrop-blur-md rounded-sm">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4">
              Quick_Access_Nodes
            </div>
            <div className="flex flex-col gap-2">
              {quickLinks.map((link, i) => (
                <ActionLink
                  key={i}
                  action={link}
                  className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary flex items-center justify-between group transition-colors"
                >
                  <span>{link.label}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </ActionLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
