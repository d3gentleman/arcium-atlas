'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { EcosystemCategoryRecord, EcosystemProjectRecord } from '@/types/domain';

interface RecentProjectUpdatesProps {
  projects: EcosystemProjectRecord[];
  categories: EcosystemCategoryRecord[];
  categoryColors: Record<string, string>;
}

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

function getTimestamp(value?: string): number | null {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : timestamp;
}

function getActivityLabel(project: EcosystemProjectRecord): string {
  const updatedAt = getTimestamp(project.updatedAt);
  if (updatedAt) return `Updated ${SHORT_DATE_FORMATTER.format(updatedAt)}`;

  const createdAt = getTimestamp(project.createdAt);
  if (createdAt) return `Added ${SHORT_DATE_FORMATTER.format(createdAt)}`;

  const lastReviewed = getTimestamp(project.lastReviewed);
  if (lastReviewed) return `Reviewed ${SHORT_DATE_FORMATTER.format(lastReviewed)}`;

  return 'Atlas record';
}

export default function RecentProjectUpdates({
  projects,
  categories,
  categoryColors,
}: RecentProjectUpdatesProps) {
  const shouldReduceMotion = useReducedMotion();

  const entranceVariants = shouldReduceMotion
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
      };

  const listVariants = shouldReduceMotion
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.04 },
        },
      };

  const rowVariants = shouldReduceMotion
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 0, x: -8 },
        show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
      };

  const categoryIndex = new Map(
    categories.map((category) => [category.id, category])
  );

  // Also index by slug for fallback matching
  categories.forEach((category) => {
    if (!categoryIndex.has(category.slug)) {
      categoryIndex.set(category.slug, category);
    }
  });

  const recentProjects = [...projects]
    .sort((left, right) => {
      const leftTs =
        getTimestamp(left.updatedAt) ?? getTimestamp(left.createdAt) ?? 0;
      const rightTs =
        getTimestamp(right.updatedAt) ?? getTimestamp(right.createdAt) ?? 0;
      return rightTs - leftTs;
    })
    .slice(0, 6);

  if (recentProjects.length === 0) return null;

  return (
    <div className="relative border-t border-outline-variant/10 py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-8"
          variants={entranceVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-primary">
            Registry Freshness
          </div>
          <h2 className="mt-3 text-3xl font-space font-black uppercase tracking-widest text-white md:text-4xl">
            Recently Updated
          </h2>
        </motion.div>

        <motion.div
          className="divide-y divide-outline-variant/8"
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          {recentProjects.map((project) => {
            const category = categoryIndex.get(project.categoryId);
            const color = category
              ? categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3'
              : '#00FFA3';

            return (
              <motion.div key={project.id} variants={rowVariants}>
                <Link
                  href={`/ecosystem/${project.slug}`}
                  className="group flex items-center justify-between gap-4 py-3.5 transition-colors hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="inline-block h-1.5 w-1.5 shrink-0 bg-primary" />
                    <span className="truncate text-sm font-black uppercase tracking-wide text-white transition-colors group-hover:text-primary">
                      {project.title}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-6">
                    <span
                      className="hidden sm:inline text-[10px] font-mono uppercase tracking-[0.2em]"
                      style={{ color }}
                    >
                      {category?.title || 'Unassigned'}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-on-surface-variant/75">
                      {getActivityLabel(project)}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
