import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import KnowledgeRecordCard from '@/components/KnowledgeRecordCard';
import {
  getKnowledgeArticleBySlug,
  getKnowledgeArticles,
  getKnowledgeCategoryBySlug,
  getKnowledgeCategories,
  getKnowledgeArticlePath,
  getKnowledgeCategoryPath
} from '@/lib/content';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const categories = await getKnowledgeCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getKnowledgeCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: 'Category Not Found | ARCIUM ATLAS',
    };
  }

  return {
    title: `${category.title} | Encyclopedia | ARCIUM ATLAS`,
    description: category.summary,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [category, allArticles] = await Promise.all([
    getKnowledgeCategoryBySlug(params.slug),
    getKnowledgeArticles()
  ]);

  if (!category) {
    notFound();
  }

  const articles = allArticles.filter((article) =>
    article.relatedCategoryId === category.id || 
    article.relatedCategoryId === category.slug
  );
  
  const overviewArticle = await getKnowledgeArticleBySlug('ecosystem-overview');

  return (
    <KnowledgePageFrame
      eyebrow={`CATEGORY // ${(category.group || 'atlas').toUpperCase()}`}
      title={category.title}
      summary={category.summary}
      statusLabel={category.group === 'ecosystem' ? 'TERRITORY_GUIDE_READY' : 'REFERENCE_GUIDE_READY'}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Encyclopedia', href: '/encyclopedia' },
        { label: category.title, href: getKnowledgeCategoryPath(category.slug) },
      ]}
      meta={
        <>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            TAG // {category.tag}
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            ARTICLES // {articles.length}
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            STATUS // LIVE
          </div>
        </>
      }
    >
      <section className="console-window col-span-12">
        <div className="console-header">
          <span>MODULE_09: CATEGORY_BRIEFING</span>
          <span className="text-primary">{(category.prefix || 'CAT').toUpperCase()}_ACTIVE</span>
        </div>
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-4">
            {(category.bodySections || []).map((section) => (
              <article
                key={section.title}
                className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-5"
              >
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                  {section.title}
                </div>
                <div className="space-y-4 text-sm leading-7 text-on-surface-variant">
                  {(section.body || '').split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <aside className="space-y-4">
            <div className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
              <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                Quick Paths
              </div>
              <div className="space-y-3 text-[10px] font-bold uppercase tracking-[0.18em]">
                <Link
                  href="/encyclopedia"
                  className="block rounded-[1rem] border border-outline-variant/25 px-4 py-3 text-outline transition-colors hover:text-primary"
                >
                  Back to Encyclopedia
                </Link>
                <Link
                  href="/ecosystem"
                  className="block rounded-[1rem] border border-primary/30 bg-primary/10 px-4 py-3 text-primary transition-colors hover:bg-primary/20"
                >
                  Explore Ecosystem
                </Link>
                {overviewArticle ? (
                  <Link
                    href={getKnowledgeArticlePath(overviewArticle.slug)}
                    className="block rounded-[1rem] border border-outline-variant/25 px-4 py-3 text-outline transition-colors hover:text-primary"
                  >
                    Read Ecosystem Overview
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
              <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                Scope
              </div>
              <p className="text-sm leading-7 text-on-surface-variant">
                {category.summary}
              </p>
            </div>
          </aside>
        </div>
      </section>

      {articles.length > 0 && (
        <section className="console-window col-span-12">
          <div className="console-header">
            <span>MODULE_10: RELATED_ARTICLES</span>
            <span className="text-primary">CONTENT_LINKED</span>
          </div>
          <div className="grid gap-4 p-4 lg:grid-cols-3">
            {articles.map((article) => (
              <KnowledgeRecordCard
                key={article.id}
                action={{
                  type: 'internal',
                  href: getKnowledgeArticlePath(article.slug),
                  label: article.kind === 'guide' ? 'Read Guide' : 'Read Article',
                }}
                tag={article.tag}
                title={article.title}
                summary={article.summary}
                meta={article.date || 'Guide'}
              />
            ))}
          </div>
        </section>
      )}
    </KnowledgePageFrame>
  );
}
