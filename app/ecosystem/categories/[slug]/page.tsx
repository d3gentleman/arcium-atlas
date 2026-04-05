import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import ProjectCard from '@/components/ProjectCard';
import {
  getEcosystemCategoryBySlug,
  getEcosystemCategories,
  getEcosystemProjects,
  getKnowledgeArticleBySlug,
  getKnowledgeArticlePath,
  getEcosystemCategoryPath,
  getCategoryColors
} from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

interface EcosystemCategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const categories = await getEcosystemCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: EcosystemCategoryPageProps): Promise<Metadata> {
  const category = await getEcosystemCategoryBySlug(params.slug);

  if (!category) {
    return buildMetadata({
      title: 'Ecosystem Category Not Found',
      path: `/ecosystem/categories/${params.slug}`,
    });
  }

  return buildMetadata({
    title: `${category.title} Ecosystem`,
    description: category.summary,
    path: `/ecosystem/categories/${params.slug}`,
  });
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default async function EcosystemCategoryPage({ params }: EcosystemCategoryPageProps) {
  const [category, allProjects, categoryColors] = await Promise.all([
    getEcosystemCategoryBySlug(params.slug),
    getEcosystemProjects(),
    getCategoryColors()
  ]);

  if (!category) {
    notFound();
  }

  const projects = allProjects.filter((project) =>
    project.categoryId === category.id || 
    project.categoryId === category.slug
  );
  
  const overviewArticle = await getKnowledgeArticleBySlug('ecosystem-overview');
  const color = categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3';

  return (
    <div className="col-span-12 flex min-h-screen flex-col bg-background text-on-surface">
      <main className="container mx-auto flex-1 px-4 py-8 md:px-8">
        <KnowledgePageFrame
          eyebrow={`TERRITORY // ECOSYSTEM`}
          title={category.title}
          summary={category.summary}
          statusLabel={'TERRITORY_GUIDE_READY'}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Ecosystem', href: '/ecosystem' },
            { label: category.title, href: getEcosystemCategoryPath(category.slug) },
          ]}
          meta={
            <>
              <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
                TAG // {category.tag}
              </div>
              <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
                PROJECTS // {projects.length}
              </div>
              <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
                STATUS // LIVE
              </div>
            </>
          }
        >
          <section className="console-window col-span-12">
            <div className="console-header">
              <span>MODULE_09: TERRITORY_BRIEFING</span>
              <span className="text-primary">{(category.prefix || 'TER').toUpperCase()}_ACTIVE</span>
            </div>
            <div className="grid gap-8 p-6 lg:p-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="space-y-12 max-w-4xl w-full mx-auto md:mx-0">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[1.2rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Category lens</div>
                    <p className="mt-3 text-sm leading-7 text-on-surface-variant">Use this page to understand why confidentiality matters in this product territory before comparing builders.</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Why it matters</div>
                    <p className="mt-3 text-sm leading-7 text-on-surface-variant">{category.summary}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Builder scan</div>
                    <p className="mt-3 text-sm leading-7 text-on-surface-variant">The project list below is the fastest way to compare how this thesis shows up in actual ecosystem products.</p>
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
                
                {category.bodySections.length === 0 && (
                  <div className="py-12 border border-dashed border-outline-variant/25 rounded-[1rem] text-center text-on-surface-variant/60 font-mono text-[10px] uppercase tracking-widest">
                    No detailed overview available for this territory yet.
                  </div>
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
                        href="/ecosystem"
                        className="block rounded-[1rem] border border-outline-variant/25 px-4 py-3 text-outline transition-colors hover:text-white hover:bg-surface-container-high"
                      >
                        Back to Ecosystem
                      </Link>
                      <Link
                        href="/encyclopedia"
                        className="block rounded-[1rem] border border-primary/30 bg-primary/5 px-4 py-3 text-primary transition-colors hover:bg-primary/20 hover:text-white"
                      >
                        Explore Encyclopedia
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
                </div>
              </aside>
            </div>
          </section>

          {projects.length > 0 && (
            <section className="console-window col-span-12">
              <div className="console-header">
                <span>MODULE_10: TERRITORY_PROJECTS</span>
                <span className="text-primary">ENTITIES_DETECTED</span>
              </div>
              <div className="grid gap-6 p-6 lg:p-12 lg:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    color={color}
                  />
                ))}
              </div>
            </section>
          )}
        </KnowledgePageFrame>
      </main>
    </div>
  );
}
