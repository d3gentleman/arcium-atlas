import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { submissions, ecosystemProjects } from '@/lib/db/schema';
import { checkAdmin } from '@/lib/adminCheck';
import { eq } from 'drizzle-orm';
import { slugify } from '@/lib/content';
import { revalidatePath } from 'next/cache';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { status } = await request.json();
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const [record] = await db
      .update(submissions)
      .set({ status })
      .where(eq(submissions.id, parseInt(params.id, 10)))
      .returning();

    // ── If APPROVED, promote to ecosystem_projects ──
    if (status === 'approved') {
      try {
        await db.insert(ecosystemProjects).values({
          slug: slugify(record.projectName),
          title: record.projectName,
          tag: record.arciumRole || 'BUILDER',
          summary: record.projectSummary,
          description: record.additionalContext,
          logoUrl: record.logoUrl,
          website: record.website,
          twitter: record.projectTwitter,
          projectEmail: record.projectEmail,
          discordInvite: record.discordInvite,
          telegramInvite: record.telegramInvite,
          categoryId: record.category,
          status: 'sync_ok',
          isFeatured: false,
        }).onConflictDoUpdate({
          target: ecosystemProjects.slug,
          set: {
            title: record.projectName,
            projectEmail: record.projectEmail,
            discordInvite: record.discordInvite,
            telegramInvite: record.telegramInvite,
            updatedAt: new Date(),
          }
        });
        
        revalidatePath('/ecosystem');
        revalidatePath('/admin/projects');
      } catch (dbErr) {
        console.error('[Admin PATCH] Migration to ecosystem_projects failed:', dbErr);
      }
    }

    // ── Notify Builder ────────────────────────────
    try {
      const { sendBuilderStatusUpdate } = await import('@/lib/email');
      await sendBuilderStatusUpdate(record);
    } catch (emailErr) {
      console.error('[Admin PATCH] Status update email failed:', emailErr);
    }

    return NextResponse.json({ success: true, submission: record });
  } catch (error) {
    console.error('[Admin PATCH submission] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
