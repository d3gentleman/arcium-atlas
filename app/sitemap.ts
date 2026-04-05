import type { MetadataRoute } from 'next';
import {
  getEcosystemCategories,
  getEcosystemProjects,
} from '@/lib/content';
import { getSiteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [ecosystemCategories, ecosystemProjects] = await Promise.all([
    getEcosystemCategories(),
    getEcosystemProjects(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/ecosystem',
  ].map((path) => ({
    url: `${siteUrl}${path || '/'}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));

  const ecosystemCategoryRoutes = ecosystemCategories.map((category) => ({
    url: `${siteUrl}/ecosystem/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const ecosystemProjectRoutes = ecosystemProjects.map((project) => ({
    url: `${siteUrl}/ecosystem/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...ecosystemCategoryRoutes,
    ...ecosystemProjectRoutes
  ];
}
