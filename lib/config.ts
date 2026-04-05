import { FooterConfig, LinkAction, UIConfig } from "@/types/domain";

export const NAVIGATION_CONFIG: LinkAction[] = [
  {
    type: "internal" as const,
    label: "Ecosystem",
    href: "/ecosystem"
  },
  {
    type: "internal" as const,
    label: "Encyclopedia",
    href: "/encyclopedia"
  },
  {
    type: "internal" as const,
    label: "Glossary",
    href: "/glossary"
  },
  {
    type: "internal" as const,
    label: "Infrastructure",
    href: "/encyclopedia/categories/enc-infra"
  },
  {
    type: "internal" as const,
    label: "About",
    href: "/about"
  }
];

export const FOOTER_CONFIG: FooterConfig = {
  links: [
    {
      type: "external" as const,
      label: "Official Docs",
      href: "https://docs.arcium.com"
    },
    {
      type: "external" as const,
      label: "X/Twitter",
      href: "https://twitter.com/ArciumHQ"
    },
    {
      type: "external" as const,
      label: "Discord",
      href: "https://discord.gg/arcium"
    }
  ],
  metadata: {
    copyright: "(C) 2026 ARCIUM ATLAS",
    coords: "CURATED_GUIDES // ECOSYSTEM_DIRECTORY // SOURCE_LINKS",
    mission: "A clearer map of Arcium for newcomers, builders, and researchers."
  }
};

export const UI_STRINGS: UIConfig = {
  mapPanelHeader: "NODE_DATA",
  mapBeginnerToggle: "Beginner",
  mapTechnicalToggle: "Technical",
  mapClose: "Close Panel",
  mapReadArticle: "Read Full Article →",
  mapSpecTechnical: "Technical_Spec",
  mapSpecOverview: "Overview",
  mapPanelOverviewTitle: "Overview",
  mapPanelWhyItMatters: "Why It Matters",
  mapPanelTechnicalTitle: "Technical Detail",
  mapPanelActionTitle: "Action",
  mapTechnicalHint: "Switch to technical mode to reveal implementation detail, protocol language, and relationship semantics.",
  heroControlEXE: "CONTROL_UNIT.EXE",
  heroArchivistID: "ID: ARCHIVIST_01",
  heroNavShortcuts: "Navigation_Shortcuts",
  heroLiveStatus: "LIVE_STATUS_FEED:",
  heroWaitingQuery: "_WAITING_FOR_QUERY...",
  heroSysTools: "System_Tools:",
  heroGenReport: "Generate_System_Report",
  heroViewport: "VIEWPORT_PRIMARY: ECOSYSTEM_ATLAS",
  heroMode: "MODE: ECOSYSTEM_OVERVIEW",
  heroRenderActive: "REALTIME_RENDER_ACTIVE",
  heroZoom: "ZOOM: 1.0X",
  heroAtlasTerritories: "Territories",
  heroFeaturedSystems: "Featured Systems",
  filterLegendDesc: "ACTIVE_FILTERS",
  filterAllStr: "View All",
  legendHeader: "SYSTEM_LEGEND",
  searchPlaceholder: "Search protocols...",
  mapSearchResults: "Matching Systems",
  mapSearchNoResults: "No systems match this query yet.",
  mapOverviewState: "Ecosystem Hub",
  mapFocusState: "Focused Project",
  backToAtlas: "← Back to Hub",
  discoveryOpen: "Open Atlas Search",
  discoveryClose: "Close Search",
  discoverySearchPlaceholder: "Search builders, glossary terms, MXEs, and guides...",
  discoverySearchHint: "CTRL/CMD + K // ESC to close",
  discoveryInitialState: "Search Arcium builders, glossary terms, developer guides, and category pages.",
  discoveryNoResultsTitle: "No atlas records matched this query.",
  discoveryNoResultsBody: "Try a glossary term, builder, MXE topic, or category name.",
  discoveryGroupCore: "Core Network",
  discoveryGroupProjects: "Builders",
  discoveryGroupCategories: "Knowledge Areas",
  discoveryGroupGlossary: "Glossary Terms",
  discoveryGroupArticles: "Guides & Articles",
  discoveryOpenResult: "Open Record",
  discoverySecondaryAction: "Panel Action",
  mapExpandCategory: "Expand",
  mapCollapseCategory: "Close",
  mapEmptyState: "No projects match this filter.",
  mapTagFilter: "Filter by Tag",
  mapAllTags: "All Tags",
  mapAllCategories: "All Categories",
  mapProjectCount: "Projects",
  mapCoreStatusLabel: "NETWORK_STATUS:",
  mapCoreStatusValue: "SYNC_OK",
  mapOverviewTitle: "Ecosystem Overview",
  mapBackToOverview: "← Back to Overview"
};

export const CATEGORY_COLORS: Record<string, string> = {
  "cat-defi": "#00FFA3",
  "cat-ai": "#00E0FF",
  "cat-payments": "#FFC700",
  "cat-consumer": "#FF00E5",
  "cat-prediction": "#B200FF"
};

export const HOMEPAGE_CONFIG = {
  hero: {
    subtitle: "Curated guide to Arcium",
    titleLine1: "UNDERSTAND THE",
    titleLine2: "ARCIUM LANDSCAPE",
    description: "Browse a clearer map of Arcium: what the network is, where confidential compute fits, and which builders are already putting it to work.",
    primaryCta: {
      type: "internal" as const,
      label: "View Ecosystem",
      href: "/ecosystem"
    },
    secondaryCta: {
      type: "internal" as const,
      href: "/about",
      label: "What Is Arcium?"
    }
  },
  startHereCards: [
    {
      prefix: "SYS_A",
      tag: "Subsystem_A",
      title: "Understanding Arcium",
      description: "A concise overview of Arcium as a confidential execution layer and why it matters across the rest of the atlas.",
      action: {
        type: "internal" as const,
        label: "Read Guide",
        href: "/encyclopedia/articles/understanding-arcium"
      }
    },
    {
      prefix: "SYS_B",
      tag: "Subsystem_B",
      title: "What are MXEs?",
      description: "An introductory framing for the execution environments that power Arcium across the network.",
      action: {
        type: "internal" as const,
        label: "Read Guide",
        href: "/encyclopedia/articles/what-are-mxes"
      }
    },
    {
      prefix: "GRID",
      tag: "ORIENTATION",
      title: "Ecosystem Overview",
      description: "See how Arcium shows up across trading, AI, payments, analytics, and other product territories.",
      action: {
        type: "internal" as const,
        label: "Read Overview",
        href: "/encyclopedia/articles/ecosystem-overview"
      }
    }
  ],
  quickLinks: [
    {
      type: "internal" as const,
      label: "Browse Encyclopedia",
      href: "/encyclopedia"
    },
    {
      type: "command" as const,
      command: "open-discovery",
      label: "Search Builders & Guides"
    },
    {
      type: "external" as const,
      label: "Official Docs",
      href: "https://docs.arcium.com"
    }
  ],
  liveStatusFeed: [
    {
      status: "LIVE",
      text: "Curated guides, glossary terms, and ecosystem records"
    },
    {
      status: "SOURCE",
      text: "Atlas entries link back to official Arcium references where possible"
    },
    {
      status: "START",
      text: "Use About, Start Here, and the glossary to orient quickly"
    }
  ]
};
