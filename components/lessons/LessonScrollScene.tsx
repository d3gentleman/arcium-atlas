'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BEATS, SCENE_CONFIG, MXE_GLYPHS } from './beats';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── 3D Geometry Component ───────────────────────────────────
interface CubeProps {
  x: number;
  y: number;
  z?: number;
  w: number;
  d: number;
  h: number;
  className?: string;
  faceClass?: string;
  topClass?: string;
  leftClass?: string;
  rightClass?: string;
  animId?: string;
  dataIndex?: number;
  dataComp?: number;
}

const Cube3D = ({ 
  x, y, z=0, w, d, h, 
  className="", faceClass="border border-primary/20",
  topClass="bg-[#00f0ff]/10",
  leftClass="bg-black/60",
  rightClass="bg-black/80",
  animId, dataIndex, dataComp 
}: CubeProps) => {
  return (
    <div
      data-anim={animId}
      data-index={dataIndex}
      data-comp={dataComp}
      className={`absolute ${className}`}
      style={{
        left: x,
        top: y,
        width: w,
        height: d,
        transform: `translateZ(${z}px)`,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Top face */}
      <div className={`absolute ${faceClass} ${topClass}`} style={{ width: w, height: d, transform: `translateZ(${h}px)` }} />
      {/* Front-Right (Y axis at x=w) */}
      <div className={`absolute ${faceClass} ${rightClass}`} style={{ width: d, height: h, transformOrigin: 'top left', transform: `translateX(${w}px) rotateZ(90deg) rotateX(-90deg)` }} />
      {/* Front-Left (X axis at y=d) */}
      <div className={`absolute ${faceClass} ${leftClass}`} style={{ width: w, height: h, transformOrigin: 'top left', transform: `translateY(${d}px) rotateX(-90deg)` }} />
      
      {/* Optional back faces (often hidden in iso, included for transparent glass Mxes) */}
      <div className={`absolute ${faceClass} bg-transparent`} style={{ width: d, height: h, transformOrigin: 'top left', transform: `rotateZ(90deg) rotateX(-90deg)` }} />
      <div className={`absolute ${faceClass} bg-transparent`} style={{ width: w, height: h, transformOrigin: 'top left', transform: `rotateX(-90deg)` }} />
    </div>
  )
}

// ─── Layout constants ───────────────────────────────────────
const STAGE = { w: 400, h: 400 };
const CENTER = { x: 200, y: 200 };

const COMPANIES = [
  { x: 30, y: 30 },
  { x: 300, y: 30 },
  { x: 165, y: 300 },
];
const BLD = { w: 40, d: 40, h: 80 }; // Building dims
const BLK = { w: 16, d: 16, h: 16 }; // Encrypted block dims
const SHARD = { w: 8, d: 8, h: 8 };

const BARRIER_TARGETS = [
  { x: 100, y: 100 },
  { x: 230, y: 100 },
  { x: 165, y: 230 },
];

const NODES = [
  { x: 160, y: 160 }, { x: 220, y: 140 }, { x: 260, y: 190 },
  { x: 140, y: 220 }, { x: 200, y: 240 }, { x: 240, y: 260 }
];
const NODE_DIM = { w: 12, d: 12, h: 20 };

const MXE_DIM = { x: 120, y: 120, w: 180, d: 180, h: 60 };

export default function LessonScrollScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeBeat, setActiveBeat] = useState(0);
  const activeBeatRef = useRef(0);

  useEffect(() => {
    if (!sceneRef.current || !stageRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        // ── INITIAL SETUPS ──
        gsap.set('[data-anim="company"]', { autoAlpha: 0, z: -100 });
        gsap.set('[data-anim="block"]', { autoAlpha: 0, scale: 0, z: BLD.h + 20 });
        gsap.set('[data-anim="barrier-flash"]', { autoAlpha: 0 });
        gsap.set('[data-anim="shard"]', { autoAlpha: 0, scale: 0 });
        gsap.set('[data-anim="node"]', { autoAlpha: 0, z: -40 });
        gsap.set('[data-anim="mxe-boundary"]', { autoAlpha: 0, scale: 0.9, z: -20 });
        gsap.set('[data-anim="result-cube"]', { autoAlpha: 0, scale: 0, z: MXE_DIM.h / 2 });
        gsap.set('[data-anim="result-mini"]', { autoAlpha: 0, scale: 0 });

        // Beat Signals
        gsap.set('[data-anim="scan-line"]', { xPercent: -110, autoAlpha: 0 });
        gsap.set('[data-anim="stage-flash"]', { autoAlpha: 0 });
        gsap.set('[data-anim="readout-accent"]', { scaleY: 0, transformOrigin: 'top center', autoAlpha: 0 });
        gsap.set('[data-anim="headline-mask"]', { clipPath: 'inset(0 100% 0 0)' });

        const beatLabel = sceneRef.current!.querySelector<HTMLElement>('[data-anim="beat-label"]');
        const pips = sceneRef.current!.querySelectorAll<HTMLElement>('[data-anim="pip"]');

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sceneRef.current,
            start: 'top top',
            end: `+=${SCENE_CONFIG.scrubDistance}`,
            pin: true,
            scrub: SCENE_CONFIG.scrubSmoothing,
            pinSpacing: true,
            onUpdate: (self) => {
              const p = self.progress;
              let idx = BEATS.findIndex((b) => p >= b.progress[0] && p < b.progress[1]);
              if (idx === -1) idx = p >= 1 ? BEATS.length - 1 : 0;
              if (idx !== activeBeatRef.current) {
                activeBeatRef.current = idx;
                setActiveBeat(idx);
              }
              if (beatLabel) beatLabel.textContent = BEATS[idx].label;
              pips.forEach((pip, i) => {
                pip.style.backgroundColor = i <= idx ? '#00f0ff' : 'transparent';
              });
            },
          },
        });

        // Progress bar
        timeline.fromTo('[data-anim="progress-bar"]', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: SCENE_CONFIG.timelineLength }, 0);

        function addBeatSignal(time: number, beatIndex: number) {
          timeline.fromTo('[data-anim="scan-line"]', { xPercent: -110, autoAlpha: 0 }, { xPercent: 110, autoAlpha: 1, duration: 1.5, ease: 'power4.in' }, time);
          timeline.fromTo('[data-anim="stage-flash"]', { autoAlpha: 0.15 }, { autoAlpha: 0, duration: 2.0, ease: 'expo.out' }, time);
          timeline.fromTo(`[data-anim="readout-accent"][data-index="${beatIndex}"]`, { scaleY: 0, autoAlpha: 0 }, { scaleY: 1, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }, time);
          timeline.fromTo(`[data-anim="headline-mask"][data-index="${beatIndex}"]`, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power3.out' }, time);
        }

        // ==========================================
        // BEAT 1: Problem Isolation [0 - 14]
        // ==========================================
        addBeatSignal(0, 0);
        
        timeline.to('[data-anim="company"]', { autoAlpha: 1, z: 0, duration: 1.5, stagger: 0.2, ease: 'back.out' }, 0);
        timeline.to('[data-anim="block"]', { autoAlpha: 1, scale: 1, duration: 1, stagger: 0.1, ease: 'back.out' }, 1);
        
        // Bobbing cores
        timeline.to('[data-anim="block"]', { z: "+=10", duration: 1.5, yoyo: true, repeat: 10, ease: "sine.inOut" }, 2);

        // ==========================================
        // BEAT 2: Limitation Barrier [14 - 28]
        // ==========================================
        addBeatSignal(14, 1);
        
        COMPANIES.forEach((comp, i) => {
          timeline.to(`[data-anim="block"][data-index="${i}"]`, {
            x: BARRIER_TARGETS[i].x - comp.x,
            y: BARRIER_TARGETS[i].y - comp.y,
            duration: 1.5, ease: 'power3.inOut'
          }, 15);
        });

        // Hit barrier (red flash)
        timeline.to('[data-anim="barrier-flash"]', { autoAlpha: 1, duration: 0.2 }, 16.5);
        timeline.to('[data-anim="block"]', { z: "-=5", duration: 0.1, yoyo: true, repeat: 3 }, 16.6); // Glitch shutter

        // Retreat
        timeline.to('[data-anim="barrier-flash"]', { autoAlpha: 0, duration: 0.5 }, 25);
        timeline.to('[data-anim="block"]', { x: 0, y: 0, duration: 1.5, ease: 'power3.inOut' }, 26);

        // ==========================================
        // BEAT 3: Secret Sharing [28 - 42]
        // ==========================================
        addBeatSignal(28, 2);
        
        timeline.to('[data-anim="block"]', { autoAlpha: 0, scale: 0, duration: 0.5, ease: 'back.in' }, 29);
        timeline.to('[data-anim="shard"]', { autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.05, ease: 'back.out' }, 29.5);
        
        // Shards scatter out of buildings
        for(let i=0; i<3; i++) {
          timeline.to(`[data-anim="shard"][data-comp="${i}"]`, {
            x: (idx) => (idx - 1) * 30,
            y: (idx) => Math.random() * 40 - 20,
            z: "+=40", // Fly upwards
            duration: 1.5, ease: 'power3.out'
          }, 30);
        }

        // ==========================================
        // BEAT 4: Distributed Network [42 - 57]
        // ==========================================
        addBeatSignal(42, 3);
        
        timeline.to('[data-anim="node"]', { autoAlpha: 1, z: 0, duration: 1, stagger: 0.1, ease: 'back.out' }, 43);
        
        // Push companies into the deep background so nodes dominate
        timeline.to('[data-anim="company"]', { autoAlpha: 0.1, z: -150, duration: 2, ease: 'power3.inOut' }, 43.5);

        // Shards drift and fall to nodes
        timeline.to('[data-anim="shard"]', {
          x: (i) => NODES[i % NODES.length].x - COMPANIES[Math.floor(i/3)].x,
          y: (i) => NODES[i % NODES.length].y - COMPANIES[Math.floor(i/3)].y,
          z: NODE_DIM.h + 10,
          rotationZ: (i) => Math.random() * 180,
          duration: 3, ease: 'power2.inOut', stagger: 0.05
        }, 44);

        // Node glow
        timeline.to('[data-anim="node"] > div', { backgroundColor: 'rgba(0,240,255,0.4)', duration: 0.5, stagger: 0.1 }, 46.5);

        // ==========================================
        // BEAT 5: MXE Formation [57 - 71]
        // ==========================================
        addBeatSignal(57, 4);

        // Tighter cluster
        timeline.to('[data-anim="node"]', {
          x: (i) => (CENTER.x - NODES[i].x) * 0.4,
          y: (i) => (CENTER.y - NODES[i].y) * 0.4,
          duration: 1.5, ease: 'power3.inOut'
        }, 58);
        timeline.to('[data-anim="shard"]', {
          x: (i) => NODES[i % NODES.length].x - COMPANIES[Math.floor(i/3)].x + (CENTER.x - NODES[i % NODES.length].x) * 0.4,
          y: (i) => NODES[i % NODES.length].y - COMPANIES[Math.floor(i/3)].y + (CENTER.y - NODES[i % NODES.length].y) * 0.4,
          duration: 1.5, ease: 'power3.inOut'
        }, 58);

        // Volumetric MXE glass materializes
        timeline.to('[data-anim="mxe-boundary"]', { autoAlpha: 1, scale: 1, z: 0, duration: 1.5, ease: 'power3.out' }, 59.5);

        // ==========================================
        // BEAT 6: MPC Compute [71 - 85]
        // ==========================================
        addBeatSignal(71, 5);

        // Dim nodes so the rotating computation (shards) dominates
        timeline.to('[data-anim="node"]', { autoAlpha: 0.2, duration: 1, ease: 'power2.out' }, 71.5);
        timeline.to('[data-anim="mxe-boundary"]', { borderColor: "rgba(0,240,255,0.7)", duration: 1 }, 71.5);

        // Abstract cyclical rotation inside the 3D volume
        timeline.to('[data-anim="shard"]', {
          x: (i) => (CENTER.x - COMPANIES[Math.floor(i/3)].x) + Math.cos(i) * 30,
          y: (i) => (CENTER.y - COMPANIES[Math.floor(i/3)].y) + Math.sin(i) * 30,
          z: MXE_DIM.h / 2, // Suspend inside glass box
          duration: 2, ease: 'power2.out'
        }, 72);

        // Continuous spin
        timeline.to('[data-anim="shard"]', {
          rotationZ: "+=720",
          duration: 12,
          ease: "none",
        }, 74);

        // ==========================================
        // BEAT 7: Result Output [85 - 100]
        // ==========================================
        addBeatSignal(85, 6);

        timeline.to('[data-anim="shard"]', { autoAlpha: 0, scale: 0, duration: 0.5, ease: 'power3.in' }, 86);
        
        timeline.to('[data-anim="result-cube"]', { autoAlpha: 1, scale: 1, rotationZ: 0, duration: 1, ease: 'back.out' }, 86.5);
        
        // Dissolve MXE and Nodes entirely to isolate the Result
        timeline.to(['[data-anim="mxe-boundary"]', '[data-anim="node"]'], { autoAlpha: 0, duration: 1 }, 88);

        // Result split and return
        timeline.to('[data-anim="result-mini"]', { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out' }, 89);
        timeline.to('[data-anim="result-cube"]', { autoAlpha: 0, scale: 0, duration: 0.3 }, 89);

        // Wake companies back up as results fly to them
        timeline.to('[data-anim="company"]', { autoAlpha: 1, z: 0, duration: 1.5, ease: 'power2.out' }, 89.5);

        for (let i = 0; i < 3; i++) {
          timeline.to(`[data-anim="result-mini"][data-index="${i}"]`, {
            x: COMPANIES[i].x - CENTER.x,
            y: COMPANIES[i].y - CENTER.y,
            z: BLD.h + 20, // Hovering over comp
            duration: 1.5, ease: 'power2.inOut'
          }, 89.5);
        }

        // Buildings glow
        timeline.to('[data-anim="company"] > div', { backgroundColor: "rgba(0,240,255,0.2)", duration: 0.8, ease: 'power1.out' }, 91);
      });

      return () => { ctx.kill(); };
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sceneRef}
      data-lesson-scene
      className="relative w-full h-screen overflow-hidden bg-background !touch-none"
    >
      <div className="absolute inset-0 max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between">
        
        {/* TEXTS (Left Panel) */}
        <aside className="relative z-10 w-full md:w-[35%] max-w-md pt-20 md:pt-0">
          <div className="flex items-center gap-2 mb-6">
            <span data-anim="beat-label" className="text-[10px] font-mono tracking-widest text-[#00f0ff] animate-pulse">BEAT_01</span>
            <div className="flex gap-1">
              {BEATS.map((_, i) => (
                <div key={i} data-anim="pip" className="w-[3px] h-[3px] bg-white/20" />
              ))}
            </div>
          </div>
          <div className="relative min-h-[200px]">
            {BEATS.map((beat, i) => (
              <div key={beat.id} data-beat-text={i} className={`absolute inset-x-0 top-0 transition-all duration-700 ease-out ${i === activeBeat ? 'opacity-100 translate-y-0 pointer-events-auto' : i < activeBeat ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                <div data-anim="headline-mask" data-index={i}>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase font-headline leading-tight">{beat.headline}</h2>
                </div>
                <div className="relative mt-4 pl-4 border-l border-[#00f0ff]/20">
                  <div data-anim="readout-accent" data-index={i} className="absolute left-[-1px] top-0 bottom-0 w-[1px] bg-[#00f0ff]" />
                  <p className="text-sm md:text-base text-outline leading-relaxed font-sans">{beat.body}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* 3D ISOMETRIC STAGE (Right Panel) */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[65%] flex items-center justify-center pointer-events-none" style={{ perspective: '1200px' }}>
          
          <div ref={stageRef} className="relative scale-[0.55] md:scale-[0.75] lg:scale-[0.85] xl:scale-100" style={{ width: STAGE.w, height: STAGE.h, transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateZ(45deg)' }}>
            
            {/* Base Grid Plane */}
            <div className="absolute inset-0 border border-[#00f0ff]/20 shadow-[0_0_80px_rgba(0,240,255,0.05)]" style={{ transformStyle: 'preserve-3d' }}>
              
              {/* Grid Lines */}
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,240,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

              {/* ── STAGE C: Nodes ── */}
              {NODES.map((n, i) => (
                <Cube3D key={`node-${i}`} animId="node" x={n.x} y={n.y} w={NODE_DIM.w} d={NODE_DIM.d} h={NODE_DIM.h} faceClass="border border-[#00f0ff]/40" topClass="bg-[#00f0ff]/10" leftClass="bg-black/80" rightClass="bg-[#001015]" />
              ))}

              {/* ── STAGE D: MXE BOUNDARY ── */}
              <Cube3D animId="mxe-boundary" x={MXE_DIM.x} y={MXE_DIM.y} w={MXE_DIM.w} d={MXE_DIM.d} h={MXE_DIM.h} className="pointer-events-none" faceClass="border border-[#00f0ff]/60 border-dashed" topClass="bg-[#00f0ff]/10 backdrop-blur-sm" leftClass="bg-[#00f0ff]/5 backdrop-blur-sm" rightClass="bg-[#00f0ff]/5 backdrop-blur-sm" />

              {/* ── STAGE A: Companies ── */}
              {COMPANIES.map((c, i) => (
                <Cube3D key={`comp-${i}`} animId="company" x={c.x} y={c.y} w={BLD.w} d={BLD.d} h={BLD.h} faceClass="border border-[#00f0ff]/30" topClass="bg-[#01080c] shadow-[inset_0_0_15px_rgba(0,240,255,0.2)]" leftClass="bg-[#020a0f]" rightClass="bg-[#031118]" />
              ))}

              {/* ── STAGE A: Encrypted Blocks ── */}
              {COMPANIES.map((c, i) => (
                <div key={`blk-${i}`} className="absolute" style={{ transformStyle: 'preserve-3d' }}>
                  <Cube3D animId="block" dataIndex={i} x={c.x + BLD.w/2 - BLK.w/2} y={c.y + BLD.d/2 - BLK.d/2} w={BLK.w} d={BLK.d} h={BLK.h} faceClass="border border-[#ff3366] transition-colors duration-500" topClass="bg-[#ff3366]/20" leftClass="bg-black/90" rightClass="bg-black/90" />
                  
                  {/* Glitch flash attached to block */}
                  <div data-anim="barrier-flash" className="absolute" style={{ left: c.x, top: c.y, width: BLD.w, height: BLD.d, transform: `translateZ(${BLD.h + 40}px)`, background: 'rgba(255,51,102,0.8)', filter: 'blur(20px)' }} />
                </div>
              ))}

              {/* ── STAGE B: Fragments ── */}
              {Array.from({length: 9}).map((_, i) => (
                <Cube3D key={`shard-${i}`} animId="shard" dataComp={Math.floor(i/3)} x={COMPANIES[Math.floor(i/3)].x + BLD.w/2 - SHARD.w/2} y={COMPANIES[Math.floor(i/3)].y + BLD.d/2 - SHARD.d/2} z={BLD.h + 20} w={SHARD.w} d={SHARD.d} h={SHARD.h} faceClass="border border-[#00f0ff]/80" topClass="bg-[#00f0ff]/40 shadow-[0_0_10px_rgba(0,240,255,0.8)]" leftClass="bg-[#00f0ff]/20" rightClass="bg-[#00f0ff]/10" />
              ))}

              {/* ── STAGE F: Result Outputs ── */}
              <Cube3D animId="result-cube" x={CENTER.x - 20} y={CENTER.y - 20} w={40} d={40} h={40} faceClass="border-2 border-white" topClass="bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.8)]" leftClass="bg-white/40" rightClass="bg-white/20" />
              
              {[0,1,2].map(i => (
                <Cube3D key={`resm-${i}`} animId="result-mini" dataIndex={i} x={CENTER.x - 12} y={CENTER.y - 12} z={MXE_DIM.h / 2} w={24} d={24} h={24} faceClass="border-2 border-white/60" topClass="bg-white/40" leftClass="bg-transparent" rightClass="bg-transparent" />
              ))}

            </div>
          </div>
        </div>

        {/* ── UI OVERLAYS ── */}
        <div data-anim="scan-line" className="absolute top-0 bottom-0 w-[2px] bg-[#00f0ff] shadow-[0_0_20px_#00f0ff] pointer-events-none z-0" style={{ transform: 'translateX(-110%)' }} />
        <div data-anim="stage-flash" className="absolute inset-0 scale-[5] bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.08)_0%,transparent_60%)] pointer-events-none z-0" />

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/10 z-20">
          <div data-anim="progress-bar" className="h-full bg-primary origin-left" />
        </div>
      </div>
    </div>
  );
}
