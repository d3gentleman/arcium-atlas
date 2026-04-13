'use client';

import { motion, useReducedMotion } from 'framer-motion';
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
  const shouldReduceMotion = useReducedMotion();

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

  const containerVariants = shouldReduceMotion
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.06 },
        },
      };

  const itemVariants = shouldReduceMotion
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
      };

  return (
    <div className="relative border-t border-outline-variant/10 py-20 lg:py-24">
      {/* Background Radar Effect */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
        <div className="w-[800px] h-[800px] rounded-full border border-primary/20 absolute" />
        <div className="w-[600px] h-[600px] rounded-full border border-primary/20 absolute" />
        <div className="w-[400px] h-[400px] rounded-full border border-primary/30 absolute" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-entrance mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 text-center lg:text-left">
          <div>
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-primary mb-3">
              System Scan Complete
            </h2>
            <div className="text-3xl font-space font-black uppercase tracking-widest text-white md:text-4xl">
              Sector Overview
            </div>
            <p className="max-w-2xl lg:mx-0 mx-auto mt-4 text-sm leading-relaxed text-on-surface-variant/80 font-sans">
              Start with a sector, then jump straight into the newest Atlas records inside it.
            </p>
          </div>

          <div className="inline-flex items-center justify-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-[10px] font-mono uppercase tracking-[0.2em] text-primary lg:hidden shadow-[0_0_15px_rgba(0,255,163,0.1)]">
            Swipe to Scan
            <ArrowRight size={14} className="swipe-indicator-arrow" />
          </div>
        </div>

        <motion.div 
          className="flex snap-x snap-mandatory overflow-x-auto pb-8 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-2 lg:overflow-x-visible lg:pb-0 gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {activeCategories.map(({ category, categoryProjects, projectCount }, idx) => {
            const color = categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3';
            const recentProjects = categoryProjects.slice(0, 2);
            const isLast = idx === activeCategories.length - 1;

            return (
              <motion.div 
                key={category.id} 
                variants={itemVariants}
                className={`shrink-0 snap-start ${isLast ? 'pr-4 sm:pr-6 lg:pr-0' : ''}`}
              >
                <Link
                  href={`/ecosystem/categories/${category.slug}`}
                  className="group relative flex h-full w-[80vw] sm:w-[45vw] lg:w-auto lg:min-w-0 flex-col border bg-white/[0.03] pt-6 px-6 pb-0 transition-all duration-200 hover:bg-white/[0.05] hover:border-white/[0.12]"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ boxShadow: `inset 0 0 0 1px ${color}40, 0 0 16px ${color}08` }}
                  />

                  {/* Sector identity */}
                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center border bg-white/[0.03]" style={{ borderColor: `${color}40` }}>
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

                  {/* Recent projects */}
                  <div className="relative z-10 mt-5 flex flex-1 flex-col border-t border-white/[0.06] pt-4">
                    <div className="flex-1 space-y-0">
                      {recentProjects.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-start justify-between gap-4 border-b border-white/[0.04] py-3 last:border-b-0"
                        >
                          <div className="min-w-0 flex items-center gap-2">
                            <span className="inline-block h-1 w-1 shrink-0 bg-primary/50" />
                            <div className="truncate text-[13px] font-black uppercase tracking-wide text-white/90">
                              {project.title}
                            </div>
                          </div>
                          <div className="shrink-0 text-[10px] font-mono uppercase tracking-[0.16em] text-on-surface-variant/75">
                            {getProjectActivityLabel(project)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="relative z-10 mt-auto -mx-6 border-t border-white/[0.06] bg-white/[0.02] py-4 text-center text-[11px] font-black uppercase tracking-[0.2em] text-outline transition-colors group-hover:text-white">
                    Open Sector <ArrowRight size={14} className="inline ml-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {watchlistCategories.length > 0 && (
          <div className="mt-14 border-t border-outline-variant/10 pt-10">
            <div className="section-entrance mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-primary">
                  Emerging Coverage
                </div>
                <h3 className="mt-3 text-2xl font-space font-black uppercase tracking-widest text-white">
                  Watchlist Sectors
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant/80 font-sans">
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
                    className="group border border-dashed border-outline-variant/20 bg-white/[0.02] p-5 transition-colors hover:border-white/[0.12] hover:bg-white/[0.05]"
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

                    <div className="mt-4 border-t border-outline-variant/10 pt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-outline transition-colors group-hover:text-white">
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
