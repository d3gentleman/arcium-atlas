import Link from 'next/link';
import type { ReactNode } from 'react';
import Footer from './Footer';
import NavBar from './NavBar';
import { getFooterConfig, getNavigation } from '@/lib/content';
import { LinkAction, FooterConfig } from '../types/domain';

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
  children: ReactNode;
}

export default async function KnowledgePageFrame({
  eyebrow,
  title,
  summary,
  statusLabel,
  breadcrumbs = [],
  meta,
  children,
}: KnowledgePageFrameProps) {
  const navLinks: LinkAction[] = await getNavigation();
  const footerConfig: FooterConfig = await getFooterConfig();

  return (
    <>
      <NavBar links={navLinks} />
      <section className="console-window col-span-12 overflow-hidden">
        <div className="console-header">
          <span>{eyebrow}</span>
          <span className="text-primary">{statusLabel}</span>
        </div>
        <div className="grid gap-8 p-6 md:grid-cols-[minmax(0,1fr)_18rem] md:p-8">
          <div className="space-y-6">
            {breadcrumbs.length > 0 && (
              <nav className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-outline">
                {breadcrumbs.map((crumb, index) => (
                  <span key={crumb.href} className="flex items-center gap-3">
                    <Link href={crumb.href} className="transition-colors hover:text-primary">
                      {crumb.label}
                    </Link>
                    {index < breadcrumbs.length - 1 ? <span>/</span> : null}
                  </span>
                ))}
              </nav>
            )}
            <div>
              <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">{eyebrow}</div>
              <h1 className="max-w-4xl text-4xl font-black uppercase tracking-tight text-white md:text-6xl text-wrap break-words">
                {title}
              </h1>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-on-surface-variant md:text-base">
              {summary}
            </p>
          </div>
          <aside className="rounded-[1.5rem] border border-outline-variant/25 bg-black/25 p-5 shadow-inner backdrop-blur-sm h-fit">
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-primary/80">
              Context
            </div>
            <div className="space-y-3 text-xs uppercase tracking-[0.16em] text-outline">
              <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3 text-primary">
                STATUS // {statusLabel}
              </div>
              {meta}
            </div>
          </aside>
        </div>
      </section>
      {children}
      <Footer config={footerConfig} />
    </>
  );
}
