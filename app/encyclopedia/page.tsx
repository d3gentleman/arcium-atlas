import type { Metadata } from 'next';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import KnowledgeRecordCard from '@/components/KnowledgeRecordCard';
import { 
    getKnowledgeArticles, 
    getKnowledgeCategories,
    getKnowledgeArticlePath,
    getKnowledgeCategoryPath
} from '@/lib/content';

export const metadata: Metadata = {
  title: 'Encyclopedia | ARCIUM ATLAS',
  description: 'Browse category pages, guides, and recent articles for the Arcium Atlas knowledge base.',
};

export default async function EncyclopediaPage() {
  const [categories, articles] = await Promise.all([
    getKnowledgeCategories(),
    getKnowledgeArticles()
  ]);

  const knowledgeCategories = categories.filter((category) => category.group === 'knowledge');
  const ecosystemTerritories = categories.filter((category) => category.group === 'ecosystem');
  const guides = articles.filter((article) => article.kind === 'guide');
  const updates = articles.filter((article) => article.kind === 'update' || article.kind === 'article');

  return (
    <KnowledgePageFrame
      eyebrow="ENCYCLOPEDIA_INDEX"
      title="Arcium Knowledge Grid"
      summary="A scaffolded reference layer for the atlas: browse broad knowledge categories, open territory guides, and move from the homepage shell into working article routes."
      statusLabel="KNOWLEDGE_ROUTES_ONLINE"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Encyclopedia', href: '/encyclopedia' },
      ]}
      meta={
        <>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            CATEGORIES // {categories.length}
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            ARTICLES // {articles.length}
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            ECOSYSTEM // /ecosystem
          </div>
        </>
      }
    >
      <section className="console-window col-span-12">
        <div className="console-header">
          <span>MODULE_05: KNOWLEDGE_CATEGORIES</span>
          <span className="text-primary">REFERENCE_LAYER</span>
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
          {knowledgeCategories.map((category) => (
            <KnowledgeRecordCard
              key={category.id}
              action={{
                type: 'internal',
                href: getKnowledgeCategoryPath(category.slug),
                label: 'Open Category',
              }}
              tag={category.tag}
              title={category.title}
              summary={category.summary}
              eyebrow={category.prefix}
            />
          ))}
        </div>
      </section>

      <section className="console-window col-span-12">
        <div className="console-header">
          <span>MODULE_06: START_HERE_GUIDES</span>
          <span className="text-primary">ONBOARDING_ACTIVE</span>
        </div>
        <div className="grid gap-4 p-4 lg:grid-cols-3">
          {guides.map((article) => (
            <KnowledgeRecordCard
              key={article.id}
              action={{
                type: 'internal',
                href: getKnowledgeArticlePath(article.slug),
                label: 'Read Guide',
              }}
              tag={article.tag}
              title={article.title}
              summary={article.summary}
              meta="Guide"
            />
          ))}
        </div>
      </section>

      <section className="console-window col-span-12">
        <div className="console-header">
          <span>MODULE_07: ECOSYSTEM_TERRITORIES</span>
          <span className="text-primary">DIRECTORY_CONNECTED</span>
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
          {ecosystemTerritories.map((category) => (
            <KnowledgeRecordCard
              key={category.id}
              action={{
                type: 'internal',
                href: getKnowledgeCategoryPath(category.slug),
                label: 'Open Territory',
              }}
              tag={category.tag}
              title={category.title}
              summary={category.summary}
              eyebrow={category.prefix}
              meta="Ecosystem"
            />
          ))}
        </div>
      </section>

      <section className="console-window col-span-12">
        <div className="console-header">
          <span>MODULE_08: RECENT_ARTICLES</span>
          <span className="text-primary">ARCHIVE_LINKED</span>
        </div>
        <div className="grid gap-4 p-4 lg:grid-cols-3">
          {updates.map((article) => (
            <KnowledgeRecordCard
              key={article.id}
              action={{
                type: 'internal',
                href: getKnowledgeArticlePath(article.slug),
                label: 'Read Article',
              }}
              tag={article.tag}
              title={article.title}
              summary={article.summary}
              meta={article.date || 'Article'}
            />
          ))}
        </div>
      </section>
    </KnowledgePageFrame>
  );
}
