import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { EcosystemCategoryRecord, EcosystemProjectRecord } from '@/types/domain';

interface RecentProjectUpdatesProps {
  projects: EcosystemProjectRecord[];
  categories: EcosystemCategoryRecord[];
  categoryColors: Record<string, string>;
}

const LONG_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function getTimestamp(value?: string): number | null {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : timestamp;
}

function getActivityTimestamp(project: EcosystemProjectRecord): number {
  return (
    getTimestamp(project.updatedAt) ??
    getTimestamp(project.createdAt) ??
    getTimestamp(project.lastReviewed) ??
    0
  );
}

function getActivityLabel(project: EcosystemProjectRecord): string {
  const updatedAt = getTimestamp(project.updatedAt);
  if (updatedAt) {
    return `Updated ${LONG_DATE_FORMATTER.format(updatedAt)}`;
  }

  const createdAt = getTimestamp(project.createdAt);
  if (createdAt) {
    return `Added ${LONG_DATE_FORMATTER.format(createdAt)}`;
  }

  const lastReviewed = getTimestamp(project.lastReviewed);
  if (lastReviewed) {
    return `Reviewed ${LONG_DATE_FORMATTER.format(lastReviewed)}`;
  }

  return 'Atlas record';
}

export default function RecentProjectUpdates({
  projects,
  categories,
  categoryColors,
}: RecentProjectUpdatesProps) {
  const recentProjects = [...projects]
    .sort((left, right) => getActivityTimestamp(right) - getActivityTimestamp(left))
    .slice(0, 6);

  if (recentProjects.length === 0) {
    return null;
  }

  const categoryIndex = new Map(
    categories.flatMap((category) => [
      [category.id, category],
      [category.slug, category],
    ]),
  );

  return (
    <div className="relative overflow-hidden border-y border-outline-variant/25 bg-[#05070a] py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,224,255,0.12),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,0,229,0.08),transparent_38%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-5 border-b border-outline-variant/20 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-primary">
              Registry Freshness
            </div>
            <h2 className="mt-3 text-3xl font-space font-black uppercase tracking-widest text-white md:text-4xl">
              Recently Updated
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-on-surface-variant/75">
              The latest Atlas records to be added, reviewed, or refreshed across sectors.
            </p>
          </div>

          <Link
            href="/ecosystem"
            className="inline-flex items-center gap-2 border border-outline-variant/25 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-outline transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-white"
          >
            Browse full directory
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {recentProjects.map((project) => {
            const category = categoryIndex.get(project.categoryId);
            const color = category
              ? categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3'
              : '#00FFA3';

            return (
              <Link
                key={project.id}
                href={`/ecosystem/${project.slug}`}
                className="group relative flex items-center justify-between border border-outline-variant/15 bg-black/30 p-4 transition-colors duration-300 hover:border-outline-variant/40 hover:bg-black/60"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ boxShadow: `inset 0 0 0 1px ${color}50` }}
                />

                <div className="relative z-10 flex min-w-0 flex-col gap-1">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color }}>
                    {category?.title || 'Unassigned sector'}
                  </div>
                  <h3 className="truncate text-sm font-black uppercase tracking-wide text-white transition-colors group-hover:text-primary">
                    {project.title}
                  </h3>
                </div>

                <div className="relative z-10 flex shrink-0 flex-col items-end gap-1 text-right">
                  <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-on-surface-variant/55">
                    {getActivityLabel(project)}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-outline opacity-0 transition-all group-hover:text-white group-hover:opacity-100">
                    Open <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
