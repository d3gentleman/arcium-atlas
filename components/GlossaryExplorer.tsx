'use client';

import Link from 'next/link';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';

interface GlossaryExplorerLink {
  label: string;
  href: string;
  kind: 'Category' | 'Map';
}

interface GlossaryExplorerTerm {
  id: string;
  slug: string;
  term: string;
  tag: string;
  summary: string;
  aliases: string[];
  keywords: string[];
  source: {
    label: string;
    href: string;
  };
  relatedLinks: GlossaryExplorerLink[];
}

interface GlossaryExplorerProps {
  terms: GlossaryExplorerTerm[];
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function getInitialLetter(term: string): string {
  const firstCharacter = term.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(firstCharacter) ? firstCharacter : '#';
}

function compareTerms(left: GlossaryExplorerTerm, right: GlossaryExplorerTerm): number {
  return left.term.localeCompare(right.term);
}

function rankTerm(term: GlossaryExplorerTerm, query: string): number {
  const normalizedTerm = term.term.toLowerCase();
  const normalizedAliases = term.aliases.map((alias) => alias.toLowerCase());
  const normalizedKeywords = term.keywords.join(' ').toLowerCase();
  const normalizedSummary = term.summary.toLowerCase();

  let score = 0;

  if (normalizedTerm === query) {
    score += 120;
  }

  if (normalizedAliases.includes(query)) {
    score += 100;
  }

  if (normalizedTerm.startsWith(query)) {
    score += 80;
  }

  if (normalizedAliases.some((alias) => alias.startsWith(query))) {
    score += 72;
  }

  if (normalizedTerm.includes(query)) {
    score += 56;
  }

  if (normalizedAliases.some((alias) => alias.includes(query))) {
    score += 48;
  }

  if (normalizedKeywords.includes(query)) {
    score += 34;
  }

  if (normalizedSummary.includes(query)) {
    score += 18;
  }

  return score;
}

export default function GlossaryExplorer({ terms }: GlossaryExplorerProps) {
  const [activeLetter, setActiveLetter] = useState('ALL');
  const [query, setQuery] = useState('');
  const [activeHash, setActiveHash] = useState('');
  const deferredQuery = useDeferredValue(query);
  const searchQuery = deferredQuery.trim().toLowerCase();

  useEffect(() => {
    const syncHash = () => {
      setActiveHash(window.location.hash.replace(/^#/, '').toLowerCase());
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);

    return () => {
      window.removeEventListener('hashchange', syncHash);
    };
  }, []);

  const availableLetters = useMemo(
    () => new Set(terms.map((term) => getInitialLetter(term.term))),
    [terms]
  );

  const visibleTerms = useMemo(() => {
    const letterScopedTerms = activeLetter === 'ALL'
      ? [...terms]
      : terms.filter((term) => getInitialLetter(term.term) === activeLetter);

    if (!searchQuery) {
      return letterScopedTerms.sort(compareTerms);
    }

    return letterScopedTerms
      .map((term) => ({
        term,
        score: rankTerm(term, searchQuery),
      }))
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score || compareTerms(left.term, right.term))
      .map((entry) => entry.term);
  }, [activeLetter, searchQuery, terms]);

  const groupedTerms = useMemo(() => {
    const groups = new Map<string, GlossaryExplorerTerm[]>();

    visibleTerms.forEach((term) => {
      const letter = getInitialLetter(term.term);
      const existingTerms = groups.get(letter) || [];
      existingTerms.push(term);
      groups.set(letter, existingTerms);
    });

    return Array.from(groups.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([letter, items]) => ({
        letter,
        items,
      }));
  }, [visibleTerms]);

  const activeFiltersLabel = searchQuery
    ? `SEARCH // ${visibleTerms.length} RESULTS`
    : activeLetter === 'ALL'
      ? `A-Z INDEX // ${terms.length} TERMS`
      : `LETTER_${activeLetter} // ${visibleTerms.length} TERMS`;

  return (
    <>
      <section className="console-window col-span-12 overflow-hidden">
        <div className="console-header">
          <span>MODULE_15: GLOSSARY_CONTROLS</span>
          <span className="text-primary">REFERENCE_FILTERS_READY</span>
        </div>
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-5">
            <label className="block">
              <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                Search Terms
              </div>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Arcium terms, aliases, and keywords..."
                className="w-full rounded-[1.2rem] border border-outline-variant/30 bg-[#05070a] px-5 py-4 text-base text-white shadow-inner focus:border-primary focus:outline-none"
              />
            </label>

            <div>
              <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                Filter by Letter
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveLetter('ALL')}
                  className={`rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${
                    activeLetter === 'ALL'
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-outline-variant/25 bg-surface-container-lowest text-outline hover:border-outline-variant/45 hover:text-white'
                  }`}
                >
                  All
                </button>
                {LETTERS.map((letter) => {
                  const disabled = !availableLetters.has(letter);
                  const selected = activeLetter === letter;

                  return (
                    <button
                      key={letter}
                      type="button"
                      disabled={disabled}
                      onClick={() => setActiveLetter(letter)}
                      className={`h-10 min-w-10 rounded-full border px-3 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${
                        selected
                          ? 'border-primary/50 bg-primary/10 text-primary'
                          : disabled
                            ? 'border-outline-variant/10 bg-black/20 text-slate-600'
                            : 'border-outline-variant/25 bg-surface-container-lowest text-outline hover:border-outline-variant/45 hover:text-white'
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
              Filter State
            </div>
            <div className="space-y-3 text-sm leading-7 text-on-surface-variant">
              <p>
                {activeFiltersLabel}
              </p>
              <p>
                Terms are curated locally for this site, with each entry linking back to the relevant Arcium docs page for verification.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="console-window col-span-12 overflow-hidden">
        <div className="console-header">
          <span>MODULE_16: GLOSSARY_INDEX</span>
          <span className="text-primary">{activeFiltersLabel}</span>
        </div>

        {groupedTerms.length > 0 ? (
          <div className="space-y-8 p-6">
            {groupedTerms.map((group) => (
              <section key={group.letter} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/35 bg-primary/10 text-lg font-black uppercase text-primary">
                    {group.letter}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-outline">
                    {group.items.length} TERMS
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {group.items.map((term) => {
                    const isHighlighted = activeHash === term.slug.toLowerCase();

                    return (
                      <article
                        key={term.id}
                        id={term.slug}
                        className={`scroll-mt-28 rounded-[1.4rem] border p-5 transition-colors ${
                          isHighlighted
                            ? 'border-primary/45 bg-surface-container shadow-[0_0_0_1px_rgba(0,240,255,0.08)]'
                            : 'border-outline-variant/25 bg-surface-container-lowest'
                        }`}
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="mb-3 flex flex-wrap items-center gap-3">
                              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                                {term.tag}
                              </span>
                              <span className="rounded-full border border-outline-variant/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-outline">
                                TERM
                              </span>
                            </div>
                            <h2 className="text-2xl font-black tracking-tight text-white">
                              {term.term}
                            </h2>
                            {term.aliases.length > 0 ? (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {term.aliases.map((alias) => (
                                  <span
                                    key={alias}
                                    className="rounded-full border border-outline-variant/20 px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-outline"
                                  >
                                    {`AKA // ${alias}`}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>

                          <a
                            href={term.source.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="shrink-0 rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/20"
                          >
                            Open Source
                          </a>
                        </div>

                        <p className="mt-5 text-sm leading-7 text-on-surface-variant">
                          {term.summary}
                        </p>

                        {term.keywords.length > 0 ? (
                          <div className="mt-5">
                            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-primary/80">
                              Keywords
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {term.keywords.map((keyword) => (
                                <span
                                  key={keyword}
                                  className="rounded-full border border-outline-variant/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-outline"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {term.relatedLinks.length > 0 ? (
                          <div className="mt-5">
                            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-primary/80">
                              Related Atlas Paths
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {term.relatedLinks.map((link) => (
                                <Link
                                  key={`${term.id}-${link.kind}-${link.href}`}
                                  href={link.href}
                                  className="rounded-full border border-outline-variant/20 px-3 py-2 text-[10px] font-bold tracking-[0.12em] text-outline transition-colors hover:border-outline-variant/40 hover:text-white"
                                >
                                  {`${link.kind} // ${link.label}`}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-outline">
                          {`SOURCE // ${term.source.label}`}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="p-6">
            <div className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-8 text-center">
              <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                No glossary terms matched this filter.
              </div>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-on-surface-variant">
                Try a broader letter filter, search for an alias like MXE or MPC, or clear the current query to return to the full A-Z index.
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
