import { z } from 'zod';

// --- Team Member Sub-Schema ---
export const teamMemberSchema = z.object({
  role: z.string().min(1, 'Role is required'),
  name: z.string().min(1, 'Name or alias is required'),
  twitter: z
    .string()
    .min(1, 'Twitter/X URL is required')
    .url('Must be a valid URL'),
});

export type TeamMember = z.infer<typeof teamMemberSchema>;

// --- Main Submission Schema ---
export const submissionSchema = z.object({
  // ── Basic Info ──────────────────────────────────
  submitterName: z.string().min(1, 'Name or alias is required'),
  submitterEmail: z.string().min(1, 'Email is required').email('Must be a valid email'),
  submitterRole: z.string().min(1, 'Your role in the project is required'),
  discordUsername: z.string().min(1, 'Discord username is required'),
  telegramUsername: z.string().min(1, 'Telegram username is required'),

  // ── Team Information ───────────────────────────
  founderName: z.string().min(1, "Founder's name or alias is required"),
  founderTwitter: z
    .string()
    .min(1, "Founder's Twitter/X URL is required")
    .url('Must be a valid URL'),
  teamMembers: z
    .array(teamMemberSchema)
    .max(3, 'You may add up to 3 additional team members'),

  // ── Project Information ────────────────────────
  projectName: z.string().min(1, 'Project name is required'),
  projectSummary: z
    .string()
    .min(1, 'Project summary is required')
    .max(500, 'Summary must be 500 characters or fewer'),
  arciumRole: z
    .string()
    .min(1, "Explain Arcium's role in the project"),

  // Logo is validated separately (file upload)
  logoUrl: z.string().min(1, 'Project logo is required'),

  // ── Socials ────────────────────────────────────
  category: z.string().min(1, 'Project category is required'),
  website: z.string().min(1, 'Website URL is required').url('Must be a valid URL'),
  projectTwitter: z
    .string()
    .min(1, 'Twitter URL is required')
    .url('Must be a valid URL'),
  projectEmail: z
    .string()
    .min(1, 'Project email is required')
    .email('Must be a valid email'),

  // Optional fields
  discordInvite: z
    .string()
    .url('Must be a valid URL')
    .or(z.literal(''))
    .optional(),
  telegramInvite: z
    .string()
    .url('Must be a valid URL')
    .or(z.literal(''))
    .optional(),
  additionalContext: z.string().max(2000).optional(),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;

// Available ecosystem categories (mirrors content/ecosystem-categories)
export const PROJECT_CATEGORIES = [
  { value: 'analytics', label: 'Analytics' },
  { value: 'consumer', label: 'Consumer' },
  { value: 'defi', label: 'DeFi' },
  { value: 'depin', label: 'DePIN' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'interoperability', label: 'Interoperability' },
  { value: 'nfts', label: 'NFTs' },
  { value: 'payments', label: 'Payments' },
] as const;
