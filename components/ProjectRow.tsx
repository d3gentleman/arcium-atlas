import Image from 'next/image';
import Link from 'next/link';
import { EcosystemProjectRecord } from '../types/domain';
import { ArrowRight } from 'lucide-react';

interface ProjectRowProps {
  project: EcosystemProjectRecord;
  color?: string;
}

export default function ProjectRow({ project, color = '#00FFA3' }: ProjectRowProps) {
  const website = `/ecosystem/${project.slug}`;

  return (
    <Link
      href={website}
      className="group relative flex items-center justify-between md:grid md:grid-cols-12 border-b border-outline-variant/20 last:border-b-0 bg-transparent px-4 py-5 transition-all duration-300 hover:bg-surface-container-low/30 overflow-hidden"
    >
      {/* Background glow on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(90deg, ${color}22 0%, transparent 100%)` }}
      />
      
      {/* Left colored border accent */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 scale-y-0 opacity-0 group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300 origin-center"
        style={{ backgroundColor: color }}
      />

      {/* 1. Project Title & Logo */}
      <div className="flex items-center gap-5 md:col-span-4 relative z-10 w-2/3 md:w-auto">
        <div className="relative h-12 w-12 shrink-0 bg-black/50 border border-outline-variant/30 p-2 transition-transform duration-500 group-hover:scale-110 shadow-inner">
          {project.logo ? (
            <Image
              src={project.logo}
              alt={`${project.title} logo`}
              fill
              className="object-contain p-1.5"
            />
          ) : (
            <div className="h-full w-full bg-outline-variant/20" />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1" style={{ color }}>
            {project.tag}
          </div>
          <h3 className="font-space text-lg font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors truncate">
            {project.title}
          </h3>
        </div>
      </div>

      {/* 2. Overview */}
      <div className="hidden md:block md:col-span-5 pr-8 relative z-10">
        <p className="font-jetbrains text-sm leading-relaxed text-on-surface-variant/70 line-clamp-2">
          {project.summary}
        </p>
      </div>

      {/* 3. Status */}
      <div className="hidden md:flex md:col-span-2 items-center gap-2 relative z-10">
        <div 
          className={`h-2 w-2 rounded-full ${project.status === 'sync_ok' ? '' : 'bg-on-surface-variant/30 animate-pulse'}`} 
          style={project.status === 'sync_ok' ? { backgroundColor: color, boxShadow: `0 0 10px ${color}99` } : {}}
        />
        <span className="text-[10px] font-mono text-on-surface-variant/60 uppercase tracking-widest whitespace-nowrap group-hover:text-white transition-colors">
          {project.status === 'sync_ok' ? 'ONLINE' : project.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* 4. Action / Arrow */}
      <div className="flex items-center justify-end md:col-span-1 relative z-10 shrink-0">
        <div 
          className="flex h-10 w-10 items-center justify-center border border-outline-variant/30 text-outline-variant/50 transition-all duration-300 group-hover:border-primary group-hover:bg-primary/10 group-hover:text-primary"
          style={{ borderColor: `rgba(255,255,255,0.1)` }}
        >
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:-rotate-45" />
        </div>
      </div>
    </Link>
  );
}
