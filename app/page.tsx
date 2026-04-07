import Hero from '@/components/Hero';
import EcosystemDirectory from '@/components/EcosystemDirectory';
import PublicPageShell from '@/components/PublicPageShell';
import Marquee from 'react-fast-marquee';
import {
  getEcosystemProjects,
  getEcosystemCategories,
  getHomepageConfig,
  getCategoryColors,
} from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import Image from 'next/image';

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
      text: `${categories.filter((category) => projects.some((project) => project.categoryId === category.id || project.categoryId === category.slug)).length} territories with published builder coverage`,
    },
    {
      status: 'WATCH',
      text: `${categories.filter((category) => !projects.some((project) => project.categoryId === category.id || project.categoryId === category.slug)).length} territories still filling in`,
    },
  ];

  const marqueeProjects = projects.filter(p => p.logo);

  return (
    <PublicPageShell mainClassName="space-y-16 pb-16 md:pb-20">
        <Hero
          hero={homepage.hero}
          quickLinks={homepage.quickLinks}
          liveStatusFeed={liveStatusFeed}
        />

        {marqueeProjects.length > 0 && (
          <section className="col-span-12 border-y border-outline-variant/30 bg-surface-container-low/50 py-6">
             <Marquee gradient={true} gradientColor="#000000" speed={40} autoFill={true}>
               {marqueeProjects.map((project, idx) => (
                 <div key={project.id + idx} className="mx-12 flex items-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
                   <div className="relative h-10 w-10">
                     <Image src={project.logo!} alt={project.title} fill className="object-contain" />
                   </div>
                   <span className="font-space font-bold uppercase tracking-widest text-sm text-white">{project.title}</span>
                 </div>
               ))}
             </Marquee>
          </section>
        )}

        <section className="col-span-12">
          <EcosystemDirectory 
            categories={categories} 
            projects={projects} 
            categoryColors={categoryColors} 
          />
        </section>
    </PublicPageShell>
  );
}
