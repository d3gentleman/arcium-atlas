'use client';

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { DiscoveryItem, DiscoveryItemKind, UIConfig } from '../types/domain';

interface DiscoveryShellProps {
  children: ReactNode;
  items: DiscoveryItem[];
  ui: UIConfig;
}

interface DiscoveryControlOptions {
  restoreFocus?: boolean;
}

interface DiscoveryContextValue {
  isOpen: boolean;
  openDiscovery: (trigger?: HTMLElement | null) => void;
  closeDiscovery: (options?: DiscoveryControlOptions) => void;
  toggleDiscovery: (trigger?: HTMLElement | null) => void;
}

const MAX_RESULTS = 8;
const GROUP_ORDER: DiscoveryItemKind[] = ['core', 'project', 'category'];

const DiscoveryContext = createContext<DiscoveryContextValue | null>(null);

function kindOrder(kind: DiscoveryItemKind): number {
  return GROUP_ORDER.indexOf(kind);
}

function priorityScore(priority: DiscoveryItem['priority']): number {
  if (priority === 'high') {
    return 12;
  }

  if (priority === 'medium') {
    return 6;
  }

  return 2;
}

function compareItems(left: DiscoveryItem, right: DiscoveryItem): number {
  return (
    Number(right.featured) - Number(left.featured)
    || priorityScore(right.priority) - priorityScore(left.priority)
    || kindOrder(left.kind) - kindOrder(right.kind)
    || left.title.localeCompare(right.title)
  );
}

function initialResults(items: DiscoveryItem[]): DiscoveryItem[] {
  return [...items].sort(compareItems).slice(0, MAX_RESULTS);
}

function rankItems(items: DiscoveryItem[], query: string): DiscoveryItem[] {
  return items
    .map((item) => {
      const loweredTitle = item.title.toLowerCase();
      const loweredSummary = item.summary.toLowerCase();
      const loweredTag = item.tag.toLowerCase();
      const loweredKeywords = item.keywords.join(' ').toLowerCase();

      let score = 0;

      if (loweredTitle === query) {
        score += 120;
      }

      if (loweredTitle.startsWith(query)) {
        score += 80;
      }

      if (loweredTitle.includes(query)) {
        score += 55;
      }

      if (loweredTag.includes(query)) {
        score += 24;
      }

      if (loweredKeywords.includes(query)) {
        score += 28;
      }

      if (loweredSummary.includes(query)) {
        score += 16;
      }

      score += priorityScore(item.priority);

      if (item.featured) {
        score += 10;
      }

      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || compareItems(left.item, right.item))
    .slice(0, MAX_RESULTS)
    .map((entry) => entry.item);
}

function groupLabel(kind: DiscoveryItemKind, ui: UIConfig): string {
  switch (kind) {
    case 'core':
      return ui.discoveryGroupCore;
    case 'project':
      return ui.discoveryGroupProjects;
    case 'category':
      return ui.discoveryGroupCategories;
    default:
      return 'Results';
  }
}

interface DiscoveryPaletteProps {
  isOpen: boolean;
  items: DiscoveryItem[];
  onClose: (options?: DiscoveryControlOptions) => void;
  ui: UIConfig;
}

function DiscoveryPalette({ isOpen, items, onClose, ui }: DiscoveryPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const deferredQuery = useDeferredValue(query);
  const searchQuery = deferredQuery.trim().toLowerCase();

  const visibleItems = useMemo(
    () => (searchQuery ? rankItems(items, searchQuery) : initialResults(items)),
    [items, searchQuery]
  );

  const groupedItems = useMemo(() => {
    let cursor = 0;

    return GROUP_ORDER.map((kind) => {
      const results = visibleItems
        .filter((item) => item.kind === kind)
        .map((item) => ({
          ...item,
          globalIndex: cursor++,
        }));

      if (!results.length) {
        return null;
      }

      return {
        kind,
        label: groupLabel(kind, ui),
        results,
      };
    }).filter((section): section is NonNullable<typeof section> => Boolean(section));
  }, [ui, visibleItems]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setActiveIndex(0);
      return;
    }

    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [isOpen]);

  useEffect(() => {
    if (!visibleItems.length) {
      setActiveIndex(-1);
      return;
    }

    setActiveIndex(0);
  }, [searchQuery, visibleItems.length]);

  const openResult = (item: DiscoveryItem) => {
    onClose({ restoreFocus: false });
    router.push(item.href);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[140] bg-black/72 px-4 py-6 backdrop-blur-md"
      onClick={() => onClose()}
    >
      <div
        className="mx-auto flex h-full w-full max-w-5xl items-start justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ui.discoveryOpen}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              if (!visibleItems.length) {
                return;
              }
              setActiveIndex((current) => (current + 1) % visibleItems.length);
            }

            if (event.key === 'ArrowUp') {
              event.preventDefault();
              if (!visibleItems.length) {
                return;
              }
              setActiveIndex((current) => (current <= 0 ? visibleItems.length - 1 : current - 1));
            }

            if (event.key === 'Home') {
              event.preventDefault();
              if (visibleItems.length) {
                setActiveIndex(0);
              }
            }

            if (event.key === 'End') {
              event.preventDefault();
              if (visibleItems.length) {
                setActiveIndex(visibleItems.length - 1);
              }
            }

            if (event.key === 'Enter' && activeIndex >= 0 && visibleItems[activeIndex]) {
              event.preventDefault();
              openResult(visibleItems[activeIndex]);
            }
          }}
          className="console-window mt-10 flex w-full max-w-4xl flex-col overflow-hidden border-primary/20 bg-[linear-gradient(180deg,rgba(8,10,12,0.98)_0%,rgba(13,16,20,0.97)_100%)] shadow-[0_40px_120px_rgba(0,0,0,0.82)]"
        >
          <div className="console-header px-4 py-3">
            <span>{ui.discoveryOpen}</span>
            <div className="flex items-center gap-3">
              <span className="text-outline">{ui.discoverySearchHint}</span>
              <button
                type="button"
                onClick={() => onClose()}
                className="rounded-full border border-outline-variant/30 bg-black/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-outline transition-colors hover:text-white"
              >
                {ui.discoveryClose}
              </button>
            </div>
          </div>

          <div className="border-b border-outline-variant/25 bg-black/25 p-4">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={ui.discoverySearchPlaceholder}
              className="w-full rounded-[1.2rem] border border-outline-variant/30 bg-[#05070a] px-5 py-4 text-base text-white shadow-inner focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex max-h-[70vh] min-h-[24rem] flex-col overflow-hidden">
            <div className="border-b border-outline-variant/20 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-outline">
              {searchQuery ? `MATCHING_RECORDS // ${visibleItems.length}` : ui.discoveryInitialState}
            </div>

            {groupedItems.length ? (
              <div className="overflow-y-auto p-4">
                <div className="space-y-5">
                  {groupedItems.map((section) => (
                    <section key={section.kind} className="space-y-2">
                      <div className="px-2 text-[10px] font-bold uppercase tracking-[0.22em] text-primary/80">
                        {section.label}
                      </div>
                      <div className="space-y-2">
                        {section.results.map((item) => {
                          const selected = item.globalIndex === activeIndex;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => openResult(item)}
                              onMouseEnter={() => setActiveIndex(item.globalIndex)}
                              className={`flex w-full items-start justify-between gap-4 rounded-[1.15rem] border px-4 py-4 text-left transition-all ${
                                selected
                                  ? 'border-primary/40 bg-primary/10 shadow-[0_0_0_1px_rgba(0,240,255,0.08)]'
                                  : 'border-outline-variant/20 bg-surface-container-lowest hover:border-outline-variant/35 hover:bg-surface-container'
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="mb-2 flex flex-wrap items-center gap-3">
                                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                                    {item.eyebrow}
                                  </span>
                                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-outline">
                                    {item.tag}
                                  </span>
                                </div>
                                <div className="text-lg font-black uppercase tracking-tight text-white">
                                  {item.title}
                                </div>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
                                  {item.summary}
                                </p>
                              </div>
                              <div className="shrink-0 rounded-full border border-outline-variant/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-outline">
                                {ui.discoveryOpenResult}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center px-6 py-10">
                <div className="max-w-md rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-6 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                    {ui.discoveryNoResultsTitle}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                    {ui.discoveryNoResultsBody}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function useDiscovery() {
  const context = useContext(DiscoveryContext);

  if (!context) {
    throw new Error('useDiscovery must be used within DiscoveryShell.');
  }

  return context;
}

export default function DiscoveryShell({ children, items, ui }: DiscoveryShellProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const closeDiscovery = useCallback(({ restoreFocus = true }: DiscoveryControlOptions = {}) => {
    setIsOpen(false);

    if (!restoreFocus) {
      return;
    }

    const trigger = triggerRef.current;

    if (trigger) {
      window.requestAnimationFrame(() => {
        trigger.focus();
      });
    }
  }, []);

  const openDiscovery = useCallback((trigger?: HTMLElement | null) => {
    triggerRef.current = trigger || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setIsOpen(true);
  }, []);

  const toggleDiscovery = useCallback((trigger?: HTMLElement | null) => {
    if (isOpen) {
      closeDiscovery();
      return;
    }

    openDiscovery(trigger);
  }, [closeDiscovery, isOpen, openDiscovery]);

  const value = useMemo<DiscoveryContextValue>(() => ({
    isOpen,
    openDiscovery,
    closeDiscovery,
    toggleDiscovery,
  }), [closeDiscovery, isOpen, openDiscovery, toggleDiscovery]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        toggleDiscovery();
      }

      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        closeDiscovery();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [closeDiscovery, isOpen, toggleDiscovery]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <DiscoveryContext.Provider value={value}>
      {children}
      <button
        type="button"
        onClick={(event) => toggleDiscovery(event.currentTarget)}
        aria-label={ui.discoveryOpen}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="fixed bottom-6 right-6 z-[110] flex h-14 w-14 items-center justify-center border-4 border-black bg-primary shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:translate-x-1 active:translate-x-0 active:translate-y-0"
      >
        <span className="font-black text-xl text-black">&gt;_</span>
      </button>
      <DiscoveryPalette
        isOpen={isOpen}
        items={items}
        onClose={closeDiscovery}
        ui={ui}
      />
    </DiscoveryContext.Provider>
  );
}
