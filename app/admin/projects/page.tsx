import { db } from '@/lib/db';
import { ecosystemProjects } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import AdminProjectsClient, { SerializableProject } from './AdminProjectsClient';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const list = await db.select().from(ecosystemProjects).orderBy(desc(ecosystemProjects.createdAt));

  // Serialize dates for Client Component props
  const serializedList = list.map(project => ({
    ...project,
    createdAt: project.createdAt ? project.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: project.updatedAt ? project.updatedAt.toISOString() : new Date().toISOString(),
  }));

  return (
    <KnowledgePageFrame
      eyebrow="Admin"
      title="Managed Projects"
      summary="Directly manage the ecosystem database entries."
      statusLabel="EDITOR_MODE_ACTIVE"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Projects', href: '/admin/projects' }
      ]}
      meta={
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-[1rem] border border-[#00ffa3]/30 bg-[#00ffa3]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#00ffa3] transition-all hover:bg-[#00ffa3]/20 hover:border-[#00ffa3]"
        >
          <Plus size={14} />
          Add_New_Project
        </Link>
      }
    >
      <AdminProjectsClient initialProjects={serializedList as unknown as SerializableProject[]} />
    </KnowledgePageFrame>
  );
}
