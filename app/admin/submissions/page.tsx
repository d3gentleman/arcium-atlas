import { db } from '@/lib/db';
import { submissions } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import AdminSubmissionsClient from './AdminSubmissionsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSubmissionsPage() {
  const list = await db.select().from(submissions).orderBy(desc(submissions.createdAt));

  // Serialize dates for Client Component props
  const serializedList = list.map(sub => ({
    ...sub,
    createdAt: sub.createdAt.toISOString()
  }));

  return (
    <KnowledgePageFrame
      eyebrow="Admin"
      title="Staff Dashboard"
      summary="Project Submissions Review"
      statusLabel="SECURE_MODE_ACTIVE"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Submissions', href: '/admin/submissions' }]}
    >
      <AdminSubmissionsClient initialSubmissions={serializedList} />
    </KnowledgePageFrame>
  );
}
