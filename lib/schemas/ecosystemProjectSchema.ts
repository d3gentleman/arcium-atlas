import { z } from 'zod';

export const ecosystemProjectSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().min(1, 'Title is required'),
  tag: z.string().min(1, 'Tag is required'),
  summary: z.string().min(1, 'Summary is required'),
  description: z.string().optional().or(z.literal('')),
  logoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  docs: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  twitter: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  github: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  projectEmail: z.string().email('Must be a valid email').optional().or(z.literal('')),
  discordInvite: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  telegramInvite: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  relationshipType: z.string().optional().or(z.literal('')),
  statusNote: z.string().optional().or(z.literal('')),
  lastReviewed: z.string().optional().or(z.literal('')),
  status: z.string().min(1),
  categoryId: z.string().min(1),
  isFeatured: z.boolean().default(false),
});
