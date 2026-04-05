import type { Metadata } from 'next';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import EncyclopediaSearch from '@/components/EncyclopediaSearch';
import { 
    getKnowledgeArticles, 
    getKnowledgeCategories
} from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Encyclopedia',
  description: 'Browse Arcium categories, guides, and updates in one curated encyclopedia.',
  path: '/encyclopedia',
});

export default async function EncyclopediaPage() {
  const [categories, articles] = await Promise.all([
    getKnowledgeCategories(),
    getKnowledgeArticles()
  ]);

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
      <EncyclopediaSearch categories={categories} articles={articles} />
    </KnowledgePageFrame>
  );
}
