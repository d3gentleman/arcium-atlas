import { config, fields, collection, singleton } from '@keystatic/core';

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

const mapNodePriorityOptions = [
  { label: 'High', value: 'high' as const },
  { label: 'Medium', value: 'medium' as const },
  { label: 'Low', value: 'low' as const },
];

const bodySectionFields = {
  title: fields.text({ label: 'Section Title' }),
  body: fields.text({ label: 'Body content', multiline: true }),
};

export default config({
  storage: {
    kind: (process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_MODE as any) || (process.env.NODE_ENV === 'production' && process.env.KEYSTATIC_GITHUB_CLIENT_ID ? 'github' : 'local'),
    repo: {
      owner: process.env.NEXT_PUBLIC_GITHUB_OWNER || 'd3gentleman',
      name: process.env.NEXT_PUBLIC_GITHUB_REPO || 'arcium-atlas',
    },
  },
  collections: {
    knowledgeCategories: collection({
      label: 'Knowledge Categories',
      slugField: 'slug',
      path: 'content/knowledge-categories/*',
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
        group: fields.select({
          label: 'Group',
          options: [
            { label: 'Knowledge', value: 'knowledge' as const },
            { label: 'Ecosystem', value: 'ecosystem' as const },
          ],
          defaultValue: 'knowledge',
        }),
      },
    }),
    knowledgeArticles: collection({
      label: 'Knowledge Articles',
      slugField: 'slug',
      path: 'content/knowledge-articles/*',
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
        kind: fields.select({
          label: 'Kind',
          options: [
            { label: 'Guide', value: 'guide' as const },
            { label: 'Update', value: 'update' as const },
          ],
          defaultValue: 'guide',
        }),
        date: fields.text({ label: 'Date (YYYY-MM-DD)' }),
        relatedCategoryId: fields.text({ label: 'Related Category ID' }),
      },
    }),
    glossaryTerms: collection({
      label: 'Glossary Terms',
      slugField: 'slug',
      path: 'content/glossary/*',
      format: { data: 'json' },
      schema: {
        id: fields.text({ label: 'ID' }),
        slug: fields.slug({ name: { label: 'Slug' } }),
        term: fields.text({ label: 'Term' }),
        tag: fields.text({ label: 'Tag' }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        aliases: fields.array(fields.text({ label: 'Alias' }), { label: 'Aliases' }),
        keywords: fields.array(fields.text({ label: 'Keyword' }), { label: 'Keywords' }),
        priority: fields.select({
          label: 'Priority',
          options: mapNodePriorityOptions,
          defaultValue: 'medium',
        }),
        source: fields.object({
          label: fields.text({ label: 'Label' }),
          href: fields.text({ label: 'URL' }),
        }, { label: 'Source Reference' }),
        relatedCategoryIds: fields.array(fields.text({ label: 'Related Category ID' }), {
          label: 'Related Category IDs',
        }),
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
        logo: fields.image({
          label: 'Logo/Icon',
          directory: 'public/images/ecosystem',
          publicPath: '/images/ecosystem',
        }),
        website: fields.text({ label: 'Website URL' }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'SYNC_OK', value: 'sync_ok' as const },
            { label: 'COMING_SOON', value: 'coming_soon' as const },
            { label: 'MAINTENANCE', value: 'maintenance' as const },
          ],
          defaultValue: 'sync_ok',
        }),
        categoryId: fields.relationship({
          label: 'Category',
          collection: 'knowledgeCategories',
          validation: { isRequired: true },
        }),
        isFeatured: fields.checkbox({ label: 'Featured (Large Card)', defaultValue: false }),
      },
    }),
  },
});
