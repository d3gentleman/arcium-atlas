import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { submissions } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { checkAdmin } from '@/lib/adminCheck';

export async function GET() {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const list = await db.select().from(submissions).orderBy(desc(submissions.createdAt));
    return NextResponse.json({ submissions: list });
  } catch (error) {
    console.error('[Admin GET submissions] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
