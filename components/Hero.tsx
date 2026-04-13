import Link from 'next/link';
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
  sectorCount: number;
  projectCount: number;
  lastUpdated: string;
}

export default function Hero({ hero, sectorCount, projectCount, lastUpdated }: HeroProps) {
  return (
    <section aria-labelledby="hero-heading" className="relative py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-6">
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-primary">
            {hero.subtitle}
          </span>
        </div>

        <h1 id="hero-heading" className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] uppercase tracking-tighter mb-8 font-headline">
          <span className="block text-white">{hero.titleLine1}</span>
          <span className="block text-primary">{hero.titleLine2}</span>
        </h1>

        <p className="text-white/85 text-lg leading-relaxed mb-10 max-w-2xl font-sans">
          {hero.description}
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 w-full sm:w-auto">
          <ActionLink
            action={hero.primaryCta}
            className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary font-black uppercase tracking-widest text-xs hover:bg-white hover:shadow-[0_0_15px_rgba(0,255,163,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-[4px_4px_0px_rgba(0,0,0,0.3)] text-center"
          >
            {hero.primaryCta.label}
          </ActionLink>

          <ActionLink
            action={hero.secondaryCta}
            className="w-full sm:w-auto px-8 py-4 border border-primary/50 bg-surface-container-high/50 text-white font-black uppercase tracking-widest text-xs hover:bg-primary/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-[4px_4px_0px_rgba(0,0,0,0.3)] text-center"
          >
            {hero.secondaryCta.label}
          </ActionLink>
        </div>

        {/* Quick links — merged from StartHereSection */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[10px] font-mono uppercase tracking-[0.18em]">
          <Link href="/ecosystem/categories" className="text-on-surface-variant/75 transition-colors hover:text-primary">
            ◆ Browse Sectors
          </Link>
          <Link href="/submit" className="text-on-surface-variant/75 transition-colors hover:text-primary">
            ◆ Submit a Project
          </Link>
          <a href="https://docs.arcium.com" target="_blank" rel="noreferrer noopener" className="text-on-surface-variant/75 transition-colors hover:text-primary">
            ◆ Arcium Docs
          </a>
        </div>

        {/* Proof strip */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 border-t border-outline-variant/10 pt-6">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-on-surface-variant/75">
            <span className="inline-block h-1.5 w-1.5 bg-primary" />
            {sectorCount} Sectors
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-on-surface-variant/75">
            <span className="inline-block h-1.5 w-1.5 bg-primary" />
            {projectCount} Projects
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-on-surface-variant/75">
            <span className="inline-block h-1.5 w-1.5 bg-primary" />
            Updated {lastUpdated}
          </div>
        </div>
      </div>
    </section>
  );
}
