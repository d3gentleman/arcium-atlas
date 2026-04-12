'use server';

import { db } from '@/lib/db';
import { ecosystemProjects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/adminCheck';
import { ecosystemProjectSchema } from '@/lib/schemas/ecosystemProjectSchema';

export async function createProject(data: Record<string, unknown>) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const parsed = ecosystemProjectSchema.parse(data);

    const [record] = await db
      .insert(ecosystemProjects)
      .values({
        slug: parsed.slug,
        title: parsed.title,
        tag: parsed.tag,
        summary: parsed.summary,
        description: parsed.description,
        logoUrl: parsed.logoUrl,
        website: parsed.website,
        docs: parsed.docs,
        twitter: parsed.twitter,
        github: parsed.github,
        projectEmail: parsed.projectEmail,
        discordInvite: parsed.discordInvite,
        telegramInvite: parsed.telegramInvite,
        relationshipType: parsed.relationshipType || 'ecosystem_project',
        statusNote: parsed.statusNote,
        lastReviewed: parsed.lastReviewed,
        status: parsed.status || 'sync_ok',
        categoryId: parsed.categoryId,
        isFeatured: parsed.isFeatured,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath('/ecosystem');
    revalidatePath(`/ecosystem/${record.slug}`);
    revalidatePath('/admin/projects');
    
    return { success: true, id: record.id };
  } catch (err: unknown) {
    console.error('[createProject] Error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function updateProject(id: number, data: Record<string, unknown>) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const parsed = ecosystemProjectSchema.parse(data);

    await db
      .update(ecosystemProjects)
      .set({
        title: parsed.title,
        tag: parsed.tag,
        summary: parsed.summary,
        description: parsed.description,
        logoUrl: parsed.logoUrl,
        website: parsed.website,
        docs: parsed.docs,
        twitter: parsed.twitter,
        github: parsed.github,
        projectEmail: parsed.projectEmail,
        discordInvite: parsed.discordInvite,
        telegramInvite: parsed.telegramInvite,
        relationshipType: parsed.relationshipType || 'ecosystem_project',
        statusNote: parsed.statusNote,
        lastReviewed: parsed.lastReviewed,
        status: parsed.status || 'sync_ok',
        categoryId: parsed.categoryId,
        isFeatured: parsed.isFeatured,
        updatedAt: new Date(),
      })
      .where(eq(ecosystemProjects.id, id));

    revalidatePath('/ecosystem');
    revalidatePath('/admin/projects');
    
    return { success: true };
  } catch (err: unknown) {
    console.error('[updateProject] Error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function deleteProject(id: number) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    await db.delete(ecosystemProjects).where(eq(ecosystemProjects.id, id));
    
    revalidatePath('/ecosystem');
    revalidatePath('/admin/projects');
    
    return { success: true };
  } catch (err: unknown) {
    console.error('[deleteProject] Error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
