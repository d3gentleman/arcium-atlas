import ActionLink from './ActionLink';
import { LinkAction } from '../types/domain';

interface KnowledgeRecordCardProps {
  action: LinkAction;
  tag: string;
  title: string;
  summary: string;
  meta?: string;
  eyebrow?: string;
}

export default function KnowledgeRecordCard({
  action,
  tag,
  title,
  summary,
  meta,
  eyebrow,
}: KnowledgeRecordCardProps) {
  return (
    <ActionLink
      action={action}
      className="group block h-full border border-outline-variant/25 bg-surface-container-lowest p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-surface-container"
      unavailableClassName="group block h-full border border-outline-variant/25 bg-surface-container-lowest p-5 opacity-70"
    >
      <article className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            {eyebrow ? (
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</div>
            ) : null}
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-outline">{tag}</div>
          </div>
          {meta ? (
            <div className="shrink-0 rounded-full border border-outline-variant/25 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-primary">
              {meta}
            </div>
          ) : null}
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white transition-colors group-hover:text-primary">
            {title}
          </h2>
          <p className="text-sm leading-7 text-on-surface-variant">{summary}</p>
        </div>
        <div className="mt-auto pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          {action.label}
        </div>
      </article>
    </ActionLink>
  );
}
