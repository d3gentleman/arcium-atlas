import { 
  getEcosystemCategories, 
  getEcosystemProjects, 
  getCategoryColors
} from '@/lib/content';
import { ArrowRight } from 'lucide-react';
import EcosystemDirectory from '@/components/EcosystemDirectory';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';

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
      eyebrow="ATLAS // ECOSYSTEM"
      title="Builder Ecosystem"
      summary="Explore the projects and teams building on the Arcium network. From confidential AI to private DeFi, the Atlas directory is the canonical record of the network's growth."
      statusLabel="SCAN_COMPLETE"
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
            SECTORS // {ecosystemCategories.length}
          </div>
          <Link
            href="/ecosystem/categories"
            className="flex items-center justify-between rounded-[1rem] border border-primary/20 bg-primary/5 px-4 py-3 text-primary transition-colors hover:bg-primary/10"
          >
            Sectors Index
            <ArrowRight size={14} className="ml-2" />
          </Link>
        </>
      }
    >
      <div className="p-2 lg:p-4">
        <EcosystemDirectory
          categories={ecosystemCategories}
          projects={projects}
          categoryColors={categoryColors}
        />
      </div>
    </KnowledgePageFrame>
  );
}
