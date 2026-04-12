'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getCategoryIcon } from '@/lib/categoryIcons';
import type { EcosystemCategoryRecord, EcosystemProjectRecord } from '@/types/domain';
import Link from 'next/link';

interface SectorRadarProps {
  categories: EcosystemCategoryRecord[];
  projects: EcosystemProjectRecord[];
  categoryColors: Record<string, string>;
}

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

function getTimestamp(value?: string): number | null {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : timestamp;
}

function getProjectActivityTimestamp(project: EcosystemProjectRecord): number {
  return (
    getTimestamp(project.updatedAt) ??
    getTimestamp(project.createdAt) ??
    getTimestamp(project.lastReviewed) ??
    0
  );
}

function getProjectActivityLabel(project: EcosystemProjectRecord): string {
  const updatedAt = getTimestamp(project.updatedAt);
  if (updatedAt) {
    return `Updated ${SHORT_DATE_FORMATTER.format(updatedAt)}`;
  }

  const createdAt = getTimestamp(project.createdAt);
  if (createdAt) {
    return `Added ${SHORT_DATE_FORMATTER.format(createdAt)}`;
  }

  const lastReviewed = getTimestamp(project.lastReviewed);
  if (lastReviewed) {
    return `Reviewed ${SHORT_DATE_FORMATTER.format(lastReviewed)}`;
  }

  return 'Atlas record';
}

export default function SectorRadar({ categories, projects, categoryColors }: SectorRadarProps) {
  const rankedCategories = categories
    .map((category) => {
      const categoryProjects = projects
        .filter((project) => project.categoryId === category.id || project.categoryId === category.slug)
        .sort((left, right) => getProjectActivityTimestamp(right) - getProjectActivityTimestamp(left));

      return {
        category,
        categoryProjects,
        projectCount: categoryProjects.length,
      };
    })
    .sort((left, right) => {
      if (left.projectCount !== right.projectCount) {
        return right.projectCount - left.projectCount;
      }

      return left.category.title.localeCompare(right.category.title);
    });

  const activeCategories = rankedCategories.filter((entry) => entry.projectCount > 0);
  const watchlistCategories = rankedCategories.filter((entry) => entry.projectCount === 0).slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } },
  };

  return (
    <div className="relative overflow-hidden bg-[#06080a] border-b border-outline-variant/30 py-20">
      {/* Background Radar Effect */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
        <div className="w-[800px] h-[800px] rounded-full border border-primary/20 absolute" />
        <div className="w-[600px] h-[600px] rounded-full border border-primary/20 absolute" />
        <div className="w-[400px] h-[400px] rounded-full border border-primary/30 absolute" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-primary mb-3">
            System Scan Complete
          </h2>
          <div className="text-3xl font-space font-black uppercase tracking-widest text-white md:text-4xl">
            Sector Overview
          </div>
          <p className="max-w-2xl mx-auto mt-4 text-sm leading-6 text-on-surface-variant/70 font-jetbrains">
            Start with a sector, then jump straight into the newest Atlas records inside it.
          </p>
        </div>

        <motion.div 
          className="flex snap-x snap-mandatory overflow-x-auto pb-8 lg:grid lg:grid-cols-2 lg:overflow-x-visible lg:pb-0 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {activeCategories.map(({ category, categoryProjects, projectCount }) => {
            const color = categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3';
            const recentProjects = categoryProjects.slice(0, 2);

            return (
              <motion.div 
                key={category.id} 
                variants={itemVariants}
                whileHover={{ scale: 1.01, zIndex: 20 }}
              >
                <article className="min-w-[85vw] snap-center lg:min-w-0 group relative flex h-full flex-col border border-outline-variant/20 bg-black/45 pt-6 px-0 pb-0 backdrop-blur-sm transition-colors duration-300 hover:bg-black/60">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ boxShadow: `inset 0 0 0 1px ${color}, 0 0 24px ${color}15` }}
                  />

                  <Link
                    href={`/ecosystem/categories/${category.slug}`}
                    className="relative z-10 rounded-[1.25rem] border px-5 py-5 mx-6 block transition-colors group-hover:border-primary/50 cursor-pointer"
                    style={{
                      borderColor: `${color}33`,
                      background: `linear-gradient(135deg, ${color}14 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.35) 100%)`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center border bg-black/50" style={{ borderColor: `${color}40` }}>
                          {getCategoryIcon(category.slug, color, 18)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-mono uppercase tracking-[0.22em]" style={{ color }}>
                            {category.tag}
                          </div>
                          <div className="mt-2 block text-xl font-black uppercase tracking-wide text-white transition-colors group-hover:text-primary">
                            {category.title}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 border border-primary/20 bg-black/30 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-primary">
                        {projectCount} live
                      </div>
                    </div>
                  </Link>

                  <div className="relative z-10 mt-4 flex flex-1 flex-col px-6">
                    <div className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-on-surface-variant/55">
                      Recent project records
                    </div>

                    <div className="flex-1 space-y-0">
                      {recentProjects.map((project) => (
                        <Link
                          key={project.id}
                          href={`/ecosystem/${project.slug}`}
                          className="group/item flex items-start justify-between gap-4 border-b border-outline-variant/10 py-3 last:border-b-0 transition-colors hover:bg-white/5"
                        >
                          <div className="min-w-0 flex items-center">
                            <div className="truncate text-[13px] font-black uppercase tracking-wide text-white transition-colors group-hover/item:text-primary">
                              {project.title}
                            </div>
                          </div>
                          <div className="shrink-0 text-right flex items-center gap-4">
                            <div className="text-[10px] font-mono uppercase tracking-[0.16em]" style={{ color }}>
                              {getProjectActivityLabel(project)}
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 transition-opacity group-hover/item:opacity-100">
                              View
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-6 -mx-6">
                      <Link 
                        href={`/ecosystem/categories/${category.slug}`}
                        className="flex items-center justify-center w-full border-t border-outline-variant/20 bg-black/40 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-outline transition-colors hover:bg-black hover:text-white"
                      >
                        Open Sector <ArrowRight size={14} className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </article>
              </motion.div>
            );
          })}
        </motion.div>

        {watchlistCategories.length > 0 && (
          <div className="mt-14 border-t border-outline-variant/20 pt-10">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-primary">
                  Emerging Coverage
                </div>
                <h3 className="mt-3 text-2xl font-space font-black uppercase tracking-widest text-white">
                  Watchlist Sectors
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-on-surface-variant/72">
                  These sector briefings are already live, but Atlas has not published builder records for them yet.
                </p>
              </div>

              <Link
                href="/ecosystem/categories"
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-outline transition-colors hover:text-white"
              >
                View all sector briefings
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {watchlistCategories.map(({ category }) => {
                const color = categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3';

                return (
                  <Link
                    key={category.id}
                    href={`/ecosystem/categories/${category.slug}`}
                    className="group rounded-[1.1rem] border border-dashed border-outline-variant/20 bg-black/25 p-5 transition-colors hover:border-outline-variant/35 hover:bg-black/40"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center border"
                        style={{ borderColor: `${color}40`, backgroundColor: `${color}08` }}
                      >
                        {getCategoryIcon(category.slug, color, 18)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-base font-black uppercase tracking-wide text-white">
                          {category.title}
                        </div>
                        <div className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color }}>
                          Watchlist briefing
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-outline-variant/15 pt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-outline transition-colors group-hover:text-white">
                      Open briefing
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
