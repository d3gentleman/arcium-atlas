import { 
  getEcosystemCategories, 
  getEcosystemProjects, 
  getCategoryColors
} from '@/lib/content';
import EcosystemDirectory from '@/components/EcosystemDirectory';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Ecosystem',
  description: 'A curated directory of projects and product categories across the Arcium ecosystem.',
  path: '/ecosystem',
});

export default async function EcosystemPage() {
  const ecosystemCategories = await getEcosystemCategories();
  const projects = await getEcosystemProjects();
  const categoryColors = await getCategoryColors();

  return (
    <KnowledgePageFrame
      eyebrow="ATLAS // CURATED_DIRECTORY"
      title="Arcium Ecosystem"
      summary="A curated directory of public builder records, reference projects, and territory coverage related to Arcium. Use the filters for a narrow scan, or browse the grouped sections to see where coverage is already mapped and where it is still filling in."
      statusLabel="DIRECTORY_LIVE"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Directory', href: '/ecosystem' },
      ]}
      meta={
        <>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            PROJECTS // {projects.length}
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            TERRITORIES // {ecosystemCategories.length}
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            FORMAT // CURATED GUIDE
          </div>
        </>
      }
    >
      <section className="console-window col-span-12 overflow-hidden">
        <div className="console-header">
          <span>MODULE_08: ECOSYSTEM_DIRECTORY</span>
          <span className="text-primary">SCAN_LIVE</span>
        </div>
        <div className="p-6 lg:p-8">
          <EcosystemDirectory 
              categories={ecosystemCategories} 
              projects={projects} 
              categoryColors={categoryColors} 
          />
        </div>
      </section>
    </KnowledgePageFrame>
  );
}
