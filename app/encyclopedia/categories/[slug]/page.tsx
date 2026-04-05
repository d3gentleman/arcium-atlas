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
  getGlossaryTermsByCategoryId,
  getKnowledgeArticlePath,
  getKnowledgeCategoryPath
} from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

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
    return buildMetadata({
      title: 'Category Not Found',
      path: `/encyclopedia/categories/${params.slug}`,
    });
  }

  return buildMetadata({
    title: category.title,
    description: category.summary,
    path: `/encyclopedia/categories/${params.slug}`,
  });
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
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
  
  const [overviewArticle, relatedTerms] = await Promise.all([
    getKnowledgeArticleBySlug('ecosystem-overview'),
    getGlossaryTermsByCategoryId(category.id),
  ]);

  return (
    <KnowledgePageFrame
      eyebrow={`CATEGORY // ATLAS`}
      title={category.title}
      summary={category.summary}
      statusLabel={'REFERENCE_GUIDE_READY'}
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
        <div className="grid gap-8 p-6 lg:p-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-12 max-w-4xl w-full mx-auto md:mx-0">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.2rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Best for</div>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">Readers who want the conceptual model before jumping into individual articles.</p>
              </div>
              <div className="rounded-[1.2rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Why it matters</div>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">{category.summary}</p>
              </div>
              <div className="rounded-[1.2rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Next step</div>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">Use the related articles below to move from overview into narrower, more actionable reading.</p>
              </div>
            </div>

            {(category.bodySections || []).map((section) => (
              <article
                key={section.title}
                id={slugify(section.title)}
                className="scroll-mt-24"
              >
                <h2 className="mb-6 text-2xl font-black tracking-tight text-white border-b border-outline-variant/25 pb-4 inline-block">
                  {section.title}
                </h2>
                <div className="space-y-6 text-base leading-8 text-on-surface-variant font-medium">
                  {(section.body || '').split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}

            {relatedTerms.length > 0 && (
              <section className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-6">
                <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Related concepts</div>
                <div className="flex flex-wrap gap-2">
                  {relatedTerms.map((term) => (
                    <Link
                      key={term.id}
                      href={`/glossary#${term.slug}`}
                      className="rounded-full border border-outline-variant/20 px-3 py-2 text-xs font-bold text-outline transition-colors hover:border-outline-variant/40 hover:text-white"
                    >
                      {term.term}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
          <aside className="relative">
            <div className="sticky top-8 space-y-4">
              {category.bodySections && category.bodySections.length > 0 && (
                <div className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
                  <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                    Table of Contents
                  </div>
                  <nav className="space-y-3 text-sm text-outline font-bold">
                    {category.bodySections.map((section) => (
                      <Link
                        key={section.title}
                        href={`#${slugify(section.title)}`}
                        className="block transition-colors hover:text-white"
                      >
                        {section.title}
                      </Link>
                    ))}
                  </nav>
                </div>
              )}

              <div className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                  Quick Paths
                </div>
                <div className="space-y-3 text-[10px] font-bold uppercase tracking-[0.18em]">
                  <Link
                    href="/encyclopedia"
                    className="block rounded-[1rem] border border-outline-variant/25 px-4 py-3 text-outline transition-colors hover:text-white hover:bg-surface-container-high"
                  >
                    Back to Encyclopedia
                  </Link>
                  <Link
                    href="/ecosystem"
                    className="block rounded-[1rem] border border-primary/30 bg-primary/5 px-4 py-3 text-primary transition-colors hover:bg-primary/20 hover:text-white"
                  >
                    Explore Ecosystem
                  </Link>
                  {overviewArticle ? (
                    <Link
                      href={getKnowledgeArticlePath(overviewArticle.slug)}
                      className="block rounded-[1rem] border border-outline-variant/25 px-4 py-3 text-outline transition-colors hover:text-white hover:bg-surface-container-high"
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
                <p className="text-sm leading-7 text-on-surface-variant line-clamp-4">
                  {category.summary}
                </p>
              </div>
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
