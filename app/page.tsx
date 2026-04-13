import Hero from '@/components/Hero';
import SectorRadar from '@/components/SectorRadar';
import DirectoryLaunchCTA from '@/components/DirectoryLaunchCTA';
import PublicPageShell from '@/components/PublicPageShell';
import RecentProjectUpdates from '@/components/RecentProjectUpdates';
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

  // Proof strip data
  const lastUpdatedTs = Math.max(
    ...projects.map(p => Date.parse(p.updatedAt || p.createdAt || '') || 0)
  );
  const lastUpdated = lastUpdatedTs > 0
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(lastUpdatedTs)
    : 'N/A';

  return (
    <PublicPageShell mainClassName="pb-16 md:pb-20">
        <Hero
          hero={homepage.hero}
          sectorCount={categories.length}
          projectCount={projects.length}
          lastUpdated={lastUpdated}
        />

        <section>
          <SectorRadar 
            categories={categories}
            projects={projects}
            categoryColors={categoryColors}
          />
        </section>

        <section>
          <RecentProjectUpdates
            projects={projects}
            categories={categories}
            categoryColors={categoryColors}
          />
        </section>

        <section>
          <DirectoryLaunchCTA />
        </section>
    </PublicPageShell>
  );
}
