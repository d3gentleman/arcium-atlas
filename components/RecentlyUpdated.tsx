import Link from 'next/link';
import { KnowledgeArticleRecord } from '../types/domain';
import { getKnowledgeArticlePath } from '@/lib/content';

export default function RecentlyUpdated({ articles }: { articles: KnowledgeArticleRecord[] }) {
  return (
    <section className="console-window">
      <div className="console-header">
        <span>MODULE_04: RECENTLY_UPDATED</span>
        <span className="text-primary">LIVE_FEED: ACTIVE</span>
      </div>
      <div className="p-4 flex flex-col gap-2">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={getKnowledgeArticlePath(article.slug)}
            className="flex justify-between items-center bg-surface-container-lowest border border-outline-variant/20 p-4 hover:bg-surface-container transition-colors group"
          >
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-primary font-bold tracking-widest">{article.tag}</span>
              <span className="text-sm font-bold uppercase group-hover:text-primary transition-colors">{article.title}</span>
            </div>
            <div className="text-[10px] font-mono text-outline">{article.date || 'LATEST'}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
