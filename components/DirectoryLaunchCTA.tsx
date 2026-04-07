'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DirectoryLaunchCTA() {
  return (
    <div className="relative py-32 bg-black border-t border-outline-variant/30 flex items-center justify-center overflow-hidden">
      
      {/* Intense Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="flex flex-col items-center"
        >
          <div className="inline-block mb-6 px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-[10px] font-mono tracking-widest uppercase">
            System Initialization
          </div>
          
          <h2 className="text-4xl md:text-6xl font-space font-black uppercase text-white tracking-widest mb-12 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Access The<br className="md:hidden" /> <span className="text-primary drop-shadow-[0_0_30px_rgba(0,240,255,0.3)]">Full Directory</span>
          </h2>

          <Link href="/ecosystem" className="group relative inline-flex items-center justify-center bg-[#080a0d] border-2 border-outline-variant/40 px-8 py-5 md:px-12 md:py-6 overflow-hidden transition-colors duration-300 hover:border-primary shadow-[0_0_0_rgba(0,240,255,0)] hover:shadow-[0_0_40px_rgba(0,240,255,0.4)]">
            
            {/* The Matrix Scramble Hover Effect */}
            <div className="absolute inset-0 bg-primary translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0" />
            
            <div className="relative z-10 font-mono text-sm md:text-lg text-primary font-bold tracking-[0.2em] group-hover:text-black transition-colors duration-300 flex items-center gap-3">
              <span className="opacity-50 group-hover:opacity-100">&gt;</span> 
              INITIALIZE_DIRECTORY_SYNC
              <span className="w-2.5 h-[1.2em] bg-primary block animate-pulse group-hover:bg-black" />
            </div>
            
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/30 group-hover:border-black/50 transition-colors" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/30 group-hover:border-black/50 transition-colors" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/30 group-hover:border-black/50 transition-colors" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/30 group-hover:border-black/50 transition-colors" />

          </Link>
        </motion.div>
      </div>
    </div>
  );
}
