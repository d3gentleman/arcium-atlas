import { getEcosystemProjectBySlug, getCategoryColors, getEcosystemCategories } from '@/lib/content';
import { notFound } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { getNavigation, getFooterConfig } from '@/lib/content';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github, Twitter, BarChart2 } from 'lucide-react';

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getEcosystemProjectBySlug(params.slug);
  
  if (!project) {
    notFound();
  }

  const [navLinks, footerConfig, categories, categoryColors] = await Promise.all([
    getNavigation(),
    getFooterConfig(),
    getEcosystemCategories(),
    getCategoryColors(),
  ]);

  const category = categories.find(c => c.id === project.categoryId || c.slug === project.categoryId);
  const color = category ? (categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3') : '#00FFA3';

  return (
    <div className="col-span-12 flex min-h-screen flex-col bg-background text-on-surface selection:bg-primary/30">
      <NavBar links={navLinks} />

      <main className="container mx-auto flex-1 px-4 py-12 md:px-8 space-y-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} /> Back to Hub
        </Link>
        
        <header className="relative border border-outline-variant/30 bg-surface-container-low/50 p-8 md:p-12 overflow-hidden shadow-[0_0_40px_rgba(var(--project-color-rgb),0.05)]" style={{ '--project-color-rgb': hexToRgb(color) } as React.CSSProperties}>
           <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: color }} />
           
           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-6">
                {project.logo && (
                  <div className="relative h-20 w-20 md:h-24 md:w-24 shrink-0 bg-black p-4 border border-outline-variant/30">
                    <Image src={project.logo} alt={project.title} fill className="object-contain p-2 filter grayscale invert" />
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color }}>
                    {"//"} {project.tag}
                  </div>
                  <h1 className="font-space text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                    {project.title}
                  </h1>
                </div>
              </div>

              <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                {project.website && (
                  <a href={project.website.startsWith('http') ? project.website : `https://${project.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] border transition-all hover:bg-primary/10 border-primary/50 text-white" style={{ borderColor: color }}>
                    Launch Application <ExternalLink size={14} />
                  </a>
                )}
                <div className="flex items-center justify-center gap-4 mt-2">
                  {project.twitter && (
                    <a href={project.twitter} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant/60 hover:text-white transition-colors">
                      <Twitter size={18} />
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant/60 hover:text-white transition-colors">
                      <Github size={18} />
                    </a>
                  )}
                </div>
              </div>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
                <div className="h-2 w-2 shadow-[0_0_8px_currentColor]" style={{ backgroundColor: color, color: color }} />
                <h2 className="font-space text-xl font-bold uppercase tracking-widest text-white">
                  Project_Overview
                </h2>
              </div>
              <p className="font-jetbrains text-sm leading-7 text-on-surface-variant/90 max-w-3xl whitespace-pre-line">
                {project.description || project.summary}
              </p>
            </section>
          </div>

          <aside className="space-y-8">
            {project.metrics && project.metrics.length > 0 && (
              <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-6">
                <h3 className="font-space text-sm font-bold uppercase tracking-widest text-on-surface-variant/50 mb-6 flex items-center gap-2">
                  <BarChart2 size={16} /> Key_Metrics
                </h3>
                <div className="space-y-6">
                  {project.metrics.map((metric, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">{metric.label}</div>
                      <div className="font-space text-2xl font-bold text-white tracking-tight">{metric.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-6">
               <h3 className="font-space text-sm font-bold uppercase tracking-widest text-on-surface-variant/50 mb-4">
                  System_Status
               </h3>
               <div className="flex items-center gap-2">
                  <div 
                    className={`h-2 w-2 rounded-full ${project.status === 'sync_ok' ? '' : 'bg-on-surface-variant/30 animate-pulse'}`} 
                    style={project.status === 'sync_ok' ? { backgroundColor: color, boxShadow: `0 0 10px ${color}99` } : {}}
                  />
                  <span className="text-xs font-mono text-white uppercase tracking-widest">
                      {project.status === 'sync_ok' ? 'ONLINE (SYNC_OK)' : project.status.replace('_', ' ').toUpperCase()}
                  </span>
              </div>
            </div>
          </aside>
        </div>

      </main>
      <Footer config={footerConfig} />
    </div>
  );
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '47, 230, 166';
}
