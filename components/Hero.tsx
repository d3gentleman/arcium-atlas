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
}

export default function Hero({ hero }: HeroProps) {
  return (
    <section className="col-span-12 lg:col-span-12 mb-12 relative overflow-hidden bg-surface-container-low/30 border border-outline-variant/20 p-8 md:p-12 lg:p-20 shadow-[12px_12px_0px_rgba(0,0,0,0.4)]">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[2px] w-12 bg-primary"></div>
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary drop-shadow-[0_0_8px_rgba(0,255,163,0.5)]">
            {hero.subtitle}
          </span>
          <div className="h-[2px] w-12 bg-primary"></div>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] uppercase tracking-tighter mb-8 font-headline">
          <span className="block text-white">{hero.titleLine1}</span>
          <span className="block text-primary drop-shadow-[0_0_15px_rgba(0,255,163,0.3)]">{hero.titleLine2}</span>
        </h1>
        
        <p className="text-white/90 drop-shadow-md text-lg leading-relaxed mb-10 max-w-2xl">
          {hero.description}
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <ActionLink
            action={hero.primaryCta}
            className="px-8 py-4 bg-primary text-on-primary font-black uppercase tracking-widest text-xs hover:bg-white hover:shadow-[0_0_15px_rgba(0,255,163,0.5)] transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]"
          >
            {hero.primaryCta.label}
          </ActionLink>
          
          <ActionLink
            action={hero.secondaryCta}
            className="px-8 py-4 border border-primary/50 bg-surface-container-high/50 text-white font-black uppercase tracking-widest text-xs hover:bg-primary/10 transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]"
          >
            {hero.secondaryCta.label}
          </ActionLink>
        </div>
      </div>
    </section>
  );
}
