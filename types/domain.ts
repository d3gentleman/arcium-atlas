export type LinkAction = 
  | { type: 'internal'; label: string; href: string }
  | { type: 'external'; label: string; href: string }
  | { type: 'command'; label: string; command: string }
  | { type: 'unavailable'; label: string; reason: string };

export type NavigationLink = LinkAction;

export interface FooterConfig {
  links: LinkAction[];
  metadata: {
    copyright: string;
    coords: string;
    mission: string;
  };
}

export interface UIConfig {
  [key: string]: string;
}

export interface BodySection {
  title: string;
  body: string;
}

export interface KnowledgeCategoryRecord {
  id: string;
  slug: string;
  title: string;
  tag: string;
  summary: string;
  bodySections: BodySection[];
  prefix?: string;
  description?: string;
  group?: 'knowledge' | 'ecosystem';
}

export interface KnowledgeArticleRecord {
  id: string;
  slug: string;
  title: string;
  tag: string;
  summary: string;
  bodySections: BodySection[];
  kind: 'guide' | 'update' | 'article';
  date?: string;
  relatedCategoryId: string;
}

export interface GlossaryTermRecord {
  id: string;
  slug: string;
  term: string;
  tag: string;
  summary: string;
  aliases?: string[];
  keywords?: string[];
  priority: 'high' | 'medium' | 'low';
  source?: {
    label: string;
    href: string;
  };
  relatedCategoryIds: string[];
}

export interface EcosystemProjectRecord {
  id: string;
  slug: string;
  title: string;
  tag: string;
  summary: string;
  logo?: string;
  website?: string;
  status: 'sync_ok' | 'coming_soon' | 'maintenance';
  categoryId: string;
  isFeatured: boolean;
}

export type DiscoveryItemKind = 'core' | 'project' | 'category' | 'glossary' | 'article';

export interface DiscoveryItem {
  id: string;
  kind: DiscoveryItemKind;
  title: string;
  summary: string;
  tag: string;
  href: string;
  eyebrow: string;
  priority: 'high' | 'medium' | 'low';
  featured: boolean;
  keywords: string[];
}
