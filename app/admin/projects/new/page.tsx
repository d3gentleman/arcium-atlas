import { getEcosystemCategories } from '@/lib/content';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import ProjectForm from '../ProjectForm';

export default async function NewProjectPage() {
  const categories = await getEcosystemCategories();

  return (
    <KnowledgePageFrame
      eyebrow="Admin"
      title="Sync New Entity"
      summary="Initiate a new project record in the ecosystem database."
      statusLabel="EDITOR_SESSION_INIT"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Projects', href: '/admin/projects' },
        { label: 'New', href: '/admin/projects/new' }
      ]}
    >
      <ProjectForm categories={categories} />
    </KnowledgePageFrame>
  );
}
