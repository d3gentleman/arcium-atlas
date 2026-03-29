'use client';

import { useState, useMemo } from 'react';
import { KnowledgeArticleRecord, KnowledgeCategoryRecord } from '../types/domain';
import KnowledgeRecordCard from './KnowledgeRecordCard';

interface EncyclopediaSearchProps {
  categories: KnowledgeCategoryRecord[];
  articles: KnowledgeArticleRecord[];
}

export default function EncyclopediaSearch({ categories, articles }: EncyclopediaSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const knowledgeCategories = categories;
  const guides = useMemo(() => articles.filter((a) => a.kind === 'guide'), [articles]);
  const updates = useMemo(() => articles.filter((a) => a.kind === 'update' || a.kind === 'article'), [articles]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return knowledgeCategories;
    const lowerQuery = searchQuery.toLowerCase();
    return knowledgeCategories.filter(
      (c) => c.title.toLowerCase().includes(lowerQuery) || c.summary.toLowerCase().includes(lowerQuery) || c.tag.toLowerCase().includes(lowerQuery)
    );
  }, [knowledgeCategories, searchQuery]);



  const filteredGuides = useMemo(() => {
    if (!searchQuery) return guides;
    const lowerQuery = searchQuery.toLowerCase();
    return guides.filter(
      (a) => a.title.toLowerCase().includes(lowerQuery) || a.summary.toLowerCase().includes(lowerQuery) || a.tag.toLowerCase().includes(lowerQuery)
    );
  }, [guides, searchQuery]);

  const filteredUpdates = useMemo(() => {
    if (!searchQuery) return updates;
    const lowerQuery = searchQuery.toLowerCase();
    return updates.filter(
      (a) => a.title.toLowerCase().includes(lowerQuery) || a.summary.toLowerCase().includes(lowerQuery) || a.tag.toLowerCase().includes(lowerQuery)
    );
  }, [updates, searchQuery]);

  const hasResults = filteredCategories.length > 0 || filteredGuides.length > 0 || filteredUpdates.length > 0;

  return (
    <div className="col-span-12 space-y-12 pb-12 w-full pt-4">
      {/* Search Input */}
      <section className="col-span-12 px-2 max-w-4xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-outline transition-colors group-focus-within:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full rounded-2xl border border-outline-variant/25 bg-surface-container-lowest/50 pl-14 pr-4 py-4 text-white placeholder-outline focus:border-primary/50 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/50 transition-all outline-none"
            placeholder="Search the Arcium Knowledge Database..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
               <button onClick={() => setSearchQuery('')} className="text-outline hover:text-white transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-surface-container-highest px-3 py-1.5 rounded-full border border-outline-variant/25">Clear</span>
               </button>
            </div>
          )}
        </div>
      </section>

      {!hasResults && (
        <section className="console-window col-span-12">
            <div className="console-header">
                <span>QUERY_RESULT</span>
                <span className="text-error">NO_MATCH</span>
            </div>
            <div className="p-12 text-center text-on-surface-variant flex flex-col items-center gap-4">
                <svg className="w-12 h-12 text-outline/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No records found matching &quot;{searchQuery}&quot;. Try different keywords.</p>
            </div>
        </section>
      )}

      {/* Guides */}
      {filteredGuides.length > 0 && (
        <section className="console-window col-span-12 mx-auto w-full">
          <div className="console-header">
            <span>MODULE_06: START_HERE_GUIDES</span>
            <span className="text-primary">ONBOARDING_ACTIVE</span>
          </div>
          <div className="grid gap-4 p-4 lg:grid-cols-2">
            {filteredGuides.map((article) => (
              <KnowledgeRecordCard
                key={article.id}
                variant="featured"
                action={{
                  type: 'internal',
                  href: `/encyclopedia/articles/${article.slug}`,
                  label: 'Read Guide',
                }}
                tag={article.tag}
                title={article.title}
                summary={article.summary}
                meta="Guide"
              />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {filteredCategories.length > 0 && (
        <section className="console-window col-span-12 mx-auto w-full">
          <div className="console-header">
            <span>MODULE_05: KNOWLEDGE_CATEGORIES</span>
            <span className="text-primary">REFERENCE_LAYER</span>
          </div>
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
            {filteredCategories.map((category) => (
              <KnowledgeRecordCard
                key={category.id}
                variant="default"
                action={{
                  type: 'internal',
                  href: `/encyclopedia/categories/${category.slug}`,
                  label: 'Open Category',
                }}
                tag={category.tag}
                title={category.title}
                summary={category.summary}
                eyebrow={category.prefix}
              />
            ))}
          </div>
        </section>
      )}



      {/* Recent Articles */}
      {filteredUpdates.length > 0 && (
        <section className="console-window col-span-12 mx-auto w-full bg-surface-container-lowest/30">
          <div className="console-header">
            <span>MODULE_08: RECENT_ARTICLES</span>
            <span className="text-primary">ARCHIVE_LINKED</span>
          </div>
          <div className="flex flex-col p-4 md:p-8">
            {filteredUpdates.map((article) => (
              <KnowledgeRecordCard
                key={article.id}
                variant="compact-list"
                action={{
                  type: 'internal',
                  href: `/encyclopedia/articles/${article.slug}`,
                  label: 'Read Article',
                }}
                tag={article.tag}
                title={article.title}
                summary={article.summary}
                meta={article.date || 'Article'}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
