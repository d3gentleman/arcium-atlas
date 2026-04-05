'use client';

import { useState } from 'react';
import { EcosystemCategoryRecord, EcosystemProjectRecord } from '../types/domain';
import ProjectRow from './ProjectRow';

interface EcosystemDirectoryProps {
  categories: EcosystemCategoryRecord[];
  projects: EcosystemProjectRecord[];
  categoryColors: Record<string, string>;
}

export default function EcosystemDirectory({ categories, projects, categoryColors }: EcosystemDirectoryProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const featuredProjects = projects.filter((project) => project.isFeatured);

  const filteredCategories = selectedCategoryId 
    ? categories.filter(c => c.id === selectedCategoryId || c.slug === selectedCategoryId)
    : categories;

  return (
    <div className="space-y-12">
      {/* Filter Bar */}
      <div className="flex flex-nowrap md:flex-wrap items-center gap-3 border-b border-outline-variant/20 pb-6 overflow-x-auto scrollbar-hide">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 mr-2 shrink-0">
          Filter_By_Sector:
        </div>
        
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`shrink-0 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] border transition-all duration-300 ${
            selectedCategoryId === null 
              ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(47,230,166,0.2)]' 
              : 'border-outline-variant/30 text-on-surface-variant/60 hover:border-outline-variant/60'
          }`}
        >
          All_Sectors
        </button>

        {categories.map((category) => {
          const color = categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3';
          const isActive = selectedCategoryId === category.id || selectedCategoryId === category.slug;

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className="shrink-0 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] border transition-all duration-300"
              style={{
                borderColor: isActive ? color : 'rgba(255,255,255,0.1)',
                backgroundColor: isActive ? `${color}1A` : 'transparent',
                color: isActive ? color : 'rgba(255,255,255,0.4)',
                boxShadow: isActive ? `0 0 15px ${color}33` : 'none'
              }}
            >
              {category.title.replace(/\s+/g, '_')}
            </button>
          );
        })}
      </div>

      {/* Categories Grid */}
      <div className="space-y-24">
        {(() => {
          const emptyState = (
            <div className="flex flex-col border border-primary/20 bg-primary/5 p-12 text-center rounded-sm animate-in fade-in duration-500">
              <div className="text-primary mb-4 font-space text-4xl">{"</>"}</div>
              <h3 className="font-space text-xl font-bold uppercase tracking-widest text-white mb-2">
                [SYSTEM_ALERT]: NO_PROJECTS_FOUND
              </h3>
              <p className="font-jetbrains text-sm text-on-surface-variant/60 uppercase mb-8 max-w-md mx-auto">
                Scan complete. No projects detected in this sector yet. The network is expanding.
              </p>
              <button 
                onClick={() => setSelectedCategoryId(null)}
                className="mx-auto px-6 py-2 border border-primary/50 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/10 transition-colors shadow-[0_0_15px_rgba(47,230,166,0.15)] hover:shadow-[0_0_20px_rgba(47,230,166,0.3)]"
              >
                Reset_Query
              </button>
            </div>
          );

          if (selectedCategoryId === null) {
            if (projects.length === 0) return emptyState;

            return (
              <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {featuredProjects.length > 0 && (
                  <section className="space-y-8">
                    <div 
                      className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b pb-4 border-outline-variant/30 text-primary"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 shadow-[0_0_8px_currentColor] bg-primary text-primary" />
                        <h2 className="font-space text-xl md:text-2xl font-black uppercase tracking-widest text-white">
                          FEATURED_BUILDERS
                          <span className="ml-3 sm:ml-4 text-xs font-mono tracking-normal opacity-60 lowercase text-primary">
                           {"//"} highest_signal_examples
                          </span>
                        </h2>
                      </div>
                      <div className="text-xs font-mono text-on-surface-variant/60 uppercase">
                        {featuredProjects.length} Featured
                      </div>
                    </div>

                    <div className="flex flex-col border border-outline-variant/30 bg-[#06080a]/50">
                      <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 border-b border-outline-variant/30 bg-surface-container/30 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">
                        <div className="col-span-4">Project_Identifier</div>
                        <div className="col-span-5">Summary_Log</div>
                        <div className="col-span-2">Sys_Status</div>
                        <div className="col-span-1 text-right">Action</div>
                      </div>
                      {featuredProjects.map((project) => {
                        const category = categories.find(c => c.id === project.categoryId || c.slug === project.categoryId);
                        const color = category ? (categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3') : '#00FFA3';
                        return (
                          <ProjectRow key={project.id} project={project} color={color} />
                        );
                      })}
                    </div>
                  </section>
                )}

                {categories.map((category) => {
                  const categoryProjects = projects.filter(p => 
                    p.categoryId === category.id || p.categoryId === category.slug
                  );

                  if (categoryProjects.length === 0) return null;

                  const color = categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3';

                  return (
                    <section key={category.id} className="space-y-8">
                      <div 
                        className="flex flex-col gap-4 border-b pb-4"
                        style={{ borderColor: `${color}33` }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 shadow-[0_0_8px_currentColor]" style={{ backgroundColor: color, color: color }} />
                            <h2 className="font-space text-xl md:text-2xl font-black uppercase tracking-widest text-white">
                              {category.title}
                              <span className="ml-3 sm:ml-4 text-xs font-mono tracking-normal opacity-60 lowercase" style={{ color: color }}>
                               {"//"} {category.tag}
                              </span>
                            </h2>
                          </div>
                          <div className="text-xs font-mono text-on-surface-variant/60 uppercase">
                            {categoryProjects.length} Projects_Detected
                          </div>
                        </div>
                        <p className="max-w-3xl text-sm leading-7 text-on-surface-variant">
                          {category.summary}
                        </p>
                      </div>

                      <div className="flex flex-col border border-outline-variant/30 bg-[#06080a]/50">
                        <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 border-b border-outline-variant/30 bg-surface-container/30 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">
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
                })}
              </div>
            );
          }

          let renderedCategoriesCount = 0;
          
          const categoryElements = filteredCategories.map((category) => {
            const categoryProjects = projects.filter(p => 
              p.categoryId === category.id || p.categoryId === category.slug
            );
            
            if (categoryProjects.length === 0) return null;
            renderedCategoriesCount++;
            
            const color = categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3';

            return (
              <section key={category.id} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div 
                  className="flex flex-col gap-4 border-b pb-4"
                  style={{ borderColor: `${color}33` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 shadow-[0_0_8px_currentColor]" style={{ backgroundColor: color, color: color }} />
                    <h2 className="font-space text-xl md:text-2xl font-black uppercase tracking-widest text-white">
                      {category.title}
                      <span className="ml-3 sm:ml-4 text-xs font-mono tracking-normal opacity-60 lowercase" style={{ color: color }}>
                       {"//"} {category.tag}
                      </span>
                    </h2>
                  </div>
                  <div className="text-xs font-mono text-on-surface-variant/60 uppercase">
                    {categoryProjects.length} Projects_Detected
                  </div>
                  </div>
                  <p className="max-w-3xl text-sm leading-7 text-on-surface-variant">
                    {category.summary}
                  </p>
                </div>

                <div className="flex flex-col border border-outline-variant/30 bg-[#06080a]/50">
                  <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 border-b border-outline-variant/30 bg-surface-container/30 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">
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
          });

          if (renderedCategoriesCount === 0) {
            return emptyState;
          }

          return categoryElements;
        })()}
      </div>
    </div>
  );
}
