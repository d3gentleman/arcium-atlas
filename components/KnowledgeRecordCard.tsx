import ActionLink from './ActionLink';
import { LinkAction } from '../types/domain';

export type KnowledgeRecordCardVariant = 'default' | 'featured' | 'compact-list';

interface KnowledgeRecordCardProps {
  action: LinkAction;
  tag: string;
  title: string;
  summary: string;
  meta?: string;
  eyebrow?: string;
  variant?: KnowledgeRecordCardVariant;
}

export default function KnowledgeRecordCard({
  action,
  tag,
  title,
  summary,
  meta,
  eyebrow,
  variant = 'default',
}: KnowledgeRecordCardProps) {
  if (variant === 'compact-list') {
    return (
      <ActionLink
        action={action}
        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/25 py-4 transition-colors hover:bg-surface-container-lowest/50 px-4 -mx-4 rounded-xl"
        unavailableClassName="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/25 py-4 opacity-70 px-4 -mx-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 flex-1 min-w-0">
          <div className="flex items-center gap-3 shrink-0">
            {meta ? (
              <span className="text-[10px] uppercase font-bold tracking-[0.14em] text-primary whitespace-nowrap">{meta}</span>
            ) : null}
            <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-outline whitespace-nowrap">{tag}</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-black uppercase tracking-tight text-white transition-colors group-hover:text-primary truncate">
              {title}
            </h2>
            <p className="text-xs text-on-surface-variant truncate">{summary}</p>
          </div>
        </div>
        <div className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-primary opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 sm:flex hidden">
          {action.label} &rarr;
        </div>
      </ActionLink>
    );
  }

  const isFeatured = variant === 'featured';
  const baseClasses = "group block h-full border p-5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary";
  const hoverTranslate = "hover:-translate-y-1";
  
  const defaultClasses = `${baseClasses} border-outline-variant/25 bg-surface-container-lowest hover:border-primary/40 hover:bg-surface-container ${hoverTranslate}`;
  const featuredClasses = `${baseClasses} border-primary/30 bg-primary/5 hover:border-primary/60 hover:bg-primary/10 ${hoverTranslate} lg:col-span-2 relative overflow-hidden rounded-[1.4rem]`;

  const unavailableDefault = "group block h-full border border-outline-variant/25 bg-surface-container-lowest p-5 opacity-70";
  const unavailableFeatured = "group block h-full border border-primary/30 bg-primary/5 p-5 opacity-70 lg:col-span-2 rounded-[1.4rem]";

  return (
    <ActionLink
      action={action}
      className={isFeatured ? featuredClasses : defaultClasses}
      unavailableClassName={isFeatured ? unavailableFeatured : unavailableDefault}
    >
      <article className="flex h-full flex-col gap-4 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            {eyebrow ? (
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</div>
            ) : null}
            <div className={`text-[10px] font-bold uppercase tracking-[0.18em] ${isFeatured ? 'text-primary/70' : 'text-outline'}`}>{tag}</div>
          </div>
          {meta ? (
            <div className={`shrink-0 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.14em] ${isFeatured ? 'border-primary/40 text-primary bg-primary/10' : 'border-outline-variant/25 text-primary'}`}>
              {meta}
            </div>
          ) : null}
        </div>
        <div className="space-y-3">
          <h2 className={`${isFeatured ? 'text-3xl lg:text-4xl' : 'text-2xl'} font-black uppercase tracking-tight text-white transition-colors group-hover:text-primary inline-flex items-center gap-2`}>
            {title}
            <span className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary text-xl hidden sm:inline-block">
              &rarr;
            </span>
          </h2>
          <p className={`text-sm leading-7 ${isFeatured ? 'text-on-surface-variant/90 max-w-2xl' : 'text-on-surface-variant'}`}>{summary}</p>
        </div>
        <div className="mt-auto pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          {action.label}
        </div>
      </article>
      {isFeatured && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
      )}
    </ActionLink>
  );
}
