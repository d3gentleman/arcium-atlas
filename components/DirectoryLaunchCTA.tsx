import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function DirectoryLaunchCTA() {
  return (
    <section aria-label="Take action" className="border-t border-outline-variant/10 py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Explorer panel — secondary emphasis */}
          <div className="order-2 md:order-1 border border-outline-variant/10 p-8 lg:p-10">
            <div className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-on-surface-variant/60">
              For Explorers
            </div>
            <p className="text-sm font-sans text-on-surface-variant/75 leading-relaxed mt-3">
              Continue browsing the full project directory.
            </p>
            <Link
              href="/ecosystem"
              className="group mt-6 inline-flex items-center gap-2 border border-outline-variant/25 bg-transparent px-6 py-3.5 text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-outline transition-colors duration-200 hover:border-primary/40 hover:bg-white/[0.03] hover:text-white"
            >
              Browse Directory
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Builder panel — primary emphasis */}
          <div className="order-1 md:order-2 border border-primary/20 bg-primary/[0.04] p-8 lg:p-10 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_24px_rgba(0,240,255,0.06)]">
            <div className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-primary">
              For Builders
            </div>
            <p className="text-sm font-sans text-white/80 leading-relaxed mt-3">
              Add your project to the Atlas and reach the Arcium community.
            </p>
            <Link
              href="/submit"
              className="group mt-6 inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.18em] hover:bg-white hover:shadow-[0_0_15px_rgba(0,255,163,0.4)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]"
            >
              Submit Your Project
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
