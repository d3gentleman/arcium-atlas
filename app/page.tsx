import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import NavBar from '@/components/NavBar';
import RecentlyUpdated from '@/components/RecentlyUpdated';
import StartHereSection from '@/components/StartHereSection';
import KnowledgeRecordCard from '@/components/KnowledgeRecordCard';
import {
  getFooterConfig,
  getHomepageConfig,
  getNavigation,
  getRecentArticles,
  getUIConfig,
  getKnowledgeCategories,
  getKnowledgeCategoryPath,
} from '@/lib/content';

export default async function Home() {
  const [
    navLinks,
    homepage,
    recentArticles,
    footerConfig,
    ui,
    categories
  ] = await Promise.all([
    getNavigation(),
    getHomepageConfig(),
    getRecentArticles(),
    getFooterConfig(),
    getUIConfig(),
    getKnowledgeCategories()
  ]);

  // Filter for knowledge areas to show on homepage
  const knowledgeCategories = categories.filter(c => c.group !== 'ecosystem').slice(0, 4);

  return (
    <>
      <NavBar links={navLinks} />
      
      <main className="col-span-12 space-y-12">
        <Hero
          hero={homepage.hero}
          quickLinks={homepage.quickLinks}
          liveStatusFeed={homepage.liveStatusFeed}
        />
        
        <StartHereSection cards={homepage.startHereCards} />
        
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
