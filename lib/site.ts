export const SITE_NAME = 'Arcium Atlas';
export const SITE_TITLE = 'Arcium Atlas | Curated Guides to Confidential Compute';
export const SITE_DESCRIPTION = 'Arcium Atlas is a curated guide to the Arcium ecosystem, core concepts, and builder landscape for readers who want a clearer model of confidential compute.';
const DEFAULT_SITE_URL = 'https://arcium-atlas.vercel.app';

export function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined)
    || DEFAULT_SITE_URL;

  return siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
}
