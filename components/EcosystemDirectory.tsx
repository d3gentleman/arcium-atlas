'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getCategoryIcon } from '@/lib/categoryIcons';
import { EcosystemCategoryRecord, EcosystemProjectRecord } from '../types/domain';
import ProjectRow from './ProjectRow';

interface EcosystemDirectoryProps {
  categories: EcosystemCategoryRecord[];
  projects: EcosystemProjectRecord[];
  categoryColors: Record<string, string>;
}

function getCategoryProjects(
  category: EcosystemCategoryRecord,
  projects: EcosystemProjectRecord[],
) {
  return projects.filter(
    (project) => project.categoryId === category.id || project.categoryId === category.slug,
  );
}

function getCategoryPath(slug: string) {
  return `/ecosystem/categories/${slug}`;
}

export default function EcosystemDirectory({
  categories,
  projects,
  categoryColors,
}: EcosystemDirectoryProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const featuredProjects = projects.filter((project) => project.isFeatured);
  const activeCategories = categories.filter(
    (category) => getCategoryProjects(category, projects).length > 0,
  );
  const watchlistCategories = categories.filter(
    (category) => getCategoryProjects(category, projects).length === 0,
  );
  const selectedCategory = selectedCategoryId
    ? categories.find(
        (category) => category.id === selectedCategoryId || category.slug === selectedCategoryId,
      ) ?? null
    : null;

  const filteredCategories = selectedCategoryId
    ? categories.filter(
        (category) => category.id === selectedCategoryId || category.slug === selectedCategoryId,
      )
    : activeCategories;

  const renderCategorySection = (category: EcosystemCategoryRecord, animated = false) => {
    const categoryProjects = getCategoryProjects(category, projects);

    if (categoryProjects.length === 0) {
      return null;
    }

    const color = categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3';

    return (
      <section
        key={category.id}
        className={`space-y-8 ${animated ? 'animate-in fade-in slide-in-from-bottom-4 duration-500' : ''}`}
      >
        <div className="flex flex-col gap-4 border-b pb-4" style={{ borderColor: `${color}33` }}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
            <div className="flex items-center gap-3">
              {getCategoryIcon(category.slug, color)}
              <h2 className="font-space text-xl font-black uppercase tracking-widest text-white md:text-2xl">
                {category.title}
                <span className="ml-3 sm:ml-4 text-xs font-mono lowercase tracking-normal opacity-60" style={{ color }}>
                  {'//'} {category.tag}
                </span>
              </h2>
            </div>
            <div className="text-xs font-mono uppercase text-on-surface-variant/60">
              {categoryProjects.length} Projects_Detected
            </div>
          </div>
          <p className="max-w-3xl text-sm leading-7 text-on-surface-variant">
            {category.summary}
          </p>
        </div>

        <div className="flex flex-col border border-outline-variant/30 bg-[#06080a]/50">
          <div className="hidden gap-4 border-b border-outline-variant/30 bg-surface-container/30 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 md:grid md:grid-cols-12">
            <div className="col-span-4">Project_Identifier</div>
            <div className="col-span-5">Summary_Log</div>
            <div className="col-span-2">Sys_Status</div>
            <div className="col-span-1 text-right">Action</div>
          </div>
          {categoryProjects.map((project) => (
            <ProjectRow key={project.id} project={project} color={color} />
          ))}
        </div>
      </section>
    );
  };

  const emptyState = (
    <div className="flex flex-col rounded-sm border border-primary/20 bg-primary/5 p-12 text-center animate-in fade-in duration-500">
      <div className="mb-4 font-space text-4xl text-primary">{'</>'}</div>
      <h3 className="mb-2 font-space text-xl font-bold uppercase tracking-widest text-white">
        [SYSTEM_ALERT]: NO_PROJECTS_FOUND
      </h3>

      {selectedCategory ? (
        <>
          <p className="mx-auto mb-8 max-w-xl font-jetbrains text-sm leading-7 text-on-surface-variant/70">
            Atlas has not published builder records for <span className="text-white">{selectedCategory.title}</span> yet.
            The territory briefing is live, but coverage for this sector is still being filled in.
          </p>
          <div className="mx-auto flex flex-wrap justify-center gap-4">
            <Link
              href={getCategoryPath(selectedCategory.slug)}
              className="border border-outline-variant/40 px-6 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-surface-container"
            >
              Open_Territory_Briefing
            </Link>
            <button
              onClick={() => setSelectedCategoryId(null)}
              className="border border-primary/50 px-6 py-2 text-xs font-bold uppercase tracking-widest text-primary shadow-[0_0_15px_rgba(47,230,166,0.15)] transition-colors hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(47,230,166,0.3)]"
            >
              Reset_Query
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mx-auto mb-8 max-w-xl font-jetbrains text-sm leading-7 text-on-surface-variant/70">
            No builder records are published yet. Add project records before promoting the public directory.
          </p>
          <button
            onClick={() => setSelectedCategoryId(null)}
            className="mx-auto border border-primary/50 px-6 py-2 text-xs font-bold uppercase tracking-widest text-primary shadow-[0_0_15px_rgba(47,230,166,0.15)] transition-colors hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(47,230,166,0.3)]"
          >
            Reset_Query
          </button>
        </>
      )}
    </div>
  );

  if (!selectedCategoryId && projects.length === 0) {
    return <div className="space-y-12">{emptyState}</div>;
  }

  const categorySections = filteredCategories.flatMap((category) => {
    const section = renderCategorySection(category, Boolean(selectedCategoryId));
    return section ? [section] : [];
  });

  return (
    <div className="space-y-12">
      <div className="flex flex-nowrap items-center gap-3 overflow-x-auto border-b border-outline-variant/20 pb-6 scrollbar-hide md:flex-wrap">
        <div className="mr-2 shrink-0 text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">
          Filter_By_Sector:
        </div>

        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`shrink-0 border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 ${
            selectedCategoryId === null
              ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(47,230,166,0.2)]'
              : 'border-outline-variant/30 text-on-surface-variant/60 hover:border-outline-variant/60'
          }`}
        >
          All_Sectors
        </button>

        {categories.map((category) => {
          const color = categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3';
          const projectCount = getCategoryProjects(category, projects).length;
          const isActive = selectedCategoryId === category.id || selectedCategoryId === category.slug;

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className="shrink-0 border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300"
              style={{
                borderColor: isActive ? color : 'rgba(255,255,255,0.1)',
                backgroundColor: isActive ? `${color}1A` : 'transparent',
                boxShadow: isActive ? `0 0 15px ${color}33` : 'none',
                color: isActive ? color : projectCount > 0 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.28)',
              }}
            >
              {category.title.replace(/\s+/g, '_')} [{projectCount}]
            </button>
          );
        })}
      </div>

      <div className="space-y-24">
        {!selectedCategoryId ? (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {featuredProjects.length > 0 && (
              <section className="space-y-8">
                <div className="flex flex-col justify-between gap-4 border-b border-outline-variant/30 pb-4 text-primary sm:flex-row sm:items-baseline">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-primary text-primary shadow-[0_0_8px_currentColor]" />
                    <h2 className="font-space text-xl font-black uppercase tracking-widest text-white md:text-2xl">
                      FEATURED_BUILDERS
                      <span className="ml-3 sm:ml-4 text-xs font-mono lowercase tracking-normal opacity-60 text-primary">
                        {'//'} highest_signal_examples
                      </span>
                    </h2>
                  </div>
                  <div className="text-xs font-mono uppercase text-on-surface-variant/60">
                    {featuredProjects.length} Featured
                  </div>
                </div>

                <div className="flex flex-col border border-outline-variant/30 bg-[#06080a]/50">
                  <div className="hidden gap-4 border-b border-outline-variant/30 bg-surface-container/30 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 md:grid md:grid-cols-12">
                    <div className="col-span-4">Project_Identifier</div>
                    <div className="col-span-5">Summary_Log</div>
                    <div className="col-span-2">Sys_Status</div>
                    <div className="col-span-1 text-right">Action</div>
                  </div>
                  {featuredProjects.map((project) => {
                    const category = categories.find(
                      (entry) => entry.id === project.categoryId || entry.slug === project.categoryId,
                    );
                    const color = category
                      ? categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3'
                      : '#00FFA3';

                    return <ProjectRow key={project.id} project={project} color={color} />;
                  })}
                </div>
              </section>
            )}

            {categorySections}

            {watchlistCategories.length > 0 && (
              <section className="space-y-8">
                <div className="flex flex-col gap-4 border-b border-outline-variant/20 pb-4 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h2 className="font-space text-xl font-black uppercase tracking-widest text-white md:text-2xl">
                      WATCHLIST_TERRITORIES
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-on-surface-variant">
                      These territory briefings are live, but Atlas does not yet have published builder records for them.
                    </p>
                  </div>
                  <div className="text-xs font-mono uppercase text-on-surface-variant/60">
                    {watchlistCategories.length} Pending_Coverage
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {watchlistCategories.map((category) => {
                    const color = categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3';

                    return (
                        <Link
                          key={category.id}
                          href={getCategoryPath(category.slug)}
                          className="group rounded-[1.2rem] border border-outline-variant/20 bg-[#06080a]/50 p-5 transition-colors hover:border-outline-variant/35 hover:bg-[#0a0e12]"
                        >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center border"
                            style={{ borderColor: `${color}40`, backgroundColor: `${color}08` }}
                          >
                            {getCategoryIcon(category.slug, color, 18)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-black uppercase tracking-wide text-white">
                              {category.title}
                            </div>
                            <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color }}>
                              WATCHLIST
                            </div>
                          </div>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-on-surface-variant">
                          {category.summary}
                        </p>
                        <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-outline transition-colors group-hover:text-white">
                          Open briefing
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        ) : categorySections.length > 0 ? (
          categorySections
        ) : (
          emptyState
        )}
      </div>
    </div>
  );
}
