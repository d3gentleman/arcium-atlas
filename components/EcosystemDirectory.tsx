'use client';

import { useState } from 'react';
import { KnowledgeCategoryRecord, EcosystemProjectRecord } from '../types/domain';
import ProjectCard from './ProjectCard';

interface EcosystemDirectoryProps {
  categories: KnowledgeCategoryRecord[];
  projects: EcosystemProjectRecord[];
  categoryColors: Record<string, string>;
}

export default function EcosystemDirectory({ categories, projects, categoryColors }: EcosystemDirectoryProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const filteredCategories = selectedCategoryId 
    ? categories.filter(c => c.id === selectedCategoryId || c.slug === selectedCategoryId)
    : categories;

  return (
    <div className="space-y-12">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-outline-variant/20 pb-8">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 mr-2">
          Filter_By_Sector:
        </div>
        
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] border transition-all duration-300 ${
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
              className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] border transition-all duration-300"
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
        {filteredCategories.map((category) => {
          const categoryProjects = projects.filter(p => 
            p.categoryId === category.id || p.categoryId === category.slug
          );
          
          if (categoryProjects.length === 0) return null;

          const color = categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3';

          return (
            <section key={category.id} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div 
                className="flex items-baseline justify-between border-b pb-4"
                style={{ borderColor: `${color}33` }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2" style={{ backgroundColor: color }} />
                  <h2 className="font-space text-xl font-black uppercase tracking-widest text-white">
                    {category.title}
                    <span className="ml-4 text-[10px] font-mono tracking-normal opacity-40 lowercase" style={{ color: color }}>
                       // {category.tag}
                    </span>
                  </h2>
                </div>
                <div className="text-[10px] font-mono text-on-surface-variant/40 uppercase">
                  {categoryProjects.length} Projects_Detected
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categoryProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} color={color} />
                ))}
              </div>
            </section>
          );
        })}
        
        {filteredCategories.length === 0 && (
          <div className="border-2 border-dashed border-outline-variant/30 py-24 text-center">
            <p className="font-jetbrains text-on-surface-variant/60 uppercase">
              [SYSTEM_ALERT]: NO_PROJECT_GROUPS_MATCH_THIS_QUERY
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
