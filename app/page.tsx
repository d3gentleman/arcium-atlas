import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import NavBar from '@/components/NavBar';
import EcosystemDirectory from '@/components/EcosystemDirectory';
import Marquee from 'react-fast-marquee';
import {
  getEcosystemProjects,
  getEcosystemCategories,
  getFooterConfig,
  getHomepageConfig,
  getNavigation,
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
    navLinks,
    homepage,
    footerConfig,
    projects,
    categories,
    categoryColors,
  ] = await Promise.all([
    getNavigation(),
    getHomepageConfig(),
    getFooterConfig(),
    getEcosystemProjects(),
    getEcosystemCategories(),
    getCategoryColors(),
  ]);

  const liveStatusFeed = [
    { status: 'LIVE', text: `${projects.length} curated ecosystem records mapped to territories` },
  ];

  const marqueeProjects = projects.filter(p => p.logo);

  return (
    <>
      <NavBar links={navLinks} />
      
      <main className="col-span-12 space-y-16 pb-16">
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
                     <Image src={project.logo!} alt={project.title} fill className="object-contain filter grayscale invert" />
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
        
      </main>

      <Footer config={footerConfig} />
    </>
  );
}
