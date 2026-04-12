'use client';
import Link from 'next/link';

export default function DirectoryLaunchCTA() {
  return (
    <div className="relative py-16 bg-[#05070a] border-t border-outline-variant/20 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,240,255,0.03)_0%,transparent_70%)]" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 flex flex-col items-center text-center">
        <h2 className="text-xl font-black uppercase tracking-widest text-white mb-8">
          Accelerate The Scan
        </h2>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row w-full sm:w-auto">
          <Link href="/ecosystem" className="w-full sm:w-auto group relative inline-flex items-center justify-center bg-black border border-outline-variant/30 px-10 py-4 transition-colors duration-300 hover:border-primary/50 shadow-[0_0_0_rgba(0,240,255,0)] hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <div className="relative z-10 font-mono text-xs text-primary font-bold tracking-[0.2em] transition-colors duration-300 flex items-center gap-3">
              BROWSE_FULL_DIRECTORY
            </div>
          </Link>

          <Link href="/submit" className="w-full sm:w-auto inline-flex items-center justify-center border border-transparent bg-primary/10 px-10 py-4 text-xs font-mono font-bold tracking-[0.2em] text-primary transition-colors duration-300 hover:bg-primary hover:text-black">
            SUBMIT_PROJECT
          </Link>
        </div>
      </div>
    </div>
  );
}
