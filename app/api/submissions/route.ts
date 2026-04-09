import { NextRequest, NextResponse } from 'next/server';
import { submissionSchema } from '@/lib/schemas/submissionSchema';
import { db } from '@/lib/db';
import { submissions } from '@/lib/db/schema';
import { z } from 'zod';

/**
 * POST /api/submissions
 *
 * Validates the incoming builder submission against the Zod schema
 * and persists it to the Neon Postgres database via Drizzle ORM.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate
    const parsed = submissionSchema.parse(body);

    // ── Persist to Postgres via Drizzle ──────────
    const [record] = await db
      .insert(submissions)
      .values({
        submitterName: parsed.submitterName,
        submitterEmail: parsed.submitterEmail,
        submitterRole: parsed.submitterRole,
        discordUsername: parsed.discordUsername,
        telegramUsername: parsed.telegramUsername,
        founderName: parsed.founderName,
        founderTwitter: parsed.founderTwitter,
        teamMembers: parsed.teamMembers ?? [],
        projectName: parsed.projectName,
        projectSummary: parsed.projectSummary,
        arciumRole: parsed.arciumRole,
        logoUrl: parsed.logoUrl,
        category: parsed.category,
        website: parsed.website,
        projectTwitter: parsed.projectTwitter,
        projectEmail: parsed.projectEmail,
        discordInvite: parsed.discordInvite || null,
        telegramInvite: parsed.telegramInvite || null,
        additionalContext: parsed.additionalContext || null,
      })
      .returning();

    // ── Email Notifications ───────────────────────
    // We run these as fire-and-forget or awaited depending on preference.
    // Given Resend is fast, we'll await but wrap in try/catch to not block success.
    try {
      const { sendAdminNotification, sendBuilderConfirmation } = await import('@/lib/email');
      await Promise.all([
        sendAdminNotification(record),
        sendBuilderConfirmation(record)
      ]);
    } catch (emailErr) {
      console.error('[submissions] Email notification failed:', emailErr);
      // We don't fail the submission if email fails
    }

    return NextResponse.json(
      { ok: true, id: record.id },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: err.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 422 }
      );
    }
    console.error('[submissions] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
