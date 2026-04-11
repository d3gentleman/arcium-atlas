'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject, updateProject } from '@/lib/actions/projects';
import { EcosystemCategoryRecord } from '@/types/domain';
import { ChevronLeft, Save, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ProjectFormData {
  title: string;
  slug: string;
  tag: string;
  summary: string;
  description: string;
  logoUrl: string;
  website: string;
  docs: string;
  twitter: string;
  github: string;
  status: string;
  categoryId: string;
  isFeatured: boolean;
  projectEmail: string;
  discordInvite: string;
  telegramInvite: string;
  relationshipType: string;
  statusNote: string;
  lastReviewed: string;
  [key: string]: string | boolean | undefined;
}

interface ProjectFormProps {
  initialData?: Record<string, unknown>;
  categories: EcosystemCategoryRecord[];
}

export default function ProjectForm({ initialData, categories }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: (initialData?.title as string) || '',
    slug: (initialData?.slug as string) || '',
    tag: (initialData?.tag as string) || 'ECOSYSTEM',
    summary: (initialData?.summary as string) || '',
    description: (initialData?.description as string) || '',
    logoUrl: (initialData?.logoUrl as string) || '',
    website: (initialData?.website as string) || '',
    docs: (initialData?.docs as string) || '',
    twitter: (initialData?.twitter as string) || '',
    github: (initialData?.github as string) || '',
    projectEmail: (initialData?.projectEmail as string) || '',
    discordInvite: (initialData?.discordInvite as string) || '',
    telegramInvite: (initialData?.telegramInvite as string) || '',
    relationshipType: (initialData?.relationshipType as string) || 'unreviewed',
    statusNote: (initialData?.statusNote as string) || '',
    lastReviewed: (initialData?.lastReviewed as string) || '',
    status: (initialData?.status as string) || 'sync_ok',
    categoryId: (initialData?.categoryId as string) || (categories[0]?.slug || ''),
    isFeatured: (initialData?.isFeatured as boolean) || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const generateSlug = () => {
    if (!formData.title) return;
    const slug = formData.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
    setFormData(prev => ({ ...prev, slug: `proj-${slug}` }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = initialData 
        ? await updateProject(initialData.id as number, formData)
        : await createProject(formData);
        
      if (res.success) {
        router.push('/admin/projects');
        router.refresh();
      } else {
        alert('Error: ' + res.error);
      }
    } catch {
      alert('An error occurred during entity synchronization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 font-mono pb-20">
      <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-4">
        <Link 
          href="/admin/projects" 
          className="text-zinc-500 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest transition-colors"
        >
          <ChevronLeft size={14} /> Back_To_Registry
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-primary text-black px-6 py-2 font-bold uppercase tracking-widest text-xs hover:bg-[#00d185] disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(0,255,163,0.3)] hover:shadow-[0_0_20px_rgba(0,255,163,0.5)]"
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
          {initialData ? 'Update_Entity' : 'Sync_New_Entity'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Core Identity */}
        <div className="space-y-6">
          <h3 className="text-primary text-[10px] font-bold uppercase tracking-widest border-l-2 border-primary pl-3 mb-6">
            Core_Identity_Parameters
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-zinc-500 text-[9px] uppercase tracking-widest mb-2 font-bold">Project_Title</label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={() => !formData.slug && generateSlug()}
                className="w-full bg-zinc-900/50 border border-white/10 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-zinc-700"
                placeholder="e.g. Arcium Atlas"
              />
            </div>

            <div className="relative">
              <label className="block text-zinc-500 text-[9px] uppercase tracking-widest mb-2 font-bold">Entity_Slug</label>
              <input
                required
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 border border-white/10 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-zinc-700 font-mono"
                placeholder="proj-example-name"
              />
              <button 
                type="button" 
                onClick={generateSlug}
                className="absolute right-3 bottom-3 text-zinc-600 hover:text-primary transition-colors"
                title="Regenerate slug"
              >
                <Sparkles size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-500 text-[9px] uppercase tracking-widest mb-2 font-bold">Category_Sector</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-white/10 p-3 text-sm focus:border-primary outline-none text-white appearance-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat.slug} value={cat.slug}>{cat.title.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-zinc-500 text-[9px] uppercase tracking-widest mb-2 font-bold">Entity_Tag</label>
                <input
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/50 border border-white/10 p-3 text-sm focus:border-primary outline-none"
                  placeholder="e.g. INFRASTRUCTURE"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Visibility & Status */}
        <div className="space-y-6">
          <h3 className="text-primary text-[10px] font-bold uppercase tracking-widest border-l-2 border-primary pl-3 mb-6">
            Visibility_&_Runtime_Status
          </h3>

          <div className="space-y-4">
             <div>
                <label className="block text-zinc-500 text-[9px] uppercase tracking-widest mb-2 font-bold">Runtime_Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-white/10 p-3 text-sm focus:border-primary outline-none text-white appearance-none cursor-pointer"
                >
                  <option value="sync_ok">SYNC_OK (Live)</option>
                  <option value="coming_soon">COMING_SOON</option>
                  <option value="maintenance">MAINTENANCE</option>
                  <option value="deprecated">DEPRECATED</option>
                </select>
              </div>

              <div className="flex items-center gap-4 p-4 border border-white/5 bg-white/5">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                  className="h-4 w-4 bg-zinc-900 border-white/20 rounded text-primary focus:ring-primary"
                />
                <label htmlFor="isFeatured" className="text-[10px] uppercase font-bold tracking-widest cursor-pointer select-none">
                  Flag_As_Featured_Entity
                </label>
              </div>

              <div>
                <label className="block text-zinc-500 text-[9px] uppercase tracking-widest mb-2 font-bold">Logo_Asset_Url</label>
                <input
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/50 border border-white/10 p-3 text-sm focus:border-primary outline-none"
                  placeholder="https://... or /images/..."
                />
                {formData.logoUrl && (
                  <div className="mt-2 p-2 border border-white/5 w-16 h-16 bg-black flex items-center justify-center">
                    <img src={formData.logoUrl} alt="Preview" className="max-w-full max-h-full" />
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6">
          <h3 className="text-primary text-[10px] font-bold uppercase tracking-widest border-l-2 border-primary pl-3 mb-6">
            Core_Narrative
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-zinc-500 text-[9px] uppercase tracking-widest mb-2 font-bold">Brief_Summary</label>
              <textarea
                required
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={2}
                className="w-full bg-zinc-900/50 border border-white/10 p-3 text-sm focus:border-primary outline-none resize-none"
                placeholder="Short 1-2 sentence overview..."
              />
            </div>

            <div>
              <label className="block text-zinc-500 text-[9px] uppercase tracking-widest mb-2 font-bold">Detailed_Description (Markdown_Supported)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full bg-zinc-900/50 border border-white/10 p-3 text-sm focus:border-primary outline-none resize-y custom-scrollbar"
                placeholder="Full project details, technical specifics, etc..."
              />
            </div>
          </div>
      </div>

      <div className="space-y-6 pt-6 mb-10">
          <h3 className="text-primary text-[10px] font-bold uppercase tracking-widest border-l-2 border-primary pl-3 mb-6">
            Comm_Intelligence_Links
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-zinc-500 text-[9px] uppercase tracking-widest mb-2 font-bold">Official_Website</label>
                <input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/50 border border-white/10 p-3 text-sm focus:border-primary outline-none"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-zinc-500 text-[9px] uppercase tracking-widest mb-2 font-bold">Documentation_Hub</label>
                <input
                  name="docs"
                  value={formData.docs}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/50 border border-white/10 p-3 text-sm focus:border-primary outline-none"
                  placeholder="https://docs..."
                />
              </div>
              <div>
                <label className="block text-zinc-500 text-[9px] uppercase tracking-widest mb-2 font-bold">X_Twitter_Handler</label>
                <input
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/50 border border-white/10 p-3 text-sm focus:border-primary outline-none"
                  placeholder="https://x.com/..."
                />
              </div>
              <div>
                <label className="block text-zinc-500 text-[9px] uppercase tracking-widest mb-2 font-bold">Github_Repository</label>
                <input
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/50 border border-white/10 p-3 text-sm focus:border-primary outline-none"
                  placeholder="https://github.com/..."
                />
              </div>
          </div>
      </div>

      <div className="space-y-6 pt-6 mb-10">
          <h3 className="text-primary text-[10px] font-bold uppercase tracking-widest border-l-2 border-primary pl-3 mb-6">
            Social_Intelligence_Parameters
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-zinc-500 text-[9px] uppercase tracking-widest mb-2 font-bold">Discord_Invite_Url</label>
                <input
                  name="discordInvite"
                  value={formData.discordInvite}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/50 border border-white/10 p-3 text-sm focus:border-primary outline-none"
                  placeholder="https://discord.gg/..."
                />
              </div>
              <div>
                <label className="block text-zinc-500 text-[9px] uppercase tracking-widest mb-2 font-bold">Telegram_Invite_Url</label>
                <input
                  name="telegramInvite"
                  value={formData.telegramInvite}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/50 border border-white/10 p-3 text-sm focus:border-primary outline-none"
                  placeholder="https://t.me/..."
                />
              </div>
          </div>
      </div>

      <div className="space-y-6 pt-6 mb-20">
          <h3 className="text-[#ff0055] text-[10px] font-bold uppercase tracking-widest border-l-2 border-[#ff0055] pl-3 mb-6">
            Internal_Governance_Metadata
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-zinc-500 text-[9px] uppercase tracking-widest mb-2 font-bold">Project_Contact_Email (Private)</label>
                <input
                  name="projectEmail"
                  value={formData.projectEmail}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/50 border border-white/10 p-3 text-sm focus:border-primary outline-none"
                  placeholder="contact@project.com"
                />
              </div>
              <div>
                <label className="block text-zinc-500 text-[9px] uppercase tracking-widest mb-2 font-bold">Relationship_Type</label>
                <select
                  name="relationshipType"
                  value={formData.relationshipType}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-white/10 p-3 text-sm focus:border-primary outline-none text-white appearance-none cursor-pointer"
                >
                  <option value="unreviewed">UNREVIEWED</option>
                  <option value="confirmed_integration">CONFIRMED_INTEGRATION</option>
                  <option value="ecosystem_project">ECOSYSTEM_PROJECT</option>
                  <option value="reference_project">REFERENCE_PROJECT</option>
                  <option value="watchlist">WATCHLIST</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-zinc-500 text-[9px] uppercase tracking-widest mb-2 font-bold">Status_Note</label>
                <input
                  name="statusNote"
                  value={formData.statusNote}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/50 border border-white/10 p-3 text-sm focus:border-primary outline-none"
                  placeholder="Internal notes on project status..."
                />
              </div>
              <div>
                <label className="block text-zinc-500 text-[9px] uppercase tracking-widest mb-2 font-bold">Last_Reviewed_Date</label>
                <input
                  name="lastReviewed"
                  value={formData.lastReviewed}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/50 border border-white/10 p-3 text-sm focus:border-primary outline-none"
                  placeholder="YYYY-MM-DD"
                />
              </div>
          </div>
      </div>
    </form>
  );
}
