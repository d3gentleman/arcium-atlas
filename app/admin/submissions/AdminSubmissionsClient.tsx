'use client';

import { useState } from 'react';
import { Submission } from '@/lib/db/schema';

// Overwrite specific fields that get serialized
type SerializableSubmission = Omit<Submission, 'createdAt'> & { createdAt: string };

export default function AdminSubmissionsClient({ initialSubmissions }: { initialSubmissions: SerializableSubmission[] }) {
  const [submissions, setSubmissions] = useState<SerializableSubmission[]>(initialSubmissions);
  const [selectedSub, setSelectedSub] = useState<SerializableSubmission | null>(null);

  const overrideStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      // Update local state
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status } : sub))
      );
      if (selectedSub?.id === id) {
        setSelectedSub({ ...selectedSub, status });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-white w-full">
      {/* List View */}
      <div className="lg:col-span-1 space-y-4">
        <h2 className="font-mono text-primary border-b border-primary/20 pb-2 mb-4">
          &gt; REVIEW_QUEUE ({submissions.length})
        </h2>
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {submissions.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSub(sub)}
              className={`w-full text-left p-3 border font-mono transition-colors ${
                selectedSub?.id === sub.id 
                  ? 'border-primary bg-primary/10 shadow-[0_0_10px_rgba(0,255,163,0.1)]' 
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold truncate pr-2">{sub.projectName}</span>
                <StatusBadge status={sub.status} />
              </div>
              <div className="text-xs text-zinc-400 truncate">{sub.submitterName}</div>
              <div className="text-xs text-zinc-500 mt-1">
                {sub.createdAt.split('T')[0]}
              </div>
            </button>
          ))}
          {submissions.length === 0 && (
            <div className="text-zinc-500 font-mono text-sm">NO_SUBMISSIONS_FOUND</div>
          )}
        </div>
      </div>

      {/* Detail View */}
      <div className="lg:col-span-2">
        {selectedSub ? (
          <div className="console-window p-6 scanline-effect min-h-[600px] bg-black/40 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            
            <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-4">
              <div>
                <h1 className="text-2xl font-bold font-mono text-primary mb-2">
                  {selectedSub.projectName}
                </h1>
                <p className="text-zinc-400 font-mono text-sm">Category: {selectedSub.category}</p>
              </div>
              <div className="flex gap-2">
                {selectedSub.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => overrideStatus(selectedSub.id, 'approved')}
                      className="px-4 py-2 border border-[#00ffa3] text-[#00ffa3] hover:bg-[#00ffa3]/10 font-mono text-sm transition-colors uppercase"
                    >
                      [Approve]
                    </button>
                    <button 
                      onClick={() => overrideStatus(selectedSub.id, 'rejected')}
                      className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500/10 font-mono text-sm transition-colors uppercase"
                    >
                      [Reject]
                    </button>
                  </>
                )}
                {selectedSub.status !== 'pending' && (
                  <div className="flex items-center px-4 border border-zinc-700 font-mono text-sm text-zinc-400">
                    STATUS_LOCKED: {selectedSub.status.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6 font-mono text-sm text-zinc-300">
              <section>
                <h3 className="text-primary mb-2">&gt; PROJECT_SUMMARY</h3>
                <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap pl-4 border-l border-zinc-800">
                  {selectedSub.projectSummary}
                </p>
              </section>

              <section>
                <h3 className="text-primary mb-2">&gt; ARCIUM_INTEGRATION</h3>
                <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap pl-4 border-l border-zinc-800">
                  {selectedSub.arciumRole}
                </p>
              </section>

              <div className="grid grid-cols-2 gap-6">
                <section>
                  <h3 className="text-primary mb-2">&gt; CONTACT_INFO</h3>
                  <ul className="space-y-1 text-zinc-400 pl-4 border-l border-zinc-800">
                    <li>Name: {selectedSub.submitterName} ({selectedSub.submitterRole})</li>
                    <li>Email: {selectedSub.submitterEmail}</li>
                    <li>Discord: {selectedSub.discordUsername}</li>
                    <li>TG: {selectedSub.telegramUsername}</li>
                  </ul>
                </section>
                <section>
                  <h3 className="text-primary mb-2">&gt; LINKS</h3>
                  <ul className="space-y-1 text-zinc-400 pl-4 border-l border-zinc-800">
                    <li>Website: <a href={selectedSub.website} target="_blank" className="text-blue-400 hover:underline">{selectedSub.website}</a></li>
                    <li>Twitter: <a href={selectedSub.projectTwitter} target="_blank" className="text-blue-400 hover:underline">{selectedSub.projectTwitter}</a></li>
                  </ul>
                </section>
              </div>
              
              <section>
                <h3 className="text-primary mb-2">&gt; TEAM_MEMBERS</h3>
                <div className="pl-4 border-l border-zinc-800">
                  <p className="text-zinc-400 mb-1">Founder: {selectedSub.founderName}</p>
                  {selectedSub.teamMembers?.map((m, i) => (
                    <p key={i} className="text-zinc-400 mt-1 whitespace-pre-wrap">
                      {m.role}: {m.name}
                    </p>
                  ))}
                  {!selectedSub.teamMembers?.length && <p className="text-zinc-600 italic">No additional team members</p>}
                </div>
              </section>
              
              {selectedSub.logoUrl && (
                <section>
                  <h3 className="text-primary mb-2">&gt; SUBMITTED_LOGO_PREVIEW</h3>
                  <div className="pl-4 border-l border-zinc-800 mt-2">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedSub.logoUrl} alt="Logo preview" className="max-w-[200px] border border-zinc-800" />
                  </div>
                </section>
              )}
            </div>
          </div>
        ) : (
          <div className="console-window p-6 h-[600px] flex items-center justify-center border-dashed border-white/20">
            <span className="font-mono text-zinc-500">AWAITING_SELECTION...</span>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let colors = "text-zinc-500 bg-zinc-900 border-zinc-700";
  if (status === "pending") colors = "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
  if (status === "approved") colors = "text-[#00ffa3] bg-[#00ffa3]/10 border-[#00ffa3]/30";
  if (status === "rejected") colors = "text-red-400 bg-red-400/10 border-red-400/30";

  return (
    <span className={`text-[10px] px-2 py-0.5 border uppercase font-mono tracking-wider ${colors}`}>
      {status}
    </span>
  );
}
