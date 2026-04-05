import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import KnowledgeRecordCard from '@/components/KnowledgeRecordCard';
import {
  getKnowledgeArticleBySlug,
  getKnowledgeArticles,
  getKnowledgeCategoryById,
  getGlossaryTermsByCategoryId,
  getKnowledgeCategoryPath,
  getKnowledgeArticlePath
} from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const articles = await getKnowledgeArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getKnowledgeArticleBySlug(params.slug);

  if (!article) {
    return buildMetadata({
      title: 'Article Not Found',
      path: `/encyclopedia/articles/${params.slug}`,
    });
  }

  return buildMetadata({
    title: article.title,
    description: article.summary,
    path: `/encyclopedia/articles/${params.slug}`,
  });
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getKnowledgeArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const [relatedCategory, allArticles, relatedTerms] = await Promise.all([
    article.relatedCategoryId ? getKnowledgeCategoryById(article.relatedCategoryId) : Promise.resolve(null),
    getKnowledgeArticles(),
    article.relatedCategoryId ? getGlossaryTermsByCategoryId(article.relatedCategoryId) : Promise.resolve([])
  ]);

  const siblingArticles = allArticles
    .filter((candidate) => candidate.id !== article.id && candidate.relatedCategoryId === article.relatedCategoryId)
    .slice(0, 3);

  return (
    <KnowledgePageFrame
      eyebrow={`ARTICLE // ${article.kind.toUpperCase()}`}
      title={article.title}
      summary={article.summary}
      statusLabel={article.kind === 'guide' ? 'GUIDE_READY' : 'ARTICLE_READY'}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Encyclopedia', href: '/encyclopedia' },
        { label: article.title, href: getKnowledgeArticlePath(article.slug) },
      ]}
      meta={
        <>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            TAG // {article.tag}
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            DATE // {article.date || 'REFERENCE'}
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            STATUS // LIVE
          </div>
        </>
      }
    >
      <section className="console-window col-span-12">
        <div className="console-header">
          <span>MODULE_12: ARTICLE_BODY</span>
          <span className="text-primary">{article.kind.toUpperCase()}_ACTIVE</span>
        </div>
        <div className="grid gap-8 p-6 lg:p-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-12 max-w-4xl w-full mx-auto md:mx-0">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.2rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Key takeaway</div>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">{article.summary}</p>
              </div>
              <div className="rounded-[1.2rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Why it matters</div>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">This page translates Arcium language into product and architecture consequences a reader can actually use.</p>
              </div>
              <div className="rounded-[1.2rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Best next move</div>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">Use the related concepts and next reads to connect this article back to the rest of the atlas.</p>
              </div>
            </div>

            {article.bodySections.map((section) => (
              <article
                key={section.title}
                id={slugify(section.title)}
                className="scroll-mt-24"
              >
                <h2 className="mb-6 text-2xl font-black tracking-tight text-white border-b border-outline-variant/25 pb-4 inline-block">
                  {section.title}
                </h2>
                <div className="space-y-6 text-base leading-8 text-on-surface-variant font-medium">
                  {section.body.split('\n\n').map((paragraph, i) => (
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
              <div className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
                <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                  Table of Contents
                </div>
                <nav className="space-y-3 text-sm text-outline font-bold">
                  {article.bodySections.map((section) => (
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
                    Open Ecosystem
                  </Link>
                  {relatedCategory ? (
                    <Link
                      href={getKnowledgeCategoryPath(relatedCategory.slug)}
                      className="block rounded-[1rem] border border-outline-variant/25 px-4 py-3 text-outline transition-colors hover:text-white hover:bg-surface-container-high"
                    >
                      Open Related Category
                    </Link>
                  ) : null}
                </div>
              </div>
              {relatedCategory ? (
                <div className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
                  <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                    Related Category
                  </div>
                  <div className="space-y-2">
                    <div className="text-lg font-black tracking-tight text-white">{relatedCategory.title}</div>
                    <p className="text-sm leading-7 text-on-surface-variant line-clamp-3">{relatedCategory.summary}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </section>

      {siblingArticles.length > 0 && (
        <section className="console-window col-span-12">
          <div className="console-header">
            <span>MODULE_14: NEXT_READS</span>
            <span className="text-primary">ARCHIVE_CHAINED</span>
          </div>
          <div className="grid gap-4 p-4 lg:grid-cols-3">
            {siblingArticles.map((candidate) => (
              <KnowledgeRecordCard
                key={candidate.id}
                action={{
                  type: 'internal',
                  href: getKnowledgeArticlePath(candidate.slug),
                  label: candidate.kind === 'guide' ? 'Read Guide' : 'Read Article',
                }}
                tag={candidate.tag}
                title={candidate.title}
                summary={candidate.summary}
                meta={candidate.date || candidate.kind}
              />
            ))}
          </div>
        </section>
      )}
    </KnowledgePageFrame>
  );
}
