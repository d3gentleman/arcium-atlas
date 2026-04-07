import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="col-span-12 flex min-h-[70vh] items-center justify-center px-4 py-16">
      <section className="console-window w-full max-w-3xl overflow-hidden">
        <div className="console-header">
          <span>MODULE_404: RECORD_NOT_FOUND</span>
          <span className="text-primary">PATH_UNRESOLVED</span>
        </div>

        <div className="space-y-6 p-8 md:p-10">
          <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
            Route Missing
          </div>
          <h1 className="font-space text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
            This atlas record does not exist
          </h1>
          <p className="max-w-2xl text-base leading-8 text-on-surface-variant">
            The page may have moved, the URL may be wrong, or this record has not been published yet.
            Use one of the live sections below to get back to the public site.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/"
              className="border border-primary/40 bg-primary/10 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/20 hover:text-white"
            >
              Back to Hub
            </Link>
            <Link
              href="/ecosystem"
              className="border border-outline-variant/30 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-outline transition-colors hover:bg-surface-container hover:text-white"
            >
              Browse Directory
            </Link>
            <Link
              href="/ecosystem/categories"
              className="border border-outline-variant/30 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-outline transition-colors hover:bg-surface-container hover:text-white"
            >
              Browse Sectors
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
