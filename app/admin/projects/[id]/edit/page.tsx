import { db } from '@/lib/db';
import { ecosystemProjects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getEcosystemCategories } from '@/lib/content';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import ProjectForm from '../../ProjectForm';

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const [project] = await db
    .select()
    .from(ecosystemProjects)
    .where(eq(ecosystemProjects.id, id));

  if (!project) notFound();

  const categories = await getEcosystemCategories();

  return (
    <KnowledgePageFrame
      eyebrow="Admin"
      title="Edit Entity"
      summary={`Updating record: ${project.title}`}
      statusLabel="ENTITY_LOCKED_FOR_EDIT"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Projects', href: '/admin/projects' },
        { label: project.title, href: `/admin/projects/${id}/edit` }
      ]}
    >
      <ProjectForm initialData={project} categories={categories} />
    </KnowledgePageFrame>
  );
}
