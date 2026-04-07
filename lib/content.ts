import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '@/keystatic.config';
import {
  EcosystemCategoryRecord,
  EcosystemProjectRecord,
  NavigationLink,
  FooterConfig,
  UIConfig,
  DiscoveryItem
} from '../types/domain';
import { 
  CATEGORY_COLORS, 
  NAVIGATION_CONFIG, 
  FOOTER_CONFIG, 
  UI_STRINGS, 
  HOMEPAGE_CONFIG 
} from './config';

const reader = createReader(process.cwd(), keystaticConfig);

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
  const projects = await reader.collections.ecosystemProjects.all();
  const mappedProjects = projects.map(p => ({
    ...p.entry,
    slug: p.slug,
  })) as EcosystemProjectRecord[];

  const seenTitles = new Set<string>();

  return mappedProjects.filter((project) => {
    const normalizedTitle = project.title.trim().toLowerCase();

    if (seenTitles.has(normalizedTitle)) {
      return false;
    }

    seenTitles.add(normalizedTitle);
    return true;
  });
}

export async function getEcosystemProjectBySlug(slug: string): Promise<EcosystemProjectRecord | null> {
  const project = await reader.collections.ecosystemProjects.read(slug);
  if (!project) return null;
  return { ...project, slug } as EcosystemProjectRecord;
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
