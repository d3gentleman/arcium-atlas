import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '@/keystatic.config';
import {
  EcosystemCategoryRecord,
  EcosystemProjectRecord,
  NavigationLink,
  FooterConfig,
  UIConfig,
  DiscoveryItem,
  BodySection,
  ProjectSource
} from '../types/domain';
import { 
  CATEGORY_COLORS, 
  NAVIGATION_CONFIG, 
  FOOTER_CONFIG, 
  UI_STRINGS, 
  HOMEPAGE_CONFIG 
} from './config';
import { db } from '@/lib/db';
import { submissions, ecosystemProjects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const reader = createReader(process.cwd(), keystaticConfig);

/**
 * Utility to convert string to URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
}

function sortEcosystemCategories(records: EcosystemCategoryRecord[]): EcosystemCategoryRecord[] {
  return [...records].sort((left, right) => {
    const leftPrefix = Number.parseInt(left.prefix || '', 10);
    const rightPrefix = Number.parseInt(right.prefix || '', 10);

    if (Number.isNaN(leftPrefix) && Number.isNaN(rightPrefix)) {
      return left.title.localeCompare(right.title);
    }

    if (Number.isNaN(leftPrefix)) {
      return 1;
    }

    if (Number.isNaN(rightPrefix)) {
      return -1;
    }

    return leftPrefix - rightPrefix;
  });
}

// --- ECOSYSTEM ---

export async function getEcosystemCategories(): Promise<EcosystemCategoryRecord[]> {
  const categories = await reader.collections.ecosystemCategories.all();
  return sortEcosystemCategories(categories.map(cat => ({
    ...cat.entry,
    slug: cat.slug,
  })) as EcosystemCategoryRecord[]);
}

export async function getEcosystemCategoryBySlug(slug: string): Promise<EcosystemCategoryRecord | null> {
  const category = await reader.collections.ecosystemCategories.read(slug);
  if (!category) return null;
  return { ...category, slug } as EcosystemCategoryRecord;
}

export async function getEcosystemProjects(): Promise<EcosystemProjectRecord[]> {
  // ── APPROVED DB PROJECTS (Legacy Submissions) ──
  let dbSubmissions: EcosystemProjectRecord[] = [];
  try {
    const approvedEntries = await db
      .select()
      .from(submissions)
      .where(eq(submissions.status, 'approved'));

    dbSubmissions = approvedEntries.map(entry => ({
      id: `sub-${entry.id}`,
      slug: slugify(entry.projectName),
      title: entry.projectName,
      tag: entry.arciumRole || 'BUILDER',
      summary: entry.projectSummary,
      logo: entry.logoUrl || undefined,
      website: entry.website || undefined,
      twitter: entry.projectTwitter || undefined,
      email: entry.projectEmail || undefined,
      discord: entry.discordInvite || undefined,
      telegram: entry.telegramInvite || undefined,
      categoryId: entry.category,
      isFeatured: false,
      status: 'sync_ok',
      relationshipType: 'ecosystem_project',
      description: entry.additionalContext || undefined,
    } as EcosystemProjectRecord));
  } catch (err) {
    console.error('[lib/content] Failed to fetch approved submissions:', err);
  }

  // ── STAFF MANAGED PROJECTS (Postgres) ──────────
  let managedProjects: EcosystemProjectRecord[] = [];
  try {
    const entries = await db
      .select()
      .from(ecosystemProjects);

    managedProjects = entries.map(entry => ({
      ...entry,
      id: `db-${entry.id}`,
      logo: entry.logoUrl || undefined,
      website: entry.website || undefined,
      docs: entry.docs || undefined,
      twitter: entry.twitter || undefined,
      github: entry.github || undefined,
      email: entry.projectEmail || undefined,
      discord: entry.discordInvite || undefined,
      telegram: entry.telegramInvite || undefined,
      bodySections: entry.bodySections as BodySection[],
      metrics: entry.metrics as { label: string; value: string }[],
      sources: entry.sources as ProjectSource[],
      relationshipType: (entry.relationshipType as EcosystemProjectRecord['relationshipType']) || 'ecosystem_project',
      status: (entry.status as EcosystemProjectRecord['status']) || 'sync_ok',
    } as EcosystemProjectRecord));
  } catch (err) {
    console.error('[lib/content] Failed to fetch staff managed projects:', err);
  }

  const allProjects = [...dbSubmissions, ...managedProjects];
  const seenTitles = new Set<string>();

  return allProjects.filter((project) => {
    const normalizedTitle = project.title.trim().toLowerCase();

    if (seenTitles.has(normalizedTitle)) {
      return false;
    }

    seenTitles.add(normalizedTitle);
    return true;
  });
}

export async function getEcosystemProjectBySlug(slug: string): Promise<EcosystemProjectRecord | null> {
  // Try DB
  const allProjects = await getEcosystemProjects();
  return allProjects.find(p => p.slug === slug) || null;
}

// --- AGGREGATORS & SEARCH ---

export async function getDiscoveryIndex(): Promise<DiscoveryItem[]> {
  const [ecoCategories, projects] = await Promise.all([
    getEcosystemCategories(),
    getEcosystemProjects()
  ]);

  const mappedEcoCategories: DiscoveryItem[] = ecoCategories.map(c => ({
    id: c.id || c.slug,
    kind: 'category',
    title: c.title,
    href: getEcosystemCategoryPath(c.slug),
    summary: c.summary || '',
    tag: c.tag || 'ECOSYSTEM',
    eyebrow: c.prefix || 'SECTOR',
    priority: 'high',
    featured: false,
    keywords: []
  }));

  const mappedProjects: DiscoveryItem[] = projects.map(p => ({
    id: p.id || p.slug,
    kind: 'project',
    title: p.title,
    href: `/ecosystem/${p.slug}`,
    summary: p.summary || '',
    tag: p.tag || 'BUILDER',
    eyebrow: 'ECOSYSTEM',
    priority: 'medium',
    featured: Boolean(p.isFeatured),
    keywords: []
  }));

  return [
    ...mappedEcoCategories,
    ...mappedProjects
  ];
}

// --- CONFIG & UI ---

export async function getNavigation(): Promise<NavigationLink[]> {
  return NAVIGATION_CONFIG;
}

export async function getFooterConfig(): Promise<FooterConfig> {
  return FOOTER_CONFIG;
}

export async function getUIConfig(): Promise<UIConfig> {
  return UI_STRINGS;
}

export async function getCategoryColors(): Promise<Record<string, string>> {
  return CATEGORY_COLORS;
}

export async function getHomepageConfig() {
  return HOMEPAGE_CONFIG;
}

export async function getFeaturedProjects(count?: number): Promise<EcosystemProjectRecord[]> {
  const projects = await getEcosystemProjects();
  const featuredProjects = projects.filter((project) => project.isFeatured);

  if (count) {
    return featuredProjects.slice(0, count);
  }

  return featuredProjects;
}

// --- PATH HELPERS ---

export function getEcosystemCategoryPath(slug: string): string {
  return `/ecosystem/categories/${slug}`;
}
