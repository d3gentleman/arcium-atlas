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

export interface ProjectSource {
  label: string;
  href: string;
  type: 'official_doc' | 'official_site' | 'github' | 'social' | 'other';
  note?: string;
}

export interface EcosystemCategoryRecord {
  id: string;
  slug: string;
  title: string;
  tag: string;
  summary: string;
  bodySections: BodySection[];
  prefix?: string;
  description?: string;
}


export interface EcosystemProjectRecord {
  id: string;
  slug: string;
  title: string;
  tag: string;
  summary: string;
  description?: string;
  bodySections?: BodySection[];
  logo?: string;
  website?: string;
  docs?: string;
  twitter?: string;
  github?: string;
  email?: string;
  discord?: string;
  telegram?: string;
  relationshipType?: 'unreviewed' | 'confirmed_integration' | 'ecosystem_project' | 'reference_project' | 'watchlist';
  statusNote?: string;
  lastReviewed?: string;
  sources?: ProjectSource[];
  status: 'sync_ok' | 'coming_soon' | 'maintenance' | 'deprecated' | 'testing';
  categoryId: string;
  isFeatured: boolean;
  metrics?: { label: string; value: string }[];
}

export type DiscoveryItemKind = 'core' | 'project' | 'category';

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
