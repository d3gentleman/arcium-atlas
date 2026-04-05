import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import NavBar from '@/components/NavBar';
import RecentlyUpdated from '@/components/RecentlyUpdated';
import StartHereSection from '@/components/StartHereSection';
import KnowledgeRecordCard from '@/components/KnowledgeRecordCard';
import {
  getEcosystemProjects,
  getFeaturedProjects,
  getFooterConfig,
  getGlossaryTerms,
  getHomepageConfig,
  getNavigation,
  getRecentArticles,
  getKnowledgeCategories,
  getKnowledgeCategoryPath,
  getKnowledgeArticles,
} from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import ProjectCard from '@/components/ProjectCard';

export const metadata = buildMetadata({
  path: '/',
});

export default async function Home() {
  const [
    navLinks,
    homepage,
    recentArticles,
    footerConfig,
    categories,
    allArticles,
    glossaryTerms,
    allProjects,
    featuredProjects,
  ] = await Promise.all([
    getNavigation(),
    getHomepageConfig(),
    getRecentArticles(),
    getFooterConfig(),
    getKnowledgeCategories(),
    getKnowledgeArticles(),
    getGlossaryTerms(),
    getEcosystemProjects(),
    getFeaturedProjects(3),
  ]);

  // Filter for knowledge areas to show on homepage
  const knowledgeCategories = categories.slice(0, 4);
  const credibilitySignals = [
    { label: 'Knowledge Areas', value: `${categories.length}` },
    { label: 'Guides & Updates', value: `${allArticles.length}` },
    { label: 'Glossary Terms', value: `${glossaryTerms.length}` },
    { label: 'Builders Listed', value: `${allProjects.length}` },
  ];
  const liveStatusFeed = [
    { status: 'GUIDES', text: `${allArticles.length} curated guides and updates live in the atlas` },
    { status: 'TERMS', text: `${glossaryTerms.length} glossary entries linked to deeper reading paths` },
    { status: 'BUILDERS', text: `${allProjects.length} ecosystem listings mapped to product territories` },
  ];

  return (
    <>
      <NavBar links={navLinks} />
      
      <main className="col-span-12 space-y-12">
        <Hero
          hero={homepage.hero}
          quickLinks={homepage.quickLinks}
          liveStatusFeed={liveStatusFeed}
        />

        <section className="console-window col-span-12">
          <div className="console-header">
            <span>MODULE_01A: CREDIBILITY_SIGNALS</span>
            <span className="text-primary">CURATED_REFERENCE_LAYER</span>
          </div>
          <div className="grid gap-4 p-4 md:grid-cols-4">
            {credibilitySignals.map((signal) => (
              <div key={signal.label} className="rounded-[1.1rem] border border-outline-variant/20 bg-surface-container-lowest/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-outline">
                  {signal.label}
                </div>
                <div className="mt-3 text-3xl font-black tracking-tight text-white">
                  {signal.value}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <StartHereSection cards={homepage.startHereCards} />

        {featuredProjects.length > 0 && (
          <section className="console-window col-span-12">
            <div className="console-header">
              <span>MODULE_02A: FEATURED_BUILDERS</span>
              <span className="text-primary">ECOSYSTEM_IN_USE</span>
            </div>
            <div className="grid gap-6 p-6 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <RecentlyUpdated articles={recentArticles} />
            
            <section className="console-window">
              <div className="console-header">
                <span>MODULE_03: KNOWLEDGE_AREAS</span>
                <span>TOTAL: {categories.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                {knowledgeCategories.map((category) => (
                  <KnowledgeRecordCard
                    key={category.id}
                    action={{
                      type: 'internal',
                      href: getKnowledgeCategoryPath(category.slug),
                      label: 'Open Area',
                    }}
                    tag={category.tag}
                    title={category.title}
                    summary={category.summary}
                    eyebrow={category.prefix}
                    meta="Category"
                  />
                ))}
              </div>
            </section>
        </div>
      </main>

      <Footer config={footerConfig} />
    </>
  );
}
