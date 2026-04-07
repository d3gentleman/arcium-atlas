import Link from 'next/link';
import ActionLink from '@/components/ActionLink';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import { buildMetadata } from '@/lib/seo';
import { LinkAction } from '@/types/domain';

export const metadata = buildMetadata({
  title: 'About',
  description: 'What Arcium Atlas is, who it is for, and how to use it to understand Arcium more quickly.',
  path: '/about',
});

const audienceCards = [
  {
    title: 'New to Arcium',
    description: 'Start with the territory briefs to understand where confidential compute is most relevant before diving into builder records.',
    action: {
      type: 'internal',
      href: '/ecosystem/categories',
      label: 'Browse territories',
    } as LinkAction,
    label: 'Browse territories',
  },
  {
    title: 'Evaluating the ecosystem',
    description: 'Use the ecosystem directory to review the current public builder records, featured projects, and coverage gaps.',
    action: {
      type: 'internal',
      href: '/ecosystem',
      label: 'Browse builder records',
    } as LinkAction,
    label: 'Browse builder records',
  },
  {
    title: 'Looking for source material',
    description: 'Use Atlas for orientation, then jump to the official Arcium docs when you need protocol-level detail and the latest references.',
    action: {
      type: 'external',
      href: 'https://docs.arcium.com',
      label: 'Open official docs',
    } as LinkAction,
    label: 'Open official docs',
  },
];

export default function AboutPage() {
  return (
    <KnowledgePageFrame
      eyebrow="ABOUT_ATLAS"
      title="What Arcium Atlas is for"
      summary="Arcium Atlas is a curated ecosystem directory and territory guide for people trying to understand where Arcium fits without piecing the story together from scattered announcements and jargon."
      statusLabel="REFERENCE_MISSION_ACTIVE"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
      ]}
      meta={
        <>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            FORMAT // CURATED GUIDE
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            AUDIENCE // MIXED
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            SOURCES // OFFICIAL DOCS + ECOSYSTEM RECORDS
          </div>
        </>
      }
      backgroundVariant="calm"
    >
      <section className="console-window col-span-12 overflow-hidden">
        <div className="console-header">
          <span>MODULE_17: ABOUT_ATLAS</span>
          <span className="text-primary">WHY_THIS_EXISTS</span>
        </div>
        <div className="grid gap-6 p-6 lg:grid-cols-3">
          <article className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-6 lg:col-span-2">
            <h2 className="text-2xl font-black tracking-tight text-white">The 30-second explanation</h2>
            <p className="mt-4 text-base leading-8 text-on-surface-variant">
              Arcium Atlas explains where confidential compute may matter in the Arcium ecosystem, which public builder records are currently mapped, and how those records are organized by territory. It is designed to help readers move from slogans to a usable model of the landscape.
            </p>
            <h3 className="mt-8 text-xl font-black tracking-tight text-white">Why it matters</h3>
            <p className="mt-4 text-base leading-8 text-on-surface-variant">
              Privacy infrastructure can be hard to evaluate because the language is technical and the public ecosystem picture is fragmented. Atlas closes part of that gap by pairing territory briefings, builder records, and outbound links to official sources in one place.
            </p>
            <h3 className="mt-8 text-xl font-black tracking-tight text-white">How to use it</h3>
            <p className="mt-4 text-base leading-8 text-on-surface-variant">
              Start with the territory pages to understand the verticals, move into the ecosystem directory for the current builder map, and use the official docs whenever you need deeper protocol detail than Atlas currently covers.
            </p>
          </article>

          <aside className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-6">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Quick paths</div>
            <div className="mt-4 space-y-3">
              <Link href="/ecosystem/categories" className="block rounded-[1rem] border border-outline-variant/25 px-4 py-3 text-sm font-bold text-outline transition-colors hover:bg-surface-container hover:text-white">
                Browse territory briefs
              </Link>
              <Link href="/ecosystem" className="block rounded-[1rem] border border-outline-variant/25 px-4 py-3 text-sm font-bold text-outline transition-colors hover:bg-surface-container hover:text-white">
                Browse builder records
              </Link>
              <a href="https://docs.arcium.com" target="_blank" rel="noreferrer noopener" className="block rounded-[1rem] border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/20 hover:text-white">
                Open official docs
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="console-window col-span-12 overflow-hidden">
        <div className="console-header">
          <span>MODULE_18: WHO_IT_SERVES</span>
          <span className="text-primary">ONBOARDING_READY</span>
        </div>
        <div className="grid gap-4 p-6 lg:grid-cols-3">
          {audienceCards.map((card) => (
            <article key={card.title} className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-6">
              <h2 className="text-2xl font-black tracking-tight text-white">{card.title}</h2>
              <p className="mt-4 text-sm leading-7 text-on-surface-variant">{card.description}</p>
              <ActionLink action={card.action} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-white">
                {card.label}
                <span aria-hidden="true">→</span>
              </ActionLink>
            </article>
          ))}
        </div>
      </section>
    </KnowledgePageFrame>
  );
}
