import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { submissions } from '@/lib/db/schema';
import { checkAdmin } from '@/lib/adminCheck';
import { eq } from 'drizzle-orm';

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
