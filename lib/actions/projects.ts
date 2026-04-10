'use server';

import { db } from '@/lib/db';
import { ecosystemProjects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createProject(data: Record<string, unknown>) {
  try {
    const [record] = await db
      .insert(ecosystemProjects)
      .values({
        slug: data.slug as string,
        title: data.title as string,
        tag: data.tag as string,
        summary: data.summary as string,
        description: data.description as string,
        logoUrl: data.logoUrl as string,
        website: data.website as string,
        docs: data.docs as string,
        twitter: data.twitter as string,
        github: data.github as string,
        status: data.status as string,
        categoryId: data.categoryId as string,
        isFeatured: data.isFeatured as boolean,
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
  try {
    await db
      .update(ecosystemProjects)
      .set({
        title: data.title as string,
        tag: data.tag as string,
        summary: data.summary as string,
        description: data.description as string,
        logoUrl: data.logoUrl as string,
        website: data.website as string,
        docs: data.docs as string,
        twitter: data.twitter as string,
        github: data.github as string,
        status: data.status as string,
        categoryId: data.categoryId as string,
        isFeatured: data.isFeatured as boolean,
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
