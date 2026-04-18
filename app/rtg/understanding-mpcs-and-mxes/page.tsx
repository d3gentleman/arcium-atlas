import Link from 'next/link';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Understanding MPCs and MXEs - Arcium RTGs',
  description: 'A fundamental briefing on Multi-Party Computation and Multi-Party Execution Environments within Arcium.',
  path: '/rtg/understanding-mpcs-and-mxes',
});

export default function MPCLessonPage() {
  return (
    <KnowledgePageFrame
      eyebrow="LESSON_01 // FUNDAMENTALS"
      title="Understanding MPCs and MXEs"
      summary="To understand Arcium, you must first understand the relationship between MPC (the math) and MXE (the machine). This guide breaks down how these primitives work together to enable verifiable, confidential compute."
      statusLabel="STABLE_RELEASE"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'RTGs', href: '/rtg' },
        { label: 'MPCs and MXEs', href: '/rtg/understanding-mpcs-and-mxes' },
      ]}
      meta={
        <>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            PRIMITIVE // MPC_CRYPTOGRAPHY
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            ENVIRONMENT // MXE_NETWORK
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            SECURITY // ZERO_TRUST_EXECUTION
          </div>
        </>
      }
      backgroundVariant="calm"
    >
      <div className="grid gap-8 p-6 md:p-0">
        <section className="console-window overflow-hidden">
          <div className="console-header">
            <span>TERMINAL_OUTPUT // SECTION_01</span>
            <span className="text-primary">THE_MPC_PRIMITIVE</span>
          </div>
          <div className="p-6 md:p-10">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">01. What is MPC?</h2>
                <div className="h-1 w-20 bg-primary"></div>
                <p className="text-lg leading-9 text-on-surface-variant">
                  Multi-Party Computation (MPC) is a subfield of cryptography that allows multiple parties to jointly compute a function over their inputs while keeping those inputs private.
                </p>
                <div className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-6 mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Core Mechanism: Secret Sharing</h4>
                  <p className="text-sm leading-7 text-on-surface-variant">
                    Instead of sending data to a central server, MPC breaks data into "shares". One share tells you nothing. Only when enough shares are combined (the threshold) does the data become usable. Computation happens on these shares directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="console-window overflow-hidden">
          <div className="console-header">
            <span>TERMINAL_OUTPUT // SECTION_02</span>
            <span className="text-primary">THE_MXE_ENVIRONMENT</span>
          </div>
          <div className="p-6 md:p-10 bg-surface-container-lowest/30">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">02. Enter the MXE</h2>
                <div className="h-1 w-20 bg-primary"></div>
                <p className="text-lg leading-9 text-on-surface-variant">
                  A Multi-Party Execution Environment (MXE) is the distributed "virtual computer" where MPC actually happens on the Arcium network. 
                </p>
                <p className="text-base leading-8 text-on-surface-variant">
                  If MPC is the blueprint (the math), the MXE is the factory floors (the nodes) running that math in sync. Arcium allows developers to spin up these environments dynamically to handle specific sensitive workloads.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mt-10">
                <div className="rounded-2xl border border-outline-variant/25 bg-black/40 p-6">
                  <h3 className="text-xl font-bold text-white mb-2 underline decoration-primary/40">Verifiable</h3>
                  <p className="text-sm leading-6 text-on-surface-variant">Every computation in an MXE is backed by cryptographic proofs, ensuring the result is correct even if some nodes are malicious.</p>
                </div>
                <div className="rounded-2xl border border-outline-variant/25 bg-black/40 p-6">
                  <h3 className="text-xl font-bold text-white mb-2 underline decoration-primary/40">Confidential</h3>
                  <p className="text-sm leading-6 text-on-surface-variant">The data remains encrypted throughout the entire process. Not even the nodes running the hardware can see the raw inputs.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="console-window overflow-hidden">
          <div className="console-header">
            <span>TERMINAL_OUTPUT // SECTION_03</span>
            <span className="text-primary">SUMMARY_ANALYSIS</span>
          </div>
          <div className="p-6 md:p-10">
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-black tracking-tight text-white uppercase">The bottom line</h2>
              <div className="p-6 border-l-4 border-primary bg-primary/5 rounded-r-2xl">
                <p className="text-lg leading-8 text-on-surface-variant font-medium">
                  MPC provides the privacy-preserving math, and MXE provides the high-performance network infrastructure to execute that math at scale. Together, they form the backbone of the Decentralized Confidential Compute Network (DCCN).
                </p>
              </div>
              <div className="mt-12 flex justify-center">
                <Link href="/rtg" className="px-6 py-3 border-2 border-primary text-primary font-bold uppercase tracking-widest hover:bg-primary hover:text-black transition-all rounded-sm">
                  RET_TO_RTG_MODULE
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </KnowledgePageFrame>
  );
}
