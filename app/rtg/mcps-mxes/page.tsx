import { buildMetadata } from '@/lib/seo';
import PublicPageShell from '@/components/PublicPageShell';
import LessonScrollScene from '@/components/lessons/LessonScrollScene';
import Link from 'next/link';

export const metadata = buildMetadata({
  title: 'Understanding MPCs and MXEs — Arcium RTG',
  description:
    'A scroll-driven lesson explaining Multi-Party Computation and Multi-Party Execution Environments in Arcium.',
  path: '/rtg/mcps-mxes',
});

export default function MPCsMXEsLessonPage() {
  return (
    <PublicPageShell backgroundVariant="calm">
      {/* Hero intro — scrolls normally before the pinned scene */}
      <section className="console-window col-span-12 overflow-hidden">
        <div className="console-header">
          <span>LESSON_01 // SYSTEM_TRACE</span>
          <span className="text-primary">INTERACTIVE_MODULE</span>
        </div>
        <div className="p-6 md:p-10 space-y-4">
          <nav className="flex items-center gap-2 text-xs font-bold text-outline">
            <Link
              href="/"
              className="transition-colors hover:text-primary"
            >
              Home
            </Link>
            <span className="text-outline-variant">/</span>
            <Link
              href="/rtg"
              className="transition-colors hover:text-primary"
            >
              RTGs
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="text-primary">MPCs &amp; MXEs</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase font-headline">
            Understanding MPCs and MXEs
          </h1>
          <p className="max-w-3xl text-base leading-8 text-on-surface-variant">
            Scroll through a guided system trace that shows how
            Multi-Party Computation and Multi-Party Execution
            Environments work together to enable confidential compute
            on the Arcium network.
          </p>

          <div className="flex gap-4 pt-2 text-[10px] font-mono font-bold tracking-[0.2em] text-outline">
            <span className="border border-outline-variant/25 bg-surface-container-lowest/70 px-3 py-1.5">
              FORMAT // INTERACTIVE_SCROLL
            </span>
            <span className="border border-outline-variant/25 bg-surface-container-lowest/70 px-3 py-1.5">
              BEATS // 06
            </span>
            <span className="border border-primary/20 bg-primary/5 text-primary px-3 py-1.5">
              SCROLL_TO_EXPLORE
            </span>
          </div>
        </div>
      </section>

      {/* The scroll-driven lesson scene */}
      <div className="col-span-12">
        <LessonScrollScene />
      </div>

      {/* Footer CTA — scrolls in after the scene unpins */}
      <section className="console-window col-span-12 overflow-hidden">
        <div className="console-header">
          <span>END_OF_LESSON</span>
          <span className="text-primary">TRACE_COMPLETE</span>
        </div>
        <div className="p-6 md:p-10 flex flex-col items-center gap-6 text-center">
          <p className="text-on-surface-variant text-base max-w-xl leading-8">
            MPC provides the math. MXE provides the machine. Together
            they form the backbone of Arcium&apos;s Decentralised
            Confidential Compute Network.
          </p>
          <Link
            href="/rtg"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-bold uppercase tracking-widest text-sm hover:bg-primary hover:text-black transition-all"
          >
            ← Return to RTG Module
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
