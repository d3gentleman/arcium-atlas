import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import { getCategoryIcon } from '@/lib/categoryIcons';
import {
  getEcosystemCategories,
  getEcosystemProjects,
  getEcosystemCategoryPath,
  getCategoryColors
} from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Ecosystem Territories',
  description: 'Explore the Arcium ecosystem by territory — from DeFi and AI to Gaming and DePIN.',
  path: '/ecosystem/categories',
});

export default async function TerritoriesPage() {
  const [categories, allProjects, categoryColors] = await Promise.all([
    getEcosystemCategories(),
    getEcosystemProjects(),
    getCategoryColors()
  ]);

  // Pre-compute project counts per category
  const projectCounts: Record<string, number> = {};
  for (const cat of categories) {
    projectCounts[cat.slug] = allProjects.filter(
      (p) => p.categoryId === cat.id || p.categoryId === cat.slug
    ).length;
  }

  return (
    <div className="col-span-12 flex min-h-screen flex-col bg-background text-on-surface">
      <main className="container mx-auto flex-1 px-4 py-8 md:px-8">
        <KnowledgePageFrame
          eyebrow="ATLAS // TERRITORY_MAP"
          title="Ecosystem Territories"
          summary="Navigate the Arcium ecosystem by category. Each territory represents a vertical where confidential computing unlocks new possibilities."
          statusLabel="MAP_READY"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Directory', href: '/ecosystem' },
            { label: 'Territories', href: '/ecosystem/categories' },
          ]}
          meta={
            <>
              <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
                TERRITORIES // {categories.length}
              </div>
              <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
                TOTAL_PROJECTS // {allProjects.length}
              </div>
            </>
          }
        >
          <section className="console-window col-span-12">
            <div className="console-header">
              <span>MODULE_11: TERRITORY_INDEX</span>
              <span className="text-primary">SCAN_COMPLETE</span>
            </div>
            <div className="p-6 lg:p-12">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category, index) => {
                  const color = categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3';
                  const count = projectCounts[category.slug] || 0;

                  return (
                    <Link
                      key={category.slug}
                      href={getEcosystemCategoryPath(category.slug)}
                      className="group relative flex flex-col gap-4 border border-outline-variant/20 bg-[#06080a]/60 p-6 transition-all duration-300 hover:border-transparent hover:bg-[#0a0e12]"
                      style={{
                        animationDelay: `${index * 60}ms`,
                        ['--category-color' as string]: color,
                      }}
                    >
                      {/* Glow border on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                          boxShadow: `inset 0 0 0 1px ${color}40, 0 0 20px ${color}10`,
                        }}
                      />

                      {/* Icon + title row */}
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center border transition-colors duration-300"
                          style={{ borderColor: `${color}40`, backgroundColor: `${color}08` }}
                        >
                          {getCategoryIcon(category.slug, color, 20)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-base font-black uppercase tracking-wide text-white group-hover:text-white/90 transition-colors truncate">
                            {category.title}
                          </h2>
                          <div className="text-[10px] font-mono uppercase tracking-widest opacity-50" style={{ color }}>
                            {category.tag}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm leading-6 text-on-surface-variant line-clamp-3">
                        {category.summary}
                      </p>

                      {/* Footer */}
                      <div className="mt-auto flex items-center justify-between pt-2 border-t border-outline-variant/15">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-on-surface-variant/50">
                          {count} {count === 1 ? 'PROJECT' : 'PROJECTS'}
                        </span>
                        <span
                          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ color }}
                        >
                          Explore
                          <ArrowRight size={12} />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </KnowledgePageFrame>
      </main>
    </div>
  );
}
