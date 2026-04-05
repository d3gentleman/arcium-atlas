import Link from 'next/link';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'About',
  description: 'What Arcium Atlas is, who it is for, and how to use it to understand Arcium more quickly.',
  path: '/about',
});

const audienceCards = [
  {
    title: 'New to Arcium',
    description: 'Start with the core guides and glossary to build a working mental model before diving into category pages.',
    href: '/encyclopedia',
    label: 'Start with guides',
  },
  {
    title: 'Evaluating the ecosystem',
    description: 'Use the ecosystem directory to see where Arcium is already showing up across product territories.',
    href: '/ecosystem',
    label: 'Browse builders',
  },
  {
    title: 'Looking for terms and references',
    description: 'Use the glossary and encyclopedia together when you need faster answers and stronger context.',
    href: '/glossary',
    label: 'Open glossary',
  },
];

export default function AboutPage() {
  return (
    <KnowledgePageFrame
      eyebrow="ABOUT_ATLAS"
      title="What Arcium Atlas is for"
      summary="Arcium Atlas is a curated reference layer for people trying to understand Arcium without piecing the story together from scattered announcements, jargon, and ecosystem fragments."
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
              Arcium Atlas explains what Arcium is, why confidential compute matters, and where the ecosystem is already becoming concrete. It is designed to help readers move from slogans to a usable model of the network.
            </p>
            <h3 className="mt-8 text-xl font-black tracking-tight text-white">Why it matters</h3>
            <p className="mt-4 text-base leading-8 text-on-surface-variant">
              Privacy infrastructure can be hard to evaluate because the language is technical and the product implications are easy to lose. Atlas closes that gap by pairing conceptual guides, glossary entries, and builder examples in one place.
            </p>
            <h3 className="mt-8 text-xl font-black tracking-tight text-white">How to use it</h3>
            <p className="mt-4 text-base leading-8 text-on-surface-variant">
              Start with the high-level guides, use the glossary whenever the vocabulary gets dense, and then move into ecosystem or category pages when you want to see how those ideas map to real products and technical surfaces.
            </p>
          </article>

          <aside className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Quick paths</div>
            <div className="mt-4 space-y-3">
              <Link href="/encyclopedia" className="block rounded-[1rem] border border-outline-variant/25 px-4 py-3 text-sm font-bold text-outline transition-colors hover:bg-surface-container hover:text-white">
                Start with the encyclopedia
              </Link>
              <Link href="/ecosystem" className="block rounded-[1rem] border border-outline-variant/25 px-4 py-3 text-sm font-bold text-outline transition-colors hover:bg-surface-container hover:text-white">
                Browse the ecosystem
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
              <Link href={card.href} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-white">
                {card.label}
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </KnowledgePageFrame>
  );
}
