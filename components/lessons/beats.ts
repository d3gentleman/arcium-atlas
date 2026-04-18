// ─── Lesson beat data model ─────────────────────────────────
// Each beat represents one narrative step in the scroll-driven
// lesson. The `progress` tuple maps to [start, end] within the
// normalised 0–1 scroll range of the pinned section.

export interface BeatConfig {
  id: string;
  index: number;
  label: string;
  headline: string;
  body: string;
  progress: [number, number];
}

export interface SceneConfig {
  /** Total scroll distance (px) the pinned section spans. */
  scrubDistance: number;
  /** Scrub smoothing in seconds (higher = more lag). */
  scrubSmoothing: number;
  /** How many timeline "units" the animation occupies. */
  timelineLength: number;
}

// ─── Beat content ───────────────────────────────────────────

export const BEATS: BeatConfig[] = [
  {
    id: 'problem_isolation',
    index: 0,
    label: 'BEAT_01',
    headline: 'The Trust Problem',
    body: 'Three companies each hold highly sensitive, encrypted datasets. They want to compute on this data collaboratively, but they cannot use it. Encrypted data is essentially locked — safe, but completely mathematically unusable in its current state.',
    progress: [0.0, 0.14],
  },
  {
    id: 'limitation_barrier',
    index: 1,
    label: 'BEAT_02',
    headline: 'The Decryption Barrier',
    body: 'Normally, to compute on data, you must first decrypt it. But the moment the data is unlocked, privacy is broken. Exposing raw data to third parties or central servers is a fatal security risk. The computation halts.',
    progress: [0.14, 0.28],
  },
  {
    id: 'secret_sharing',
    index: 2,
    label: 'BEAT_03',
    headline: 'Secret Sharing',
    body: 'Instead of decrypting, Arcium transforms the encrypted data into "secret shares". The data is fractured into abstract mathematical fragments. Each fragment on its own is entirely meaningless and reveals nothing about the original data.',
    progress: [0.28, 0.42],
  },
  {
    id: 'network_distribution',
    index: 3,
    label: 'BEAT_04',
    headline: 'Distributed Network',
    body: 'These fragments are distributed across a decentralized network of independent Arx nodes. No single point of failure exists, and no central entity controls the process. The fragments intermix, but the full picture remains divided.',
    progress: [0.42, 0.57],
  },
  {
    id: 'mxe_formation',
    index: 4,
    label: 'BEAT_05',
    headline: 'Secure Computation Zone',
    body: 'An MXE (MPC eXecution Environment) dynamically forms around the participating nodes. This acts as a highly secure, cryptographic boundary. Everything inside the MXE is rigorously verifiable and isolated from the outside network.',
    progress: [0.57, 0.71],
  },
  {
    id: 'mpc_compute',
    index: 5,
    label: 'BEAT_06',
    headline: 'Computing in the Dark',
    body: 'Inside the MXE, Multi-Party Computation (MPC) begins. The nodes interact and compute directly on the encrypted fragments. The rhythmic, complex math processes the data completely blindly. Meaningful computation occurs without ever triggering decryption.',
    progress: [0.71, 0.85],
  },
  {
    id: 'result_output',
    index: 6,
    label: 'BEAT_07',
    headline: 'Safe Result Delivery',
    body: 'A final, unified result emerges from the MXE and is safely delivered back to the companies. The original encrypted inputs were never exposed or unlocked during the entire process. They receive the exact answer they needed, with zero privacy sacrifice.',
    progress: [0.85, 1.0],
  },
];

// ─── Scene constants ────────────────────────────────────────

export const SCENE_CONFIG: SceneConfig = {
  scrubDistance: 7000,
  scrubSmoothing: 2.5,
  timelineLength: 100,
};

export const SHARD_COLORS = ['#00f0ff', '#00c8ff', '#00ffd5'] as const;
export const NODE_LABELS = ['NODE_A', 'NODE_B', 'NODE_C'] as const;
export const MXE_GLYPHS = ['VERIFY', 'ENCRYPT', 'ATTEST', 'DISSOLVE'] as const;
