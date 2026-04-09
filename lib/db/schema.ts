import {
  pgTable,
  text,
  timestamp,
  jsonb,
  serial,
} from 'drizzle-orm/pg-core';

/**
 * Team member stored as JSONB inside the submissions row.
 * Matches the `teamMemberSchema` from submissionSchema.ts.
 */
export type TeamMemberRecord = {
  role: string;
  name: string;
  twitter: string;
};

/**
 * submissions table
 *
 * Stores every builder project submission.
 * `status` transitions:  pending → approved | rejected
 */
export const submissions = pgTable('submissions', {
  id: serial('id').primaryKey(),

  // ── Basic Info ────────────────────────────────
  submitterName: text('submitter_name').notNull(),
  submitterEmail: text('submitter_email').notNull(),
  submitterRole: text('submitter_role').notNull(),
  discordUsername: text('discord_username').notNull(),
  telegramUsername: text('telegram_username').notNull(),

  // ── Team Information ──────────────────────────
  founderName: text('founder_name').notNull(),
  founderTwitter: text('founder_twitter').notNull(),
  teamMembers: jsonb('team_members').$type<TeamMemberRecord[]>().default([]),

  // ── Project Information ───────────────────────
  projectName: text('project_name').notNull(),
  projectSummary: text('project_summary').notNull(),
  arciumRole: text('arcium_role').notNull(),
  logoUrl: text('logo_url').notNull(),

  // ── Socials ───────────────────────────────────
  category: text('category').notNull(),
  website: text('website').notNull(),
  projectTwitter: text('project_twitter').notNull(),
  projectEmail: text('project_email').notNull(),
  discordInvite: text('discord_invite'),
  telegramInvite: text('telegram_invite'),

  // ── Meta ──────────────────────────────────────
  additionalContext: text('additional_context'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
