import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowUpRight,
  BarChart2,
  BookOpenText,
  Calendar,
  ExternalLink,
  Link2,
  ShieldCheck,
} from 'lucide-react';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import ProjectRow from '@/components/ProjectRow';
import {
  getCategoryColors,
  getEcosystemCategories,
  getEcosystemCategoryPath,
  getEcosystemProjectBySlug,
  getEcosystemProjects,
} from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import type { EcosystemProjectRecord, ProjectSource } from '@/types/domain';

interface ProjectPageProps {
  params: { slug: string };
}

const RELATIONSHIP_LABELS: Record<
  NonNullable<EcosystemProjectRecord['relationshipType']>,
  string
> = {
  unreviewed: 'Not Yet Reviewed',
  confirmed_integration: 'Confirmed Integration',
  ecosystem_project: 'Ecosystem Project',
  reference_project: 'Reference Project',
  watchlist: 'Watchlist',
};

const SOURCE_TYPE_LABELS: Record<ProjectSource['type'], string> = {
  official_doc: 'Official Docs',
  official_site: 'Official Site',
  github: 'GitHub',
  social: 'Social',
  other: 'Other',
};

export async function generateStaticParams() {
  const projects = await getEcosystemProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getEcosystemProjectBySlug(params.slug);

  if (!project) {
    return buildMetadata({ title: 'Project Not Found', path: `/ecosystem/${params.slug}` });
  }

  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/ecosystem/${params.slug}`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const [project, allProjects, categories, categoryColors] =
    await Promise.all([
      getEcosystemProjectBySlug(params.slug),
      getEcosystemProjects(),
      getEcosystemCategories(),
      getCategoryColors(),
    ]);

  if (!project) {
    notFound();
  }

  const category = categories.find(
    (entry) => entry.id === project.categoryId || entry.slug === project.categoryId,
  );
  const color = category
    ? categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3'
    : '#00FFA3';
  const sectorHref = category ? getEcosystemCategoryPath(category.slug) : '/ecosystem/categories';
  const relatedProjects = allProjects
    .filter(
      (entry) =>
        entry.slug !== project.slug &&
        (entry.categoryId === project.categoryId || entry.categoryId === category?.slug),
    )
    .slice(0, 3);

  const detailSections = (project.bodySections ?? []).filter((section) => section.body?.trim());
  const projectSources = buildProjectSources(project);
  const coverageGaps = getCoverageGaps(project, projectSources);
  const relationshipLabel = RELATIONSHIP_LABELS[project.relationshipType ?? 'unreviewed'];
  const normalizedWebsite = normalizeExternalUrl(project.website);
  const normalizedDocs = normalizeExternalUrl(project.docs);

  return (
    <KnowledgePageFrame
      eyebrow={`PROJECT // ${project.tag}`}
      title={project.title}
      summary={project.summary}
      statusLabel={getStatusLabel(project.status) || 'ACTIVE_RECORD'}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Sectors', href: '/ecosystem/categories' },
        ...(category ? [{ label: category.title, href: sectorHref }] : []),
        { label: project.title, href: `/ecosystem/${project.slug}` },
      ]}
      meta={
        <>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            RELATIONSHIP // {relationshipLabel}
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            REVIEWED // {formatReviewedDate(project.lastReviewed)}
          </div>
        </>
      }
    >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <div className="space-y-10">
            {coverageGaps.length > 0 && (
              <section className="rounded-[1.4rem] border border-amber-400/20 bg-amber-400/5 p-6 shadow-2xl backdrop-blur-sm">
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-300">
                  Editorial Coverage Note
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-on-surface-variant">
                  This record is live, but Atlas coverage is still incomplete. The gaps below should be filled before treating this page as a fully reviewed profile.
                </p>
                <ul className="mt-4 space-y-2 text-sm leading-7 text-on-surface-variant">
                  {coverageGaps.map((gap) => (
                    <li key={gap} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="console-window overflow-hidden">
               <div className="console-header flex items-center justify-between">
                 <span>Module_12: Project Overview</span>
                 <span className="uppercase tracking-widest text-[11px] font-bold" style={{ color }}>{project.status === 'sync_ok' ? 'ONLINE_STATUS' : 'SCAN_COMPLETE'}</span>
               </div>
               <div className="p-6 lg:p-10 space-y-8">
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between border-b border-outline-variant/20 pb-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    {project.logo && (
                      <div className="relative h-20 w-20 shrink-0 border border-outline-variant/30 bg-black p-4">
                        <Image src={project.logo} alt={project.title} fill className="object-contain p-2" />
                      </div>
                    )}
                    <div>
                      <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color }}>
                        {'//'} PROJECT_INFORMATION
                      </div>
                      <h2 className="font-space text-3xl font-black uppercase tracking-tight text-white mb-2">
                        {project.title}
                      </h2>
                      <div className="text-sm font-jetbrains text-on-surface-variant font-bold max-w-2xl italic leading-relaxed">
                        {project.summary}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[200px]">
                    {normalizedWebsite && (
                      <a
                        href={normalizedWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 border px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-all hover:bg-primary/10"
                        style={{ borderColor: color }}
                      >
                        Open Site <ExternalLink size={12} />
                      </a>
                    )}
                    {normalizedDocs && (
                      <a
                        href={normalizedDocs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 border border-outline-variant/30 bg-black/20 px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-outline transition-colors hover:border-outline-variant/50 hover:text-white"
                      >
                        Open Docs <BookOpenText size={12} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="max-w-4xl space-y-6 font-jetbrains text-sm leading-8 text-on-surface-variant/90 border-t border-outline-variant/10 pt-8">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">ENTITY_DESCRIPTION</div>
                  {renderParagraphs(project.description || project.summary)}
                </div>
               </div>
            </section>

            {detailSections.map((section, idx) => (
              <section key={section.title} className="console-window overflow-hidden">
                <div className="console-header">
                   <span>MODULE_13.{idx+1}: {section.title.toUpperCase()}</span>
                 </div>
                 <div className="p-6 lg:p-10">
                  <div className="max-w-4xl space-y-6 text-sm leading-8 text-on-surface-variant/90">
                    {renderParagraphs(section.body)}
                  </div>
                 </div>
              </section>
            ))}

            {relatedProjects.length > 0 && (
              <section className="console-window overflow-hidden">
                <div className="console-header">
                  <span>Module_14: Related Entities</span>
                </div>
                <div className="flex flex-col border border-outline-variant/30 bg-[#06080a]/50 m-6 lg:m-10">
                  <div className="hidden gap-4 border-b border-outline-variant/30 bg-surface-container/30 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/50 md:grid md:grid-cols-12">
                    <div className="col-span-4">Project_Identifier</div>
                    <div className="col-span-5">Summary_Log</div>
                    <div className="col-span-2">Sys_Status</div>
                    <div className="col-span-1 text-right">Action</div>
                  </div>
                  {relatedProjects.map((relatedProject) => (
                    <ProjectRow key={relatedProject.id} project={relatedProject} color={color} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-6 shadow-xl backdrop-blur-sm">
              <h2 className="mb-5 flex items-center gap-2 font-space text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">
                <ShieldCheck size={14} className="text-primary" /> Coverage_Profile
              </h2>
              <dl className="space-y-5 text-[11px]">
                <CoverageRow
                  label="Status"
                  value={getStatusLabel(project.status) || 'Active'}
                  accentColor={color}
                />
                <CoverageRow
                  label="Relationship"
                  value={relationshipLabel}
                />
                <CoverageRow
                  label="Sector"
                  value={category?.title ?? 'Unassigned'}
                  href={sectorHref}
                />
                <CoverageRow
                  label="Last Reviewed"
                  value={formatReviewedDate(project.lastReviewed)}
                  icon={<Calendar size={12} />}
                />
              </dl>

              {project.statusNote && (
                <div className="mt-6 rounded-[1rem] border border-outline-variant/20 bg-black/20 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                    Status Note
                  </div>
                  <p className="mt-3 text-[11px] leading-6 text-on-surface-variant">
                    {project.statusNote}
                  </p>
                </div>
              )}
            </div>

            <details className="group border border-outline-variant/30 bg-surface-container-lowest/50 p-6 shadow-xl backdrop-blur-sm [&_summary::-webkit-details-marker]:hidden">
              <summary className="cursor-pointer flex items-center justify-between font-space text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 outline-none hover:text-primary transition-colors">
                <span className="flex items-center gap-2"><Link2 size={14} className="text-primary" /> Socials_&_Engagement</span>
                <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
              </summary>

              <div className="mt-5 space-y-4">
                 {normalizedWebsite && (
                   <a
                     href={normalizedWebsite}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center justify-between group"
                   >
                     <span className="text-[11px] font-bold uppercase tracking-widest text-[#00ffa3] group-hover:underline">Website</span>
                     <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-[#00ffa3]" />
                   </a>
                 )}
                 {project.twitter && (
                   <a
                     href={project.twitter.startsWith('http') ? project.twitter : `https://x.com/${project.twitter.replace('@', '')}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center justify-between group"
                   >
                     <span className="text-[11px] font-bold uppercase tracking-widest text-[#00ffa3] group-hover:underline">Twitter_X</span>
                     <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-[#00ffa3]" />
                   </a>
                 )}
                 {project.discord && (
                   <a
                     href={normalizeExternalUrl(project.discord) ?? '#'}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center justify-between group"
                   >
                     <span className="text-[11px] font-bold uppercase tracking-widest text-[#00ffa3] group-hover:underline">Discord_Invite</span>
                     <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-[#00ffa3]" />
                   </a>
                 )}
                 {project.telegram && (
                   <a
                     href={normalizeExternalUrl(project.telegram) ?? '#'}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center justify-between group"
                   >
                     <span className="text-[11px] font-bold uppercase tracking-widest text-[#00ffa3] group-hover:underline">Telegram_Invite</span>
                     <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-[#00ffa3]" />
                   </a>
                 )}
                 {project.github && (
                   <a
                     href={normalizeExternalUrl(project.github) ?? '#'}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center justify-between group"
                   >
                     <span className="text-[11px] font-bold uppercase tracking-widest text-[#00ffa3] group-hover:underline">Github_Repo</span>
                     <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-[#00ffa3]" />
                   </a>
                 )}
              </div>
            </details>

            <details className="group border border-outline-variant/30 bg-surface-container-lowest/50 p-6 shadow-xl backdrop-blur-sm [&_summary::-webkit-details-marker]:hidden">
              <summary className="cursor-pointer flex items-center justify-between font-space text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 outline-none hover:text-primary transition-colors">
                <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-primary" /> Verified_Sources</span>
                <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-5">

              {projectSources.length > 0 ? (
                <div className="space-y-3">
                  {projectSources.map((source) => {
                    const href = normalizeExternalUrl(source.href) ?? source.href;

                    return (
                      <a
                        key={`${source.type}-${source.label}-${href}`}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start justify-between gap-4 rounded-[1rem] border border-outline-variant/20 bg-black/20 px-4 py-4 transition-colors hover:border-outline-variant/40 hover:bg-black/30 group"
                      >
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary group-hover:text-primary/80 transition-colors">
                            {SOURCE_TYPE_LABELS[source.type]}
                          </div>
                          <div className="mt-1 text-xs font-bold text-white">
                            {source.label}
                          </div>
                          {source.note && (
                            <p className="mt-2 text-[11px] leading-5 text-on-surface-variant/70">
                              {source.note}
                            </p>
                          )}
                        </div>
                        <ArrowUpRight size={14} className="mt-0.5 shrink-0 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs leading-6 text-on-surface-variant/60">
                  No reviewed source links have been added yet.
                </p>
              )}
              </div>
            </details>

            {project.metrics && project.metrics.length > 0 ? (
              <details className="group border border-outline-variant/30 bg-surface-container-lowest/50 p-6 shadow-xl backdrop-blur-sm [&_summary::-webkit-details-marker]:hidden">
                <summary className="cursor-pointer flex items-center justify-between font-space text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 outline-none hover:text-primary transition-colors">
                  <span className="flex items-center gap-2"><BarChart2 size={14} className="text-primary" /> Key_Metrics</span>
                  <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-6 grid gap-6">
                  {project.metrics.map((metric) => (
                    <div key={`${metric.label}-${metric.value}`} className="flex flex-col gap-1 border-l-2 border-primary/20 pl-4 py-1">
                      <div className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/50">
                        {metric.label}
                      </div>
                      <div className="font-space text-xl font-bold tracking-tight text-white">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ) : (
              <div className="border border-dashed border-outline-variant/25 bg-surface-container-lowest/40 p-6">
                <h2 className="mb-3 flex items-center gap-2 font-space text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">
                  <BarChart2 size={14} /> Metrics_Pending
                </h2>
                <p className="text-[11px] leading-6 text-on-surface-variant/50">
                  No metrics have been recorded for this profile yet.
                </p>
              </div>
            )}
            
          </aside>
        </div>
    </KnowledgePageFrame>
  );
}


function CoverageRow({
  label,
  value,
  href,
  icon,
  accentColor,
}: {
  label: string;
  value: string;
  href?: string;
  icon?: React.ReactNode;
  accentColor?: string;
}) {
  const valueNode = href ? (
    <Link href={href} className="transition-colors hover:text-primary">
      {value}
    </Link>
  ) : (
    value
  );

  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/50">
        {label}
      </dt>
      <dd
        className="flex items-center gap-2 text-right text-sm font-bold text-white"
        style={accentColor && label === 'Status' ? { color: accentColor } : undefined}
      >
        {icon}
        <span>{valueNode}</span>
      </dd>
    </div>
  );
}

function renderParagraphs(body: string) {
  return body
    .split(/\n{2,}/)
    .filter((paragraph) => paragraph.trim().length > 0)
    .map((paragraph, index) => <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>);
}

function normalizeExternalUrl(url?: string | null) {
  if (!url) {
    return null;
  }

  return url.startsWith('http') ? url : `https://${url}`;
}

function buildProjectSources(project: EcosystemProjectRecord): ProjectSource[] {
  const combined: ProjectSource[] = [...(project.sources ?? [])];

  const docs = normalizeExternalUrl(project.docs);
  const website = normalizeExternalUrl(project.website);
  const github = normalizeExternalUrl(project.github);
  const twitter = normalizeExternalUrl(project.twitter);

  if (docs) {
    combined.push({
      label: 'Project Docs',
      href: docs,
      type: 'official_doc',
      note: 'Linked from the project record.',
    });
  }

  if (website) {
    combined.push({
      label: 'Official Website',
      href: website,
      type: 'official_site',
      note: 'Primary external project link.',
    });
  }

  if (github) {
    combined.push({
      label: 'GitHub',
      href: github,
      type: 'github',
      note: 'Repository or organization profile.',
    });
  }

  if (twitter) {
    combined.push({
      label: 'X / Twitter',
      href: twitter,
      type: 'social',
      note: 'Social or announcement channel.',
    });
  }

  const seen = new Set<string>();

  return combined.filter((source) => {
    const normalizedHref = normalizeExternalUrl(source.href) ?? source.href;

    if (seen.has(normalizedHref)) {
      return false;
    }

    seen.add(normalizedHref);
    return true;
  });
}

function getCoverageGaps(project: EcosystemProjectRecord, sources: ProjectSource[]) {
  const gaps: string[] = [];

  if ((!project.description || project.description.trim().length === 0) && !(project.bodySections ?? []).length) {
    gaps.push('Long-form editorial notes have not been added yet.');
  }

  if (!project.metrics || project.metrics.length === 0) {
    gaps.push('Key metrics are still missing.');
  }

  if (sources.length === 0) {
    gaps.push('Reviewed source links have not been added yet.');
  }

  if (!project.relationshipType || project.relationshipType === 'unreviewed') {
    gaps.push('Relationship type has not been reviewed.');
  }

  if (!project.lastReviewed) {
    gaps.push('Last reviewed date has not been recorded.');
  }

  return gaps;
}

function formatReviewedDate(value?: string) {
  if (!value) {
    return 'Not recorded';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function getStatusLabel(status: EcosystemProjectRecord['status']) {
  switch (status) {
    case 'sync_ok':
      return 'Online';
    case 'coming_soon':
      return 'Coming Soon';
    case 'maintenance':
      return 'Maintenance';
    case 'deprecated':
      return 'Deprecated';
    case 'testing':
      return 'Testing';
  }
}


