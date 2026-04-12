'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Globe, Twitter, Github, BarChart2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface SerializableProject {
  id: number;
  slug: string;
  title: string;
  tag: string;
  summary: string;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
  twitter: string | null;
  github: string | null;
  projectEmail: string | null;
  discordInvite: string | null;
  telegramInvite: string | null;
  relationshipType: string | null;
  statusNote: string | null;
  lastReviewed: string | null;
  status: string;
  categoryId: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProjectsClient({ initialProjects }: { initialProjects: SerializableProject[] }) {
  const [projects, setProjects] = useState<SerializableProject[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<SerializableProject | null>(null);
  const router = useRouter();

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      
      setProjects(prev => prev.filter(p => p.id !== id));
      if (selectedProject?.id === id) setSelectedProject(null);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-white w-full">
      {/* List View */}
      <div className="lg:col-span-1 space-y-4">
        <h2 className="font-mono text-primary border-b border-primary/20 pb-2 mb-4 uppercase tracking-widest text-xs">
          &gt; MANAGED_ENTITIES ({projects.length})
        </h2>
        <div className="space-y-2 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`w-full text-left p-4 border font-mono transition-all duration-200 admin-button ${
                selectedProject?.id === project.id 
                  ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,255,163,0.05)]' 
                  : 'border-white/5 bg-white/0 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sm truncate pr-2 uppercase tracking-tight">{project.title}</span>
                <span className={`text-[9px] px-1.5 py-0.5 border border-primary/30 text-primary bg-primary/5 uppercase font-bold`}>
                  {project.categoryId}
                </span>
              </div>
              <div className="text-[10px] text-zinc-500 truncate mb-1">{project.tag}</div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                 <span className="text-[9px] text-zinc-600">ID: {project.id}</span>
                 <span className="text-[9px] text-zinc-600">
                    {project.createdAt?.includes('T') ? project.createdAt.split('T')[0] : 'N/A'}
                 </span>
              </div>
            </button>
          ))}
          {projects.length === 0 && (
            <div className="text-zinc-500 font-mono text-xs border border-dashed border-white/10 p-8 text-center italic">
              NO_PROJECTS_SYNCED
            </div>
          )}
        </div>
      </div>

      {/* Detail View */}
      <div className="lg:col-span-2">
        {selectedProject ? (
          <div className="console-window p-8 min-h-[700px] bg-black/40 relative border border-white/10">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8 border-b border-white/10 pb-6">
              <div className="flex gap-4">
                {selectedProject.logoUrl && (
                  <div className="h-16 w-16 bg-zinc-900 border border-white/10 p-2 shrink-0">
                    <img src={selectedProject.logoUrl} alt="" className="h-full w-full object-contain" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-black font-space text-white uppercase tracking-tight mb-1">
                    {selectedProject.title}
                  </h1>
                  <div className="flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                    <span>{selectedProject.tag}</span>
                    <span className="text-zinc-600">/</span>
                    <span className="text-zinc-400">{selectedProject.slug}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <Link
                  href={`/admin/projects/${selectedProject.id}/edit`}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/20 text-white hover:bg-white/10 font-mono text-[10px] font-bold uppercase tracking-widest transition-all admin-button"
                >
                  <Pencil size={12} /> Edit
                </Link>
                <button 
                  onClick={() => handleDelete(selectedProject.id)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/5 border border-red-500/30 text-red-500 hover:bg-red-500/10 font-mono text-[10px] font-bold uppercase tracking-widest transition-all admin-button"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
               <div className="md:col-span-2 space-y-8">
                  <section>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">01 // PROJECT_SUMMARY</h3>
                    <p className="text-zinc-400 font-mono text-sm leading-relaxed pl-4 border-l-2 border-primary/20">
                      {selectedProject.summary}
                    </p>
                  </section>

                  {selectedProject.description && (
                    <section>
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">02 // DETAILED_INTEL</h3>
                      <div className="text-zinc-500 font-mono text-sm leading-relaxed pl-4 border-l-2 border-zinc-800 whitespace-pre-wrap">
                        {selectedProject.description}
                      </div>
                    </section>
                  )}
               </div>

               <div className="space-y-6">
                  <div className="p-4 border border-white/5 bg-white/5 rounded-sm">
                    <h3 className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-4 block border-b border-white/5 pb-2">SYS_METADATA</h3>
                    <div className="space-y-4 font-mono text-[10px] uppercase">
                       <div>
                          <span className="text-zinc-600 block mb-1">Status</span>
                          <span className="text-primary font-bold">{selectedProject.status}</span>
                       </div>
                       <div>
                          <span className="text-zinc-600 block mb-1">Featured</span>
                          <span className={selectedProject.isFeatured ? 'text-yellow-500' : 'text-zinc-400'}>
                             {selectedProject.isFeatured ? 'TRUE' : 'FALSE'}
                          </span>
                       </div>
                    </div>
                  </div>

                  <div className="p-4 border border-white/5 bg-zinc-900/40 rounded-sm">
                    <h3 className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-4 block border-b border-white/5 pb-2">COMM_LINKS</h3>
                    <div className="space-y-3">
                       {selectedProject.website && (
                         <a href={selectedProject.website} target="_blank" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-[10px]">
                           <Globe size={12} /> Website
                         </a>
                       )}
                       {selectedProject.twitter && (
                         <a href={selectedProject.twitter} target="_blank" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-[10px]">
                           <Twitter size={12} /> X_Twitter
                         </a>
                       )}
                       {selectedProject.github && (
                         <a href={selectedProject.github} target="_blank" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-[10px]">
                           <Github size={12} /> Github_Repo
                         </a>
                       )}
                       {selectedProject.discordInvite && (
                         <a href={selectedProject.discordInvite} target="_blank" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-[10px]">
                           <BarChart2 size={12} className="rotate-90" /> Discord_Invite
                         </a>
                       )}
                       {selectedProject.telegramInvite && (
                         <a href={selectedProject.telegramInvite} target="_blank" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-[10px]">
                           <BarChart2 size={12} /> Telegram_Invite
                         </a>
                       )}
                    </div>
                  </div>

                  <div className="p-4 border border-white/5 bg-red-500/5 rounded-sm">
                    <h3 className="text-[9px] font-bold uppercase tracking-widest text-[#ff0055] mb-4 block border-b border-[#ff0055]/20 pb-2">ADMIN_INTEL</h3>
                    <div className="space-y-4 font-mono text-[10px] uppercase">
                       <div>
                          <span className="text-zinc-600 block mb-1">Contact Email</span>
                          <span className="text-zinc-400">{selectedProject.projectEmail || 'NOT_SET'}</span>
                       </div>
                       <div>
                          <span className="text-zinc-600 block mb-1">Relationship</span>
                          <span className="text-zinc-400">{selectedProject.relationshipType}</span>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
            
            <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center font-mono text-[9px] text-zinc-700 uppercase tracking-tighter">
               <span>Origin: PostgreSQL_Instance</span>
               <span>Last_Update: {selectedProject.updatedAt}</span>
            </div>
          </div>
        ) : (
          <div className="console-window p-12 h-[700px] flex flex-col items-center justify-center border-dashed border-white/10 bg-black/20">
             <BarChart2 size={40} className="text-zinc-800 mb-4" />
            <span className="font-mono text-zinc-600 tracking-widest">AWAITING_ENTITY_SELECTION...</span>
            <p className="text-[10px] text-zinc-700 mt-2 font-mono uppercase tracking-tight text-center max-w-xs">
              Select a project from the review queue to analyze detail parameters or perform administrative actions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
