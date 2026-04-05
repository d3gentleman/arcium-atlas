import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '@/keystatic.config';
import {
  KnowledgeCategoryRecord, 
  EcosystemCategoryRecord,
  KnowledgeArticleRecord, 
  GlossaryTermRecord,
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

function sortByDateDescending<T extends { date?: string }>(records: T[]): T[] {
  return [...records].sort((left, right) => {
    const leftTime = left.date ? Date.parse(left.date) : Number.NEGATIVE_INFINITY;
    const rightTime = right.date ? Date.parse(right.date) : Number.NEGATIVE_INFINITY;

    if (Number.isNaN(leftTime) && Number.isNaN(rightTime)) {
      return 0;
    }

    if (Number.isNaN(leftTime)) {
      return 1;
    }

    if (Number.isNaN(rightTime)) {
      return -1;
    }

    return rightTime - leftTime;
  });
}

const KNOWLEDGE_CATEGORY_ORDER = [
  'enc-eco',
  'enc-mpc',
  'enc-infra',
  'enc-use-cases',
  'enc-dev',
  'enc-crypto',
];

function sortKnowledgeCategories(records: KnowledgeCategoryRecord[]): KnowledgeCategoryRecord[] {
  return [...records].sort((left, right) => {
    const leftIndex = KNOWLEDGE_CATEGORY_ORDER.indexOf(left.id);
    const rightIndex = KNOWLEDGE_CATEGORY_ORDER.indexOf(right.id);

    if (leftIndex === -1 && rightIndex === -1) {
      return left.title.localeCompare(right.title);
    }

    if (leftIndex === -1) {
      return 1;
    }

    if (rightIndex === -1) {
      return -1;
    }

    return leftIndex - rightIndex;
  });
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

// --- CATEGORIES ---

export async function getKnowledgeCategories(): Promise<KnowledgeCategoryRecord[]> {
  const categories = await reader.collections.knowledgeCategories.all();
  return sortKnowledgeCategories(categories.map(cat => ({
    ...cat.entry,
    slug: cat.slug,
  })) as KnowledgeCategoryRecord[]);
}

export async function getKnowledgeCategoryBySlug(slug: string): Promise<KnowledgeCategoryRecord | null> {
  const category = await reader.collections.knowledgeCategories.read(slug);
  if (!category) return null;
  return { ...category, slug } as KnowledgeCategoryRecord;
}

export async function getKnowledgeCategoryById(id: string): Promise<KnowledgeCategoryRecord | null> {
  const categories = await getKnowledgeCategories();
  return categories.find(c => c.id === id) || null;
}

// --- ARTICLES ---

export async function getKnowledgeArticles(): Promise<KnowledgeArticleRecord[]> {
  const articles = await reader.collections.knowledgeArticles.all();
  return sortByDateDescending(articles.map(art => ({
    ...art.entry,
    slug: art.slug,
  })) as KnowledgeArticleRecord[]);
}

export async function getKnowledgeArticleBySlug(slug: string): Promise<KnowledgeArticleRecord | null> {
  const article = await reader.collections.knowledgeArticles.read(slug);
  if (!article) return null;
  return { ...article, slug } as KnowledgeArticleRecord;
}

export async function getKnowledgeArticlesByCategoryId(categoryId: string | undefined): Promise<KnowledgeArticleRecord[]> {
  if (!categoryId) return [];
  const articles = await getKnowledgeArticles();
  const category = await getKnowledgeCategoryBySlug(categoryId) || await getKnowledgeCategoryById(categoryId);
  
  return articles.filter((article) => 
    article.relatedCategoryId === categoryId || 
    (category && article.relatedCategoryId === category.id) ||
    (category && article.relatedCategoryId === category.slug)
  );
}

// --- GLOSSARY ---

export async function getGlossaryTerms(): Promise<GlossaryTermRecord[]> {
  const terms = await reader.collections.glossaryTerms.all();
  return terms.map(t => ({
    ...t.entry,
    slug: t.slug,
  })) as GlossaryTermRecord[];
}

export async function getGlossaryTermBySlug(slug: string): Promise<GlossaryTermRecord | null> {
  const term = await reader.collections.glossaryTerms.read(slug);
  if (!term) return null;
  return { ...term, slug } as GlossaryTermRecord;
}

export async function getGlossaryTermsByCategoryId(categoryId: string): Promise<GlossaryTermRecord[]> {
  const terms = await getGlossaryTerms();
  return terms.filter((term) => (term.relatedCategoryIds || []).includes(categoryId));
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
  const [categories, ecoCategories, articles, terms, projects] = await Promise.all([
    getKnowledgeCategories(),
    getEcosystemCategories(),
    getKnowledgeArticles(),
    getGlossaryTerms(),
    getEcosystemProjects()
  ]);

  const mappedCategories: DiscoveryItem[] = categories.map(c => ({
    id: c.id || c.slug,
    slug: c.slug,
    title: c.title,
    href: getKnowledgeCategoryPath(c.slug),
    summary: c.summary || '',
    tag: c.tag || 'CATEGORY',
    eyebrow: c.prefix || 'KNOWLEDGE',
    kind: 'category',
    priority: 'medium',
    featured: false,
    keywords: []
  }));

  const mappedEcoCategories: DiscoveryItem[] = ecoCategories.map(c => ({
    id: c.id || c.slug,
    slug: c.slug,
    title: c.title,
    href: getEcosystemCategoryPath(c.slug),
    summary: c.summary || '',
    tag: c.tag || 'ECOSYSTEM',
    eyebrow: c.prefix || 'TERRITORY',
    kind: 'category',
    priority: 'high',
    featured: false,
    keywords: []
  }));

  const mappedArticles: DiscoveryItem[] = articles.map(a => ({
    id: a.id || a.slug,
    slug: a.slug,
    title: a.title,
    href: getKnowledgeArticlePath(a.slug),
    summary: a.summary || '',
    tag: a.tag || 'ARTICLE',
    eyebrow: a.tag || 'GUIDE',
    kind: 'article',
    priority: 'high',
    featured: a.kind === 'update',
    keywords: []
  }));

  const mappedTerms: DiscoveryItem[] = terms.map(t => ({
    id: t.id || t.slug,
    slug: t.slug,
    title: t.term,
    href: `/glossary#${t.slug}`,
    summary: t.summary || '',
    tag: t.tag || 'GLOSSARY',
    eyebrow: 'TERM',
    kind: 'glossary',
    priority: 'low',
    featured: false,
    keywords: t.keywords || []
  }));

  const mappedProjects: DiscoveryItem[] = projects.map(p => ({
    id: p.id || p.slug,
    slug: p.slug,
    title: p.title,
    href: '/ecosystem',
    summary: p.summary || '',
    tag: p.tag || 'BUILDER',
    eyebrow: 'ECOSYSTEM',
    kind: 'project',
    priority: 'medium',
    featured: Boolean(p.isFeatured),
    keywords: []
  }));

  return [
    ...mappedCategories,
    ...mappedEcoCategories,
    ...mappedArticles,
    ...mappedTerms,
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

export async function getRecentArticles(count: number = 3): Promise<KnowledgeArticleRecord[]> {
  const articles = await getKnowledgeArticles();
  return sortByDateDescending(articles).slice(0, count);
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

export function getKnowledgeArticlePath(slug: string): string {
  return `/encyclopedia/articles/${slug}`;
}

export function getKnowledgeCategoryPath(slug: string): string {
  return `/encyclopedia/categories/${slug}`;
}

export function getEcosystemCategoryPath(slug: string): string {
  return `/ecosystem/categories/${slug}`;
}
