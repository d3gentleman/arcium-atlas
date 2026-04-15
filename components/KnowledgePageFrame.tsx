import Link from 'next/link';
import type { ReactNode } from 'react';
import PublicPageShell from './PublicPageShell';

interface Breadcrumb {
  label: string;
  href: string;
}

interface KnowledgePageFrameProps {
  eyebrow: string;
  title: string;
  summary: string;
  statusLabel: string;
  breadcrumbs?: Breadcrumb[];
  meta?: ReactNode;
  logoNode?: ReactNode;
  children: ReactNode;
  backgroundVariant?: 'default' | 'calm';
}

export default function KnowledgePageFrame({
  eyebrow,
  title,
  summary,
  statusLabel,
  breadcrumbs = [],
  meta,
  logoNode,
  children,
  backgroundVariant = 'default',
}: KnowledgePageFrameProps) {
  return (
    <PublicPageShell backgroundVariant={backgroundVariant} mainClassName="space-y-8">
      <section className="console-window col-span-12 overflow-hidden">
        <div className="console-header">
          <span>{eyebrow}</span>
          <span className="text-primary">{statusLabel}</span>
        </div>
        <div className="grid gap-8 p-6 md:grid-cols-[minmax(0,1fr)_18rem] md:p-8">
          <div className="space-y-6">
            {breadcrumbs.length > 0 && (
              <nav className="flex flex-wrap items-center gap-2 text-xs font-bold text-outline">
                {breadcrumbs.map((crumb, index) => (
                  <span key={crumb.href} className="flex items-center gap-2">
                    <Link href={crumb.href} className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
                      {crumb.label}
                    </Link>
                    {index < breadcrumbs.length - 1 ? <span className="text-outline-variant">/</span> : null}
                  </span>
                ))}
              </nav>
            )}
            <div>
              <div className="flex items-center gap-4 md:gap-6 mb-3">
                {logoNode}
                <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white md:text-5xl text-wrap break-words">
                  {title}
                </h1>
              </div>
            </div>
            <p className="max-w-3xl text-base leading-8 text-on-surface-variant">
              {summary}
            </p>
          </div>
          <aside className="h-fit rounded-2xl border border-outline-variant/25 bg-black/20 p-6 shadow-inner backdrop-blur-sm">
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-outline">
              Context
            </div>
            <div className="space-y-3 text-sm text-outline">
              {meta}
            </div>
          </aside>
        </div>
      </section>
      <div className="col-span-12">
        {children}
      </div>
    </PublicPageShell>
  );
}
