import Link from 'next/link';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import { buildMetadata } from '@/lib/seo';
import ActionLink from '@/components/ActionLink';
import { LinkAction } from '@/types/domain';

export const metadata = buildMetadata({
  title: 'RTGs - Arcium Guides',
  description: 'Unique lessons and articles explaining the core mechanics and value of Arcium.',
  path: '/rtg',
});

const lessons = [
  {
    title: 'Understanding MPCs and MXEs',
    summary: 'A scroll-driven system trace showing how Multi-Party Computation and Execution Environments power confidential compute on Arcium.',
    tag: 'INTERACTIVE',
    href: '/rtg/mcps-mxes',
    id: 'mpc-mxe-interactive'
  },
  {
    title: 'Understanding MPCs and MXEs (Reference)',
    summary: 'A static reference briefing on MPC and MXE fundamentals within Arcium.',
    tag: 'FUNDAMENTALS',
    href: '/rtg/understanding-mpcs-and-mxes',
    id: 'mpc-mxe-reference'
  }
];

export default function RTGPage() {
  return (
    <KnowledgePageFrame
      eyebrow="SYSTEM_GUIDE // RTGS"
      title="Real-Time Guides"
      summary="A collection of unique articles and lessons designed to help you understand the Arcium network architecture, its core primitives, and why confidential compute matters."
      statusLabel="KNOWLEDGE_BASE_ACTIVE"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'RTGs', href: '/rtg' },
      ]}
      meta={
        <>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            TYPE // EDUCATIONAL_MODULE
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            VERSION // 1.0.0
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            SUBJECT // ARCIUM_INTERNALS
          </div>
        </>
      }
      backgroundVariant="calm"
    >
      <div className="grid gap-6 p-6 md:p-0">
        <section className="console-window overflow-hidden">
          <div className="console-header">
            <span>MODULE_01: AVAILABLE_LESSONS</span>
            <span className="text-primary">START_LEARNING</span>
          </div>
          <div className="grid gap-4 p-6 lg:grid-cols-2">
            {lessons.map((lesson) => (
              <article key={lesson.id} className="group relative flex flex-col justify-between rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-6 transition-all hover:border-primary/40 hover:bg-surface-container-high/50">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-2 py-0.5 border border-primary/20 rounded-sm">
                      {lesson.tag}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-white group-hover:text-primary transition-colors">
                    {lesson.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-on-surface-variant">
                    {lesson.summary}
                  </p>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <ActionLink 
                    action={{ type: 'internal', href: lesson.href, label: 'Read Lesson' } as LinkAction}
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-white"
                  >
                    READ_LESSON.EXE
                    <span aria-hidden="true">→</span>
                  </ActionLink>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </KnowledgePageFrame>
  );
}
