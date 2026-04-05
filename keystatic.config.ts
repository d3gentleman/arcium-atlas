import { config, fields, collection } from '@keystatic/core';

// Reusable field schemas
const linkActionFields = {
  type: fields.select({
    label: 'Action Type',
    options: [
      { label: 'Internal Link', value: 'internal' as const },
      { label: 'External Link', value: 'external' as const },
      { label: 'Command (Open Discovery)', value: 'command' as const },
      { label: 'Unavailable', value: 'unavailable' as const },
    ],
    defaultValue: 'internal',
  }),
  href: fields.text({ label: 'HREF / URL' }),
  label: fields.text({ label: 'Label' }),
  command: fields.text({ label: 'Command (e.g., open-discovery)' }),
  reason: fields.text({ label: 'Reason (if unavailable)' }),
};

const bodySectionFields = {
  title: fields.text({ label: 'Section Title' }),
  body: fields.text({ label: 'Body content', multiline: true }),
};

function resolveStorageKind(): 'local' | 'github' {
  const publicConfiguredMode = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_MODE;
  const configuredMode = process.env.KEYSTATIC_STORAGE_MODE;

  if (publicConfiguredMode === 'local' || publicConfiguredMode === 'github') {
    return publicConfiguredMode;
  }

  if (configuredMode === 'local' || configuredMode === 'github') {
    return configuredMode;
  }

  return process.env.NODE_ENV === 'production' && process.env.KEYSTATIC_GITHUB_CLIENT_ID
    ? 'github'
    : 'local';
}

export default config({
  storage: {
    kind: resolveStorageKind(),
    repo: {
      owner: process.env.NEXT_PUBLIC_GITHUB_OWNER || 'd3gentleman',
      name: process.env.NEXT_PUBLIC_GITHUB_REPO || 'arcium-atlas',
    },
  },
  collections: {
    ecosystemCategories: collection({
      label: 'Ecosystem Categories',
      slugField: 'slug',
      path: 'content/ecosystem-categories/*',
      format: { data: 'json' },
      schema: {
        id: fields.text({ label: 'ID' }),
        slug: fields.slug({ name: { label: 'Slug' } }),
        title: fields.text({ label: 'Title' }),
        tag: fields.text({ label: 'Tag' }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        bodySections: fields.array(fields.object(bodySectionFields), {
          label: 'Body Sections',
          itemLabel: (props) => props.fields.title.value,
        }),
        prefix: fields.text({ label: 'Prefix (e.g. 01.)' }),
        description: fields.text({ label: 'Short Description' }),
      },
    }),
    ecosystemProjects: collection({
      label: 'Ecosystem Projects',
      slugField: 'slug',
      path: 'content/ecosystem-projects/*',
      format: { data: 'json' },
      schema: {
        id: fields.text({ label: 'ID' }),
        slug: fields.slug({ name: { label: 'Slug' } }),
        title: fields.text({ label: 'Title' }),
        tag: fields.text({ label: 'Tag (e.g. DEX AGGREGATOR)' }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        description: fields.text({ label: 'Detailed Project Description', multiline: true }),
        logo: fields.image({
          label: 'Logo/Icon',
          directory: 'public/images/ecosystem',
          publicPath: '/images/ecosystem',
        }),
        metrics: fields.array(
          fields.object({
            label: fields.text({ label: 'Metric Label' }),
            value: fields.text({ label: 'Metric Value' }),
          }),
          { label: 'Key Metrics', itemLabel: (p) => p.fields.label.value }
        ),
        website: fields.text({ label: 'Website URL' }),
        twitter: fields.text({ label: 'Twitter URL' }),
        github: fields.text({ label: 'GitHub URL' }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'LIVE', value: 'sync_ok' as const },
            { label: 'COMING_SOON', value: 'coming_soon' as const },
            { label: 'MAINTENANCE', value: 'maintenance' as const },
          ],
          defaultValue: 'sync_ok',
        }),
        categoryId: fields.relationship({
          label: 'Category',
          collection: 'ecosystemCategories',
          validation: { isRequired: true },
        }),
        isFeatured: fields.checkbox({ label: 'Featured (Large Card)', defaultValue: false }),
      },
    }),
  },
});
