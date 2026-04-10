import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ecosystemProjects } from '@/lib/db/schema';
import { checkAdmin } from '@/lib/adminCheck';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await db.delete(ecosystemProjects).where(eq(ecosystemProjects.id, id));

    revalidatePath('/ecosystem');
    revalidatePath('/admin/projects');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Admin DELETE project] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
