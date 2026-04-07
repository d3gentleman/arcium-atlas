import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart2,
  BookOpenText,
  Calendar,
  ExternalLink,
  FolderTree,
  Github,
  Link2,
  ShieldCheck,
  Twitter,
} from 'lucide-react';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import ProjectRow from '@/components/ProjectRow';
import {
  getCategoryColors,
  getEcosystemCategories,
  getEcosystemCategoryPath,
  getEcosystemProjectBySlug,
  getEcosystemProjects,
  getFooterConfig,
  getNavigation,
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

const CONFIDENCE_LABELS: Record<
  NonNullable<EcosystemProjectRecord['confidence']>,
  string
> = {
  unreviewed: 'Unreviewed',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
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
  const [project, allProjects, navLinks, footerConfig, categories, categoryColors] =
    await Promise.all([
      getEcosystemProjectBySlug(params.slug),
      getEcosystemProjects(),
      getNavigation(),
      getFooterConfig(),
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
  const territoryHref = category ? getEcosystemCategoryPath(category.slug) : '/ecosystem/categories';
  const relatedProjects = allProjects
    .filter(
      (entry) =>
        entry.slug !== project.slug &&
        (entry.categoryId === project.categoryId || entry.categoryId === category?.slug),
    )
    .slice(0, 3);

  const overview = project.description || project.summary;
  const detailSections = (project.bodySections ?? []).filter((section) => section.body?.trim());
  const projectSources = buildProjectSources(project);
  const coverageGaps = getCoverageGaps(project, projectSources);
  const relationshipLabel = RELATIONSHIP_LABELS[project.relationshipType ?? 'unreviewed'];
  const confidenceLabel = CONFIDENCE_LABELS[project.confidence ?? 'unreviewed'];
  const normalizedWebsite = normalizeExternalUrl(project.website);
  const normalizedDocs = normalizeExternalUrl(project.docs);

  return (
    <div className="col-span-12 flex min-h-screen flex-col bg-background text-on-surface selection:bg-primary/30">
      <NavBar links={navLinks} />

      <main className="container mx-auto flex-1 space-y-10 px-4 py-10 md:px-8 md:py-12">
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          <Link
            href="/ecosystem"
            className="inline-flex items-center gap-2 transition-colors hover:text-primary"
          >
            <ArrowLeft size={14} /> Back to Directory
          </Link>
          <span className="opacity-30">/</span>
          <Link
            href={territoryHref}
            className="inline-flex items-center gap-2 transition-colors hover:text-primary"
          >
            <FolderTree size={14} />
            {category ? `View ${category.title}` : 'View Territories'}
          </Link>
        </div>

        <header
          className="relative overflow-hidden border border-outline-variant/30 bg-surface-container-low/50 p-8 shadow-[0_0_40px_rgba(var(--project-color-rgb),0.05)] md:p-12"
          style={{ '--project-color-rgb': hexToRgb(color) } as CSSProperties}
        >
          <div className="absolute left-0 top-0 h-full w-2" style={{ backgroundColor: color }} />
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at top right, ${color}14, transparent 35%)`,
            }}
          />

          <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-4xl space-y-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                {project.logo && (
                  <div className="relative h-20 w-20 shrink-0 border border-outline-variant/30 bg-black p-4 md:h-24 md:w-24">
                    <Image src={project.logo} alt={project.title} fill className="object-contain p-2" />
                  </div>
                )}

                <div>
                  <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color }}>
                    {'//'} {project.tag}
                  </div>
                  <h1 className="font-space text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
                    {project.title}
                  </h1>
                </div>
              </div>

              <p className="max-w-3xl text-base leading-8 text-on-surface-variant">
                {project.summary}
              </p>

              <div className="flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-[0.18em]">
                {category && (
                  <Link
                    href={territoryHref}
                    className="rounded-full border border-outline-variant/25 bg-black/20 px-4 py-2 text-outline transition-colors hover:border-primary/30 hover:text-white"
                  >
                    Territory // {category.title}
                  </Link>
                )}
                <div className="rounded-full border border-outline-variant/25 bg-black/20 px-4 py-2 text-outline">
                  Relationship // {relationshipLabel}
                </div>
                <div className="rounded-full border border-outline-variant/25 bg-black/20 px-4 py-2 text-outline">
                  Confidence // {confidenceLabel}
                </div>
                <div className="rounded-full border border-outline-variant/25 bg-black/20 px-4 py-2 text-outline">
                  Reviewed // {formatReviewedDate(project.lastReviewed)}
                </div>
              </div>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-3">
              {normalizedWebsite && (
                <a
                  href={normalizedWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white transition-all hover:bg-primary/10"
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
                  className="inline-flex items-center justify-center gap-2 border border-outline-variant/30 bg-black/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-outline transition-colors hover:border-outline-variant/50 hover:text-white"
                >
                  Open Docs <BookOpenText size={14} />
                </a>
              )}

              <div className="mt-2 flex items-center gap-4 text-on-surface-variant/60">
                {project.twitter && (
                  <a
                    href={project.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-white"
                    aria-label={`${project.title} on X`}
                  >
                    <Twitter size={18} />
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-white"
                    aria-label={`${project.title} on GitHub`}
                  >
                    <Github size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {coverageGaps.length > 0 && (
          <section className="rounded-[1.4rem] border border-amber-400/20 bg-amber-400/5 p-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300">
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <div className="space-y-10">
            <section className="space-y-6">
              <SectionHeading color={color} title="Project_Overview" />
              <div className="max-w-3xl space-y-6 font-jetbrains text-sm leading-7 text-on-surface-variant/90">
                {renderParagraphs(overview)}
              </div>
            </section>

            {detailSections.map((section) => (
              <section key={section.title} id={toSectionId(section.title)} className="space-y-6 scroll-mt-24">
                <SectionHeading color={color} title={section.title} />
                <div className="max-w-3xl space-y-6 text-sm leading-7 text-on-surface-variant/90">
                  {renderParagraphs(section.body)}
                </div>
              </section>
            ))}

            {relatedProjects.length > 0 && (
              <section className="space-y-6">
                <SectionHeading color={color} title="Related_Projects" />
                <div className="flex flex-col border border-outline-variant/30 bg-[#06080a]/50">
                  <div className="hidden gap-4 border-b border-outline-variant/30 bg-surface-container/30 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 md:grid md:grid-cols-12">
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
            <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-6">
              <h2 className="mb-5 flex items-center gap-2 font-space text-sm font-bold uppercase tracking-widest text-on-surface-variant/60">
                <ShieldCheck size={16} /> Coverage_Profile
              </h2>
              <dl className="space-y-5 text-sm">
                <CoverageRow
                  label="Status"
                  value={getStatusLabel(project.status)}
                  accentColor={color}
                />
                <CoverageRow
                  label="Relationship"
                  value={relationshipLabel}
                />
                <CoverageRow
                  label="Confidence"
                  value={confidenceLabel}
                />
                <CoverageRow
                  label="Territory"
                  value={category?.title ?? 'Unassigned'}
                  href={territoryHref}
                />
                <CoverageRow
                  label="Last Reviewed"
                  value={formatReviewedDate(project.lastReviewed)}
                  icon={<Calendar size={14} />}
                />
              </dl>

              {project.statusNote && (
                <div className="mt-6 rounded-[1rem] border border-outline-variant/20 bg-black/20 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    Status Note
                  </div>
                  <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                    {project.statusNote}
                  </p>
                </div>
              )}
            </div>

            <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-6">
              <h2 className="mb-5 flex items-center gap-2 font-space text-sm font-bold uppercase tracking-widest text-on-surface-variant/60">
                <Link2 size={16} /> Source_Links
              </h2>

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
                        className="flex items-start justify-between gap-4 rounded-[1rem] border border-outline-variant/20 bg-black/20 px-4 py-4 transition-colors hover:border-outline-variant/35 hover:bg-black/30"
                      >
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                            {SOURCE_TYPE_LABELS[source.type]}
                          </div>
                          <div className="mt-1 text-sm font-bold text-white">
                            {source.label}
                          </div>
                          {source.note && (
                            <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                              {source.note}
                            </p>
                          )}
                        </div>
                        <ArrowUpRight size={16} className="mt-1 shrink-0 text-on-surface-variant/60" />
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm leading-7 text-on-surface-variant">
                  No reviewed source links have been added yet. Add official documentation, project announcements, or repository references before promoting this profile.
                </p>
              )}
            </div>

            {project.metrics && project.metrics.length > 0 ? (
              <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-6">
                <h2 className="mb-6 flex items-center gap-2 font-space text-sm font-bold uppercase tracking-widest text-on-surface-variant/60">
                  <BarChart2 size={16} /> Key_Metrics
                </h2>
                <div className="space-y-6">
                  {project.metrics.map((metric) => (
                    <div key={`${metric.label}-${metric.value}`} className="flex flex-col gap-1">
                      <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
                        {metric.label}
                      </div>
                      <div className="font-space text-2xl font-bold tracking-tight text-white">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-outline-variant/25 bg-surface-container-lowest/40 p-6">
                <h2 className="mb-3 flex items-center gap-2 font-space text-sm font-bold uppercase tracking-widest text-on-surface-variant/60">
                  <BarChart2 size={16} /> Metrics_Pending
                </h2>
                <p className="text-sm leading-7 text-on-surface-variant">
                  No metrics have been added for this record yet. Add two to four concrete datapoints once the page has reviewed sources.
                </p>
              </div>
            )}
          </aside>
        </div>
      </main>

      <Footer config={footerConfig} />
    </div>
  );
}

function SectionHeading({ color, title }: { color: string; title: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
      <div className="h-2 w-2 shadow-[0_0_8px_currentColor]" style={{ backgroundColor: color, color }} />
      <h2 className="font-space text-xl font-bold uppercase tracking-widest text-white">
        {title}
      </h2>
    </div>
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
      <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/50">
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

  if (!project.confidence || project.confidence === 'unreviewed') {
    gaps.push('Editorial confidence has not been set.');
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

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '47, 230, 166';
}

function toSectionId(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
