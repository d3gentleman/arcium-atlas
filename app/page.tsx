import Hero from '@/components/Hero';
import StartHereSection from '@/components/StartHereSection';
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

  return (
    <PublicPageShell mainClassName="space-y-16 pb-16 md:pb-20">
        <Hero
          hero={homepage.hero}
        />

        <section className="col-span-12 -mt-4 mb-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <StartHereSection cards={homepage.startHere as any} />
        </section>

        <section className="col-span-12">
          <SectorRadar 
            categories={categories}
            projects={projects}
            categoryColors={categoryColors}
          />
        </section>

        <section className="col-span-12">
          <RecentProjectUpdates
            projects={projects}
            categories={categories}
            categoryColors={categoryColors}
          />
        </section>

        <section className="col-span-12">
          <DirectoryLaunchCTA />
        </section>
    </PublicPageShell>
  );
}
