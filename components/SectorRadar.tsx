'use client';

import { motion } from 'framer-motion';
import { getCategoryIcon } from '@/lib/categoryIcons';
import type { EcosystemCategoryRecord, EcosystemProjectRecord } from '@/types/domain';
import Link from 'next/link';

interface SectorRadarProps {
  categories: EcosystemCategoryRecord[];
  projects: EcosystemProjectRecord[];
  categoryColors: Record<string, string>;
}

export default function SectorRadar({ categories, projects, categoryColors }: SectorRadarProps) {
  // Sort categories by project count descending, then alphabetically
  const sortedCategories = [...categories].sort((a, b) => {
    const aCount = projects.filter(p => p.categoryId === a.id || p.categoryId === a.slug).length;
    const bCount = projects.filter(p => p.categoryId === b.id || p.categoryId === b.slug).length;
    if (aCount !== bCount) return bCount - aCount;
    return a.title.localeCompare(b.title);
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } },
  };

  return (
    <div className="relative overflow-hidden bg-[#06080a] border-b border-outline-variant/30 py-20">
      {/* Background Radar Effect */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
        <div className="w-[800px] h-[800px] rounded-full border border-primary/20 absolute" />
        <div className="w-[600px] h-[600px] rounded-full border border-primary/20 absolute" />
        <div className="w-[400px] h-[400px] rounded-full border border-primary/30 absolute" />
        <motion.div 
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{ background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(0, 240, 255, 0.1) 360deg)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-primary mb-3">
            System Scan Complete
          </h2>
          <div className="text-3xl font-space font-black uppercase tracking-widest text-white md:text-4xl">
            Sector Coverage Radar
          </div>
          <p className="max-w-2xl mx-auto mt-4 text-sm leading-6 text-on-surface-variant/70 font-jetbrains">
            Global view of builder node distribution across Arcium sectors. High-density sectors represent verified live entries.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {sortedCategories.map((category) => {
            const color = categoryColors[category.id] || categoryColors[category.slug] || '#00FFA3';
            const count = projects.filter(p => p.categoryId === category.id || p.categoryId === category.slug).length;
            const isActive = count > 0;

            return (
              <motion.div 
                key={category.id} 
                variants={itemVariants}
                whileHover={isActive ? { scale: 1.02, zIndex: 20 } : {}}
              >
                <Link
                  href={`/ecosystem/categories/${category.slug}`}
                  className={`group relative flex flex-col h-full p-5 border backdrop-blur-sm transition-colors duration-300 ${
                    isActive 
                      ? 'border-outline-variant/20 bg-black/40 hover:bg-black/60' 
                      : 'border-dashed border-outline-variant/15 bg-black/20 hover:border-outline-variant/30 grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
                  }`}
                  style={isActive ? { '--hover-color': color } as React.CSSProperties : {}}
                >
                  {/* Dynamic Hover Border Hack via pseudo-element to avoid direct style manipulation */}
                  {isActive && (
                    <div 
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100"
                      style={{ boxShadow: `inset 0 0 0 1px ${color}, 0 0 20px ${color}15` }}
                    />
                  )}

                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className="flex bg-black/50 border h-10 w-10 items-center justify-center transition-colors duration-300 group-hover:bg-black/80" style={{ borderColor: `${color}40` }}>
                      {getCategoryIcon(category.slug, color, 18)}
                    </div>
                    {isActive ? (
                      <div className="text-[10px] font-mono leading-none tracking-widest text-primary px-2 py-1 bg-primary/10 border border-primary/20">
                        ACTIVE
                      </div>
                    ) : (
                      <div className="text-[10px] font-mono leading-none tracking-widest text-on-surface-variant/40 px-2 py-1 border border-dashed border-outline-variant/20">
                        PENDING
                      </div>
                    )}
                  </div>
                  
                  <h3 
                    className="text-sm font-black uppercase tracking-wider text-white mb-1 transition-colors duration-300 relative z-10"
                  >
                    {category.title.replace(/\s+/g, '_')}
                  </h3>
                  
                  <div className="text-[11px] font-mono text-on-surface-variant/50 mb-6 flex-1 relative z-10">
                    {count} ENTITIES_MAPPED
                  </div>

                  {isActive && (
                    <div className="flex gap-[2px] mt-auto relative z-10">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="h-1 flex-1 bg-white/10"
                          style={{
                            backgroundColor: i < Math.min(count, 12) ? color : 'rgba(255,255,255,0.05)',
                            boxShadow: i < Math.min(count, 12) ? `0 0 8px ${color}80` : 'none',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
