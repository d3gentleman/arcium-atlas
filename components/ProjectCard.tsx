import Image from 'next/image';
import { EcosystemProjectRecord } from '../types/domain';

interface ProjectCardProps {
  project: EcosystemProjectRecord;
  color?: string;
}

export default function ProjectCard({ project, color = '#00FFA3' }: ProjectCardProps) {
  const isComingSoon = project.status === 'coming_soon';

  return (
    <div 
      className="group relative border border-outline-variant/30 bg-surface-container-high/40 p-6 transition-all duration-300 hover:bg-surface-container-high shadow-[4px_4px_0px_rgba(0,0,0,0.4)] hover:shadow-[0_0_20px_rgba(var(--card-glow-rgb),0.15)] overflow-hidden"
      style={{ 
        '--card-glow-rgb': hexToRgb(color),
        borderColor: `rgba(${hexToRgb(color)}, 0.1)` 
      } as any}
    >
      {/* Decorative colored corner */}
      <div 
        className="absolute top-0 right-0 h-1 w-12 transition-transform duration-300 group-hover:scale-x-150 origin-right"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <div 
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: color }}
          >
            {project.tag}
          </div>
          <h2 className="font-space text-2xl font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">
            {project.title}
          </h2>
        </div>
        
        {project.logo && (
          <div className="relative h-10 w-10 flex-shrink-0 transition-transform duration-500 group-hover:scale-110">
            <Image
              src={project.logo}
              alt={`${project.title} logo`}
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>

      <p className="font-jetbrains text-sm leading-6 text-on-surface-variant/80 mb-8 line-clamp-3">
        {project.summary}
      </p>

      <div className="flex items-center justify-between mt-auto">
        {isComingSoon ? (
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/40">
            Coming Soon _
          </span>
        ) : (
          <a
            href={project.website || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-1"
            style={{ color: color }}
          >
            Visit Project <span>↗</span>
          </a>
        )}
        
        <div className="flex items-center gap-2">
            <div 
              className={`h-1.5 w-1.5 rounded-full ${project.status === 'sync_ok' ? '' : 'bg-on-surface-variant/30'}`} 
              style={project.status === 'sync_ok' ? { backgroundColor: color, boxShadow: `0 0 8px ${color}99` } : {}}
            />
            <span className="text-[8px] font-mono text-on-surface-variant/60 uppercase">
                {project.status === 'sync_ok' ? 'SYNC_OK' : project.status.toUpperCase()}
            </span>
        </div>
      </div>
      
      {/* Hover glow effect background */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }}
      />
    </div>
  );
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '47, 230, 166';
}
