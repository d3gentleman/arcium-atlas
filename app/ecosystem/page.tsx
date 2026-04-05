import { 
  getEcosystemCategories, 
  getEcosystemProjects, 
  getNavigation, 
  getFooterConfig,
  getCategoryColors
} from '@/lib/content';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import EcosystemDirectory from '@/components/EcosystemDirectory';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Ecosystem',
  description: 'A curated directory of projects and product categories across the Arcium ecosystem.',
  path: '/ecosystem',
});

export default async function EcosystemPage() {
  const ecosystemCategories = await getEcosystemCategories();
  const projects = await getEcosystemProjects();
  const navLinks = await getNavigation();
  const footerConfig = await getFooterConfig();
  const categoryColors = await getCategoryColors();

  return (
    <div className="col-span-12 flex min-h-screen flex-col bg-background text-on-surface">
      <NavBar links={navLinks} />
      
      <main className="container mx-auto flex-1 px-4 py-12 md:px-8">
        <header className="mb-16 max-w-2xl">
          <div className="mb-4 inline-flex border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
            CURATED_DIRECTORY
          </div>
          <h1 className="mb-6 font-space text-5xl font-black uppercase tracking-tight text-white md:text-6xl">
            Arcium <span className="text-primary">Ecosystem</span>
          </h1>
          <p className="font-jetbrains text-lg leading-relaxed text-on-surface-variant/80">
            A curated directory of the builders, partners, and product territories already making Arcium more concrete.
            Use the filters for a narrow scan, or browse the grouped sections to understand where confidentiality matters most.
          </p>
        </header>

        <EcosystemDirectory 
            categories={ecosystemCategories} 
            projects={projects} 
            categoryColors={categoryColors} 
        />
      </main>

      <Footer config={footerConfig} />
    </div>
  );
}
