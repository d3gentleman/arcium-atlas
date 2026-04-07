'use client';

import { useEffect, useState } from 'react';
import type { EcosystemCategoryRecord, EcosystemProjectRecord } from '@/types/domain';

interface RegistryPulseProps {
  projects: EcosystemProjectRecord[];
  categories: EcosystemCategoryRecord[];
}

/* ── Confidence helpers ── */
const CONFIDENCE_WEIGHT: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
  unreviewed: 0,
};

const CONFIDENCE_LABELS: [number, string][] = [
  [2.5, 'HIGH'],
  [1.5, 'MEDIUM'],
  [0.5, 'LOW'],
  [0, 'MINIMAL'],
];

function computeConfidenceLabel(projects: EcosystemProjectRecord[]) {
  if (projects.length === 0) return 'N/A';
  const sum = projects.reduce(
    (acc, p) => acc + (CONFIDENCE_WEIGHT[p.confidence ?? 'unreviewed'] ?? 0),
    0,
  );
  const avg = sum / projects.length;
  for (const [threshold, label] of CONFIDENCE_LABELS) {
    if (avg >= threshold) return label;
  }
  return 'MINIMAL';
}

/* ── Animated counter hook ── */
function useAnimatedCounter(target: number, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }

    let start: number | null = null;
    let raf: number;

    function step(ts: number) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

/* ── Stat Module ── */
function StatModule({
  label,
  value,
  suffix,
  showPulse,
  accentColor,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  showPulse?: boolean;
  accentColor?: string;
}) {
  const isNumeric = typeof value === 'number';
  const animatedValue = useAnimatedCounter(isNumeric ? value : 0);

  return (
    <div className="relative flex flex-col gap-2 border border-outline-variant/20 bg-black/40 px-5 py-4 backdrop-blur-md transition-colors hover:border-outline-variant/35 hover:bg-black/50">
      <div className="flex items-center gap-2">
        {showPulse && (
          <span
            className="h-2 w-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]"
            style={{ backgroundColor: accentColor ?? '#00f0ff', color: accentColor ?? '#00f0ff' }}
          />
        )}
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50 font-jetbrains">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className="font-space text-2xl font-black tracking-tight"
          style={{ color: accentColor ?? '#fff' }}
        >
          {isNumeric ? animatedValue : value}
        </span>
        {suffix && (
          <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/40 font-jetbrains">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function RegistryPulse({ projects, categories }: RegistryPulseProps) {

  // ── Metrics ──
  const buildersCount = projects.length;
  const coveredCategories = categories.filter((cat) =>
    projects.some((p) => p.categoryId === cat.id || p.categoryId === cat.slug),
  ).length;
  const coveragePercent =
    categories.length > 0 ? Math.round((coveredCategories / categories.length) * 100) : 0;
  const confidenceLabel = computeConfidenceLabel(projects);
  const featuredCount = projects.filter((p) => p.isFeatured).length;


  return (
    <div className="space-y-0">
      {/* ── Aggregate Signal Strip ── */}
      <div className="grid grid-cols-2 gap-px bg-outline-variant/10 md:grid-cols-4">
        <StatModule
          label="Builders_Mapped"
          value={buildersCount}
          showPulse
          accentColor="#00f0ff"
        />
        <StatModule
          label="Sector_Coverage"
          value={coveragePercent}
          suffix="%"
          accentColor="#2fe6a6"
        />
        <StatModule
          label="Mean_Confidence"
          value={confidenceLabel}
          accentColor="#ffc857"
        />
        <StatModule
          label="Featured_Entries"
          value={featuredCount}
          accentColor="#adc7ff"
        />
      </div>

    </div>
  );
}
