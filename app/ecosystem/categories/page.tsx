import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import { getCategoryIcon } from '@/lib/categoryIcons';
import {
  getCategoryColors,
  getEcosystemCategories,
  getEcosystemCategoryPath,
  getEcosystemProjects,
} from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Ecosystem Sectors',
  description: 'Explore the Arcium ecosystem by sector, with live builder coverage and watchlist briefings.',
  path: '/ecosystem/categories',
});

export default async function SectorsPage() {
  const [categories, allProjects, categoryColors] = await Promise.all([
    getEcosystemCategories(),
    getEcosystemProjects(),
    getCategoryColors(),
  ]);

  const projectCounts: Record<string, number> = {};
  for (const category of categories) {
    projectCounts[category.slug] = allProjects.filter(
      (project) => project.categoryId === category.id || project.categoryId === category.slug,
    ).length;
  }

  const activeCategories = categories.filter((category) => (projectCounts[category.slug] || 0) > 0);
  const watchlistCategories = categories.filter((category) => (projectCounts[category.slug] || 0) === 0);

  const renderCategoryCard = (category: (typeof categories)[number], index: number, watchlist = false) => {
    const color = categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3';
    const count = projectCounts[category.slug] || 0;

    return (
      <Link
        key={category.slug}
        href={getEcosystemCategoryPath(category.slug)}
        className={`group relative flex flex-col gap-4 p-6 transition-all duration-300 ${
          watchlist
            ? 'border border-dashed border-outline-variant/20 bg-[#06080a]/40 hover:border-outline-variant/35 hover:bg-[#0a0e12]'
            : 'border border-outline-variant/20 bg-[#06080a]/60 hover:border-transparent hover:bg-[#0a0e12]'
        }`}
        style={{
          animationDelay: `${index * 60}ms`,
          ['--category-color' as string]: color,
        }}
      >
        {!watchlist && (
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100"
            style={{
              boxShadow: `inset 0 0 0 1px ${color}40, 0 0 20px ${color}10`,
            }}
          />
        )}

        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center border"
            style={{ borderColor: `${color}40`, backgroundColor: `${color}08` }}
          >
            {getCategoryIcon(category.slug, color, 20)}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-black uppercase tracking-wide text-white transition-colors group-hover:text-white/90">
              {category.title}
            </h2>
            <div className="text-[11px] font-mono uppercase tracking-widest" style={{ color }}>
              {watchlist ? 'WATCHLIST' : category.tag}
            </div>
          </div>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-on-surface-variant">
          {category.summary}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-outline-variant/15 pt-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-on-surface-variant/50">
            {watchlist ? '0 PROJECTS' : `${count} ${count === 1 ? 'PROJECT' : 'PROJECTS'}`}
          </span>
          <span
            className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest ${
              watchlist ? 'transition-colors group-hover:text-white' : 'opacity-0 transition-opacity duration-300 group-hover:opacity-100'
            }`}
            style={{ color }}
          >
            {watchlist ? 'Open briefing' : 'Explore'}
            <ArrowRight size={12} />
          </span>
        </div>
      </Link>
    );
  };

  return (
    <KnowledgePageFrame
      eyebrow="ATLAS // SECTOR_MAP"
      title="Ecosystem Sectors"
      summary="Navigate the Arcium ecosystem by category. Some sectors already have mapped builder records, while others are live briefings that will fill in as Atlas coverage expands."
      statusLabel="MAP_READY"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Directory', href: '/ecosystem' },
        { label: 'Sectors', href: '/ecosystem/categories' },
      ]}
      meta={
        <>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            ACTIVE // {activeCategories.length}
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            TOTAL_PROJECTS // {allProjects.length}
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            WATCHLIST // {watchlistCategories.length}
          </div>
        </>
      }
    >
      <div className="space-y-10 p-4 lg:p-8">
        <div>
          <div className="mb-6 flex flex-col gap-4 border-b border-outline-variant/20 pb-4 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest text-white">
                ACTIVE_SECTORS
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-on-surface-variant">
                These sectors already have at least one published builder record in Atlas.
              </p>
            </div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-on-surface-variant/60">
              {activeCategories.length} live
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeCategories.map((category, index) => renderCategoryCard(category, index))}
          </div>
        </div>

        {watchlistCategories.length > 0 && (
          <div>
            <div className="mb-6 flex flex-col gap-4 border-b border-outline-variant/20 pb-4 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h2 className="text-xl font-black uppercase tracking-widest text-white">
                  WATCHLIST_SECTORS
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-on-surface-variant">
                  These sectors already have briefings, but Atlas has not published builder records for them yet.
                </p>
              </div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-on-surface-variant/60">
                {watchlistCategories.length} pending
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {watchlistCategories.map((category, index) =>
                renderCategoryCard(category, activeCategories.length + index, true),
              )}
            </div>
          </div>
        )}
      </div>
    </KnowledgePageFrame>
  );
}
