import Hero from '@/components/Hero';
import SectorRadar from '@/components/SectorRadar';
import FeaturedSpotlight from '@/components/FeaturedSpotlight';
import DirectoryLaunchCTA from '@/components/DirectoryLaunchCTA';
import PublicPageShell from '@/components/PublicPageShell';
import RegistryPulse from '@/components/RegistryPulse';
import {
  getEcosystemProjects,
  getEcosystemCategories,
  getHomepageConfig,
  getCategoryColors,
} from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  path: '/',
  title: 'Ecosystem Hub | Arcium Atlas',
});

export default async function Home() {
  const [
    homepage,
    projects,
    categories,
    categoryColors,
  ] = await Promise.all([
    getHomepageConfig(),
    getEcosystemProjects(),
    getEcosystemCategories(),
    getCategoryColors(),
  ]);

  const liveStatusFeed = [
    {
      status: 'LIVE',
      text: `${projects.length} public builder records currently mapped`,
    },
    {
      status: 'MAP',
      text: `${categories.filter((category) => projects.some((project) => project.categoryId === category.id || project.categoryId === category.slug)).length} sectors with published builder coverage`,
    },
    {
      status: 'WATCH',
      text: `${categories.filter((category) => !projects.some((project) => project.categoryId === category.id || project.categoryId === category.slug)).length} sectors still filling in`,
    },
  ];

  const featuredProjects = projects.filter(p => p.isFeatured);

  return (
    <PublicPageShell mainClassName="space-y-16 pb-16 md:pb-20">
        <Hero
          hero={homepage.hero}
          quickLinks={homepage.quickLinks}
          liveStatusFeed={liveStatusFeed}
        />

        <section className="col-span-12 border-t border-outline-variant/30">
          <RegistryPulse projects={projects} categories={categories} />
        </section>

        <section className="col-span-12">
          <SectorRadar 
            categories={categories}
            projects={projects}
            categoryColors={categoryColors}
          />
        </section>

        <section className="col-span-12">
          <FeaturedSpotlight projects={featuredProjects} />
        </section>

        <section className="col-span-12">
          <DirectoryLaunchCTA />
        </section>
    </PublicPageShell>
  );
}
