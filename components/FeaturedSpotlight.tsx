/* eslint-disable @next/next/no-img-element */
'use client';

import { motion } from 'framer-motion';
import type { EcosystemProjectRecord } from '@/types/domain';
import Link from 'next/link';

interface FeaturedSpotlightProps {
  projects: EcosystemProjectRecord[];
}

export default function FeaturedSpotlight({ projects }: FeaturedSpotlightProps) {
  if (projects.length === 0) return null;

  return (
    <div className="relative py-24 bg-[#05070a] border-b border-outline-variant/30 overflow-hidden">
      
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[400px] bg-[#ff00ea]/5 blur-[120px] rounded-[100%] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-on-surface-variant/70 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff00ea] animate-pulse shadow-[0_0_8px_#ff00ea]" />
              High-Signal Telemetry
            </h2>
            <div className="text-3xl font-space font-black uppercase tracking-widest text-[#fff] md:text-4xl">
              Featured Entities
            </div>
          </div>
          <div className="hidden md:block text-[11px] font-mono uppercase tracking-widest text-on-surface-variant/40 border-b border-outline-variant/20 pb-2">
            Priority Index: Top {projects.length}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: 'easeOut' }}
              className="group relative"
            >
              <Link href={`/ecosystem/${project.slug}`} className="block h-full">
                
                {/* Glowing border container */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/10 via-[#ff00ea]/20 to-primary/10 bg-[length:200%_auto] transition-all duration-700 opacity-0 group-hover:opacity-100 blur-[2px]" />
                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 via-[#ff00ea]/40 to-primary/30 bg-[length:200%_auto] transition-all duration-700 opacity-0 group-hover:opacity-100 border border-transparent" style={{ animation: 'shift-gradient 3s linear infinite' }} />
                
                <div className="relative h-full bg-[#080a0d]/90 backdrop-blur-xl border border-outline-variant/15 flex flex-col transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="aspect-[16/9] w-full border-b border-outline-variant/15 overflow-hidden relative bg-[#020202]">
                    
                    {/* Scanline overlay for image */}
                    <div className="absolute inset-0 z-10 scanline-effect opacity-50 mix-blend-overlay" />
                    
                    {project.logo ? (
                      <img 
                        src={project.logo} 
                        alt={project.title} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 mix-blend-screen"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high/50 to-black flex items-center justify-center">
                        <span className="text-3xl opacity-10 uppercase font-black tracking-tighter mix-blend-overlay">{project.title}</span>
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 z-20 bg-black/80 border border-outline-variant/30 text-[10px] font-mono px-2 py-1 text-on-surface-variant tracking-widest uppercase backdrop-blur-md transition-colors group-hover:border-primary/40 group-hover:text-white">
                      MODULE: {project.categoryId}
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white mb-3 flex items-center gap-3 transition-colors group-hover:text-primary">
                      {project.title}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </h3>
                    <p className="text-sm font-jetbrains text-on-surface-variant leading-relaxed line-clamp-3 mb-6 relative z-10">
                      {project.summary}
                    </p>

                    <div className="mt-auto grid grid-cols-2 gap-4 border-t border-outline-variant/10 pt-5">
                      <div>
                        <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-on-surface-variant/40 mb-1">Status</div>
                        <div className="text-[11px] font-bold uppercase tracking-widest text-[#2fe6a6]">{project.status.replace('_', ' ')}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-on-surface-variant/40 mb-1">Entity ID</div>
                        <div className="text-[11px] font-mono text-on-surface-variant/50 truncate">
                          0x{project.id.replace(/[^a-zA-Z0-9]/g, '').slice(0,8).toLowerCase()}...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Inline style for the gradient shift animation specific to these cards */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shift-gradient {
          0% { background-position: 200% center; }
          100% { background-position: 0% center; }
        }
      `}} />
    </div>
  );
}
