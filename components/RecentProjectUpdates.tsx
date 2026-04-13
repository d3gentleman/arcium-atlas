'use client';

import Link from 'next/link';
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
    <div className="relative border-t border-outline-variant/10 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-entrance mb-10">
          <div className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-primary">
            Registry Freshness
          </div>
          <h2 className="mt-3 text-3xl font-space font-black uppercase tracking-widest text-white md:text-4xl">
            Recently Updated
          </h2>
        </div>

        <div className="divide-y divide-outline-variant/8">
          {recentProjects.map((project) => {
            const category = categoryIndex.get(project.categoryId);
            const color = category
              ? categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3'
              : '#00FFA3';

            return (
              <Link
                key={project.id}
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
