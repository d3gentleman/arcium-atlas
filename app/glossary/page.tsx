import type { Metadata } from 'next';
import GlossaryExplorer from '@/components/GlossaryExplorer';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import { 
    getGlossaryTerms, 
    getKnowledgeCategories, 
    getKnowledgeCategoryPath 
} from '@/lib/content';

export const metadata: Metadata = {
  title: 'Glossary | ARCIUM ATLAS',
  description: 'An A-Z reference for Arcium terms, with local summaries and source links back to the official docs.',
};

export default async function GlossaryPage() {
  const [terms, categories] = await Promise.all([
    getGlossaryTerms(),
    getKnowledgeCategories()
  ]);

  const categoryById = new Map(categories.map((category) => [category.id, category]));

  const enrichedTerms = terms.map((term) => {
    const relatedCategoryLinks = (term.relatedCategoryIds || [])
      .map((categoryId) => {
        const category = categoryById.get(categoryId);
        if (!category) return null;

        return {
          kind: 'Category' as const,
          label: category.title,
          href: getKnowledgeCategoryPath(category.slug),
        };
      })
      .filter((link): link is NonNullable<typeof link> => Boolean(link));

    return {
      ...term,
      aliases: term.aliases || [],
      keywords: term.keywords || [],
      source: term.source || { label: 'Arcium Docs', href: 'https://docs.arcium.com' },
      relatedLinks: [...relatedCategoryLinks],
    };
  });

  return (
    <KnowledgePageFrame
      eyebrow="GLOSSARY_INDEX"
      title="Arcium Reference Glossary"
      summary="A top-level reference surface for the atlas: browse Arcium terminology alphabetically, search aliases and keywords, and jump from each term into deeper encyclopedia context."
      statusLabel="GLOSSARY_LINKED"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Glossary', href: '/glossary' },
      ]}
      meta={
        <>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            TERMS // {terms.length}
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            FILTERS // A-Z + SEARCH
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            SOURCES // ARCIUM DOCS
          </div>
        </>
      }
    >
      <GlossaryExplorer terms={enrichedTerms as any} />
    </KnowledgePageFrame>
  );
}
