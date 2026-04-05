import type { MetadataRoute } from 'next';
import {
  getEcosystemCategories,
  getKnowledgeArticles,
  getKnowledgeCategories,
} from '@/lib/content';
import { getSiteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [knowledgeCategories, knowledgeArticles, ecosystemCategories] = await Promise.all([
    getKnowledgeCategories(),
    getKnowledgeArticles(),
    getEcosystemCategories(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/ecosystem',
    '/encyclopedia',
    '/glossary',
  ].map((path) => ({
    url: `${siteUrl}${path || '/'}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));

  const knowledgeCategoryRoutes = knowledgeCategories.map((category) => ({
    url: `${siteUrl}/encyclopedia/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const knowledgeArticleRoutes = knowledgeArticles.map((article) => ({
    url: `${siteUrl}/encyclopedia/articles/${article.slug}`,
    lastModified: article.date ? new Date(article.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const ecosystemCategoryRoutes = ecosystemCategories.map((category) => ({
    url: `${siteUrl}/ecosystem/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...knowledgeCategoryRoutes,
    ...knowledgeArticleRoutes,
    ...ecosystemCategoryRoutes,
  ];
}
