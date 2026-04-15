import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ArrowUpRight,
  BarChart2,
  BookOpenText,
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

  const detailSections = (project.bodySections ?? []).filter((section) => 
    section.body?.trim() && section.title.toLowerCase() !== 'protocol surface'
  );
  const projectSources = buildProjectSources(project);
  const coverageGaps = getCoverageGaps(project, projectSources);
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
      logoNode={
        project.logo && (
          <div className="relative h-16 w-16 md:h-20 md:w-20 shrink-0 border border-outline-variant/30 bg-black/50 p-2 md:p-3 rounded-lg overflow-hidden">
            <Image src={project.logo} alt={project.title} fill className="object-contain p-2" />
          </div>
        )
      }
      meta={
        <div className="flex flex-col gap-3">
          {normalizedWebsite && (
            <a
              href={normalizedWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-6 text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={{ borderColor: color }}
            >
              Open Site <ExternalLink size={14} />
            </a>
          )}
          {normalizedDocs && (
            <a
              href={normalizedDocs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container/50 px-6 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant transition-colors hover:border-outline hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Open Docs <BookOpenText size={14} />
            </a>
          )}
        </div>
      }
    >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <div className="space-y-10">

            {coverageGaps.length > 0 && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-500/80 mb-2 flex items-center gap-2">
                  Editorial Coverage Note
                </div>
                <p className="max-w-prose text-[15px] leading-relaxed text-on-surface-variant">
                  This record is live, but Atlas coverage is still incomplete. The gaps below should be filled before treating this page as a fully reviewed profile.
                </p>
                <ul className="mt-4 space-y-2 text-[14px] leading-relaxed text-on-surface-variant/80">
                  {coverageGaps.map((gap) => (
                    <li key={gap} className="flex items-start gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-500/50" />
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {detailSections.map((section) => (
              <section key={section.title} className="console-window overflow-hidden">
                <div className="console-header">
                   <span>{section.title}</span>
                 </div>
                 <div className="p-6 lg:p-10">
                  <div className="max-w-prose space-y-6 text-[15px] leading-relaxed text-on-surface-variant/90 md:text-base">
                    {renderParagraphs(section.body)}
                  </div>
                 </div>
              </section>
            ))}

            {relatedProjects.length > 0 && (
              <section className="console-window overflow-hidden">
                <div className="console-header">
                  <span>Related Entities</span>
                </div>
                <div className="flex flex-col border border-outline-variant/30 bg-[#06080a]/50 m-6 lg:m-10">
                  <div className="hidden gap-4 border-b border-outline-variant/30 bg-surface-container/30 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/50 md:grid md:grid-cols-12">
                    <div className="col-span-4">Project</div>
                    <div className="col-span-5">Summary</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1 text-right">Action</div>
                  </div>
                  {relatedProjects.map((relatedProject) => (
                    <ProjectRow key={relatedProject.id} project={relatedProject} color={color} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6 lg:mt-0">
            {project.statusNote && (
              <div className="rounded-2xl border border-outline-variant/25 bg-black/20 p-6 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-outline mb-3">
                  <ShieldCheck size={14} className="text-primary/70" /> Status Note
                </div>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  {project.statusNote}
                </p>
              </div>
            )}

            {(project.twitter || project.discord || project.telegram) && (
              <details open className="group rounded-2xl border border-outline-variant/25 bg-black/20 p-6 shadow-sm backdrop-blur-sm [&_summary::-webkit-details-marker]:hidden">
                <summary className="cursor-pointer flex items-center justify-between font-space text-[11px] font-bold uppercase tracking-[0.2em] text-outline outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors rounded-sm">
                  <span className="flex items-center gap-2"><Link2 size={16} className="text-primary/70 transition-colors group-hover:text-primary" /> Socials & Engagement</span>
                  <span className="text-outline-variant transition-transform group-open:rotate-180 group-hover:text-primary">▼</span>
                </summary>

                <div className="mt-6 flex flex-col gap-4">
                   {project.twitter && (
                     <a
                       href={project.twitter.startsWith('http') ? project.twitter : `https://x.com/${project.twitter.replace('@', '')}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                     >
                       <span className="text-[11px] font-bold uppercase tracking-widest text-outline transition-colors group-hover:text-primary">X (Twitter)</span>
                       <ArrowUpRight size={14} className="text-outline-variant transition-colors group-hover:text-primary" />
                     </a>
                   )}
                   {project.discord && (
                     <a
                       href={normalizeExternalUrl(project.discord) ?? '#'}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                     >
                       <span className="text-[11px] font-bold uppercase tracking-widest text-outline transition-colors group-hover:text-primary">Discord</span>
                       <ArrowUpRight size={14} className="text-outline-variant transition-colors group-hover:text-primary" />
                     </a>
                   )}
                   {project.telegram && (
                     <a
                       href={normalizeExternalUrl(project.telegram) ?? '#'}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                     >
                       <span className="text-[11px] font-bold uppercase tracking-widest text-outline transition-colors group-hover:text-primary">Telegram</span>
                       <ArrowUpRight size={14} className="text-outline-variant transition-colors group-hover:text-primary" />
                     </a>
                   )}
                </div>
              </details>
            )}

            {projectSources.length > 0 && (
              <details className="group rounded-2xl border border-outline-variant/25 bg-black/20 p-6 shadow-sm backdrop-blur-sm [&_summary::-webkit-details-marker]:hidden">
                <summary className="cursor-pointer flex items-center justify-between font-space text-[11px] font-bold uppercase tracking-[0.2em] text-outline outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors rounded-sm">
                  <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-primary/70 transition-colors group-hover:text-primary" /> Verified Sources</span>
                  <span className="text-outline-variant transition-transform group-open:rotate-180 group-hover:text-primary">▼</span>
                </summary>
                <div className="mt-6 flex flex-col gap-3">
                    {projectSources.map((source) => {
                      const href = normalizeExternalUrl(source.href) ?? source.href;

                      return (
                        <a
                          key={`${source.type}-${source.label}-${href}`}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start justify-between gap-4 rounded-xl border border-outline-variant/20 bg-surface-container/20 px-4 py-4 transition-colors hover:border-outline-variant/40 hover:bg-surface-container/40 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        >
                          <div className="min-w-0">
                            <div className="text-[11px] font-bold uppercase tracking-widest text-primary/90 transition-colors mb-1 group-hover:text-primary">
                              {SOURCE_TYPE_LABELS[source.type]}
                            </div>
                            {source.label !== SOURCE_TYPE_LABELS[source.type] && (
                              <div className="text-xs font-bold text-white mb-1">
                                {source.label}
                              </div>
                            )}
                            {source.note && (
                              <p className="mt-1 text-xs leading-relaxed text-on-surface-variant/80">
                                {source.note}
                              </p>
                            )}
                          </div>
                          <ArrowUpRight size={14} className="mt-0.5 shrink-0 text-outline-variant transition-colors group-hover:text-primary" />
                        </a>
                      );
                    })}
                </div>
              </details>
            )}

            {project.metrics && project.metrics.length > 0 && (
              <details className="group rounded-2xl border border-outline-variant/25 bg-black/20 p-6 shadow-sm backdrop-blur-sm [&_summary::-webkit-details-marker]:hidden">
                <summary className="cursor-pointer flex items-center justify-between font-space text-[11px] font-bold uppercase tracking-[0.2em] text-outline outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors rounded-sm">
                  <span className="flex items-center gap-2"><BarChart2 size={16} className="text-primary/70 transition-colors group-hover:text-primary" /> Key Metrics</span>
                  <span className="text-outline-variant transition-transform group-open:rotate-180 group-hover:text-primary">▼</span>
                </summary>
                <div className="mt-6 grid gap-6">
                  {project.metrics.map((metric) => (
                    <div key={`${metric.label}-${metric.value}`} className="flex flex-col gap-1.5 border-l-2 border-primary/30 pl-4 py-1">
                      <div className="text-[11px] font-bold uppercase tracking-widest text-outline">
                        {metric.label}
                      </div>
                      <div className="font-space text-2xl font-bold tracking-tight text-white">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}
            
          </aside>
        </div>
    </KnowledgePageFrame>
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
  const sources: ProjectSource[] = [...(project.sources ?? [])];
  const seen = new Set<string>();

  return sources.filter((source) => {
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


