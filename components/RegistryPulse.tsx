'use client';

import { useEffect, useRef, useState } from 'react';
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

/* ── Audit-log event generator ── */
type AuditEvent = { timestamp: string; type: string; detail: string };

const EVENT_TEMPLATES: ((p: EcosystemProjectRecord) => AuditEvent)[] = [
  (p) => ({
    timestamp: fakeTimestamp(),
    type: 'PROJECT_REVIEW_SYNC',
    detail: `${normalizeTitle(p.title)}_VERIFIED`,
  }),
  (p) => ({
    timestamp: fakeTimestamp(),
    type: 'REGISTRY_ENTRY_MAPPED',
    detail: `${normalizeTitle(p.title)}_${p.tag}_INDEXED`,
  }),
  (p) => ({
    timestamp: fakeTimestamp(),
    type: 'SIGNAL_CONFIDENCE_SET',
    detail: `${normalizeTitle(p.title)}_CONFIDENCE_${(p.confidence ?? 'unreviewed').toUpperCase()}`,
  }),
];

function normalizeTitle(title: string) {
  return title.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
}

function fakeTimestamp() {
  const h = String(Math.floor(Math.random() * 24)).padStart(2, '0');
  const m = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  const s = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function generateAuditEvents(projects: EcosystemProjectRecord[]): AuditEvent[] {
  const events: AuditEvent[] = [];

  for (const project of projects) {
    const template = EVENT_TEMPLATES[events.length % EVENT_TEMPLATES.length];
    events.push(template(project));
  }

  // Add a few ecosystem-level events
  events.push({
    timestamp: fakeTimestamp(),
    type: 'SECTOR_COVERAGE_UPDATE',
    detail: 'ALL_SECTORS_RESCANNED',
  });
  events.push({
    timestamp: fakeTimestamp(),
    type: 'SYSTEM_HEARTBEAT',
    detail: 'REGISTRY_ONLINE_ALL_NODES_HEALTHY',
  });

  // Sort by timestamp for a natural feel
  return events.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
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
  const tickerRef = useRef<HTMLDivElement>(null);

  // ── Metrics ──
  const buildersCount = projects.length;
  const coveredCategories = categories.filter((cat) =>
    projects.some((p) => p.categoryId === cat.id || p.categoryId === cat.slug),
  ).length;
  const coveragePercent =
    categories.length > 0 ? Math.round((coveredCategories / categories.length) * 100) : 0;
  const confidenceLabel = computeConfidenceLabel(projects);
  const featuredCount = projects.filter((p) => p.isFeatured).length;

  // ── Audit events ──
  const auditEvents = generateAuditEvents(projects);

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

      {/* ── Audit Feed Ticker ── */}
      <div className="overflow-hidden border-t border-outline-variant/15 bg-black/60 backdrop-blur-sm">
        <div className="flex items-center">
          <div className="shrink-0 border-r border-outline-variant/20 bg-primary/5 px-4 py-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary font-jetbrains whitespace-nowrap">
              Audit_Feed
            </span>
          </div>
          <div className="relative flex-1 overflow-hidden py-2" ref={tickerRef}>
            <div className="audit-ticker flex w-max gap-12 px-4">
              {/* Duplicate the events for seamless loop */}
              {[...auditEvents, ...auditEvents].map((event, idx) => (
                <span
                  key={`${event.type}-${idx}`}
                  className="inline-flex items-center gap-2 whitespace-nowrap text-[11px] font-jetbrains text-on-surface-variant/50 transition-colors hover:text-on-surface-variant"
                >
                  <span className="text-on-surface-variant/30">[{event.timestamp}]</span>
                  <span className="text-primary/70">{event.type}:</span>
                  <span>{event.detail}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
