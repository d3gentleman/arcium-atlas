'use client';

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/keystatic');
    }
  }, [status, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-jetbrains">
      <div className="w-full max-w-md border border-outline-variant/30 bg-surface-container-high/40 p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.5)]">
        <div className="mb-8 text-center">
            <div className="mb-4 inline-flex border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                SECURE_GATEWAY_V3
            </div>
          <h1 className="font-space text-3xl font-black uppercase tracking-tight text-white mb-2">
            Admin <span className="text-primary">Login</span>
          </h1>
          <p className="text-sm text-on-surface-variant/60 uppercase tracking-widest">
            Authorization / Required
          </p>
        </div>

        {status === 'loading' ? (
          <div className="py-12 text-center text-primary animate-pulse font-mono text-xs">
            SYNCHRONIZING_SESSION...
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => signIn('github')}
              className="flex w-full items-center justify-center gap-3 border-2 border-primary bg-primary/10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-black shadow-[4px_4px_0px_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-none"
            >
              Authorize with GitHub
            </button>
            
            <div className="pt-4 text-center">
                <p className="text-[10px] text-on-surface-variant/40 leading-relaxed uppercase">
                    Only authorized developers from the Arcium Protocol Group can access the atlas core.
                </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Decorative scanline overlay */}
      <div className="fixed inset-0 scanline-effect z-[100] pointer-events-none opacity-20"></div>
    </div>
  );
}
