import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronRight, Map } from 'lucide-react';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import ProjectRow from '@/components/ProjectRow';
import { getCategoryIcon } from '@/lib/categoryIcons';
import {
  getEcosystemCategoryBySlug,
  getEcosystemCategories,
  getEcosystemProjects,
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
  const hasPublishedProjects = projects.length > 0;
  const statusLabel = hasPublishedProjects ? 'TERRITORY_GUIDE_READY' : 'WATCHLIST_BRIEFING';

  const color = categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3';

  return (
    <div className="col-span-12 flex min-h-screen flex-col bg-background text-on-surface">
      <main className="container mx-auto flex-1 px-4 py-8 md:px-8">
        <KnowledgePageFrame
          eyebrow={`TERRITORY // ECOSYSTEM`}
          title={category.title}
          summary={hasPublishedProjects ? category.summary : `${category.summary} Atlas has not published builder records for this territory yet.`}
          statusLabel={statusLabel}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Territories', href: '/ecosystem/categories' },
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
                STATUS // {hasPublishedProjects ? 'LIVE' : 'WATCHLIST'}
              </div>
            </>
          }
        >
          <section className="console-window col-span-12">
            <div className="console-header">
              <span className="flex items-center gap-2">
                {getCategoryIcon(category.slug, color, 14)}
                MODULE_09: TERRITORY_BRIEFING
              </span>
              <span style={{ color }}>{(category.prefix || 'TER').toUpperCase()}_ACTIVE</span>
            </div>
            <div className="grid gap-8 p-6 lg:p-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="space-y-12 max-w-4xl w-full mx-auto md:mx-0">

                {(category.bodySections || []).map((section) => (
                  <article
                    key={section.title}
                    id={slugify(section.title)}
                    className="scroll-mt-24"
                  >
                    <h2
                      className="mb-6 text-2xl font-black tracking-tight text-white border-b pb-4 inline-flex items-center gap-3"
                      style={{ borderColor: `${color}33` }}
                    >
                      <ChevronRight size={18} style={{ color }} />
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
                            className="flex items-center gap-2 transition-colors hover:text-white group"
                          >
                            <ChevronRight size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" style={{ color }} />
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
                        href="/ecosystem/categories"
                        className="flex items-center gap-2 rounded-[1rem] border border-outline-variant/25 px-4 py-3 text-outline transition-colors hover:text-white hover:bg-surface-container-high"
                      >
                        <Map size={12} />
                        All Territories
                      </Link>
                      <Link
                        href="/ecosystem"
                        className="flex items-center gap-2 rounded-[1rem] border border-outline-variant/25 px-4 py-3 text-outline transition-colors hover:text-white hover:bg-surface-container-high"
                      >
                        <ArrowLeft size={12} />
                        Back to Directory
                      </Link>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          {projects.length > 0 ? (
            <section className="console-window col-span-12">
              <div className="console-header">
                <span>MODULE_10: TERRITORY_PROJECTS</span>
                <span style={{ color }}>{projects.length} ENTITIES_DETECTED</span>
              </div>
              <div className="flex flex-col border border-outline-variant/30 bg-[#06080a]/50 m-6 lg:m-12">
                <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 border-b border-outline-variant/30 bg-surface-container/30 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">
                  <div className="col-span-4">Project_Identifier</div>
                  <div className="col-span-5">Summary_Log</div>
                  <div className="col-span-2">Sys_Status</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>
                {projects.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    color={color}
                  />
                ))}
              </div>
            </section>
          ) : (
            <section className="console-window col-span-12">
              <div className="console-header">
                <span>MODULE_10: TERRITORY_PROJECTS</span>
                <span style={{ color }}>WATCHLIST_ONLY</span>
              </div>
              <div className="p-6 lg:p-12">
                <div className="rounded-[1.4rem] border border-dashed border-outline-variant/25 bg-surface-container-lowest/50 p-6">
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                    Coverage Status
                  </div>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-on-surface-variant">
                    This territory briefing is live, but Atlas has not published builder records for it yet. Treat this page as a directional overview until concrete ecosystem entries are added.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/ecosystem"
                      className="inline-flex items-center gap-2 rounded-[1rem] border border-outline-variant/25 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-outline transition-colors hover:bg-surface-container-high hover:text-white"
                    >
                      <ArrowLeft size={12} />
                      Browse Directory
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}
        </KnowledgePageFrame>
      </main>
    </div>
  );
}
