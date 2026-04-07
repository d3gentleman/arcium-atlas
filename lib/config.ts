import { FooterConfig, LinkAction, UIConfig } from "@/types/domain";

export const NAVIGATION_CONFIG: LinkAction[] = [
  {
    type: "internal" as const,
    label: "Ecosystem Hub",
    href: "/"
  },
  {
    type: "internal" as const,
    label: "Directory",
    href: "/ecosystem"
  },
  {
    type: "internal" as const,
    label: "Territories",
    href: "/ecosystem/categories"
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
    coords: "ECOSYSTEM_HUB // BUILDER_DIRECTORY // SOURCE_LINKS",
    mission: "A curated directory of public Arcium ecosystem records."
  }
};

export const UI_STRINGS: UIConfig = {
  mapPanelHeader: "NODE_DATA",
  mapBeginnerToggle: "Beginner",
  mapTechnicalToggle: "Technical",
  mapClose: "Close Panel",
  mapReadArticle: "View Project Details →",
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
  heroFeaturedSystems: "Featured Builders",
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
  discoverySearchPlaceholder: "Search builders and ecosystem categories...",
  discoverySearchHint: "CTRL/CMD + K // ESC to close",
  discoveryInitialState: "Search builder records and territory briefings.",
  discoveryNoResultsTitle: "No atlas records matched this query.",
  discoveryNoResultsBody: "Try a builder name or a category name.",
  discoveryGroupCore: "Core Network",
  discoveryGroupProjects: "Builders",
  discoveryGroupCategories: "Territories",
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
  "ai": "#00E0FF",
  "analytics": "#4DFFD4",
  "consumer": "#FF00E5",
  "defi": "#00FFA3",
  "depin": "#B200FF",
  "gaming": "#FF3366",
  "interoperability": "#FF6B00",
  "nfts": "#FF00AA",
  "payments": "#FFC700"
};

export const HOMEPAGE_CONFIG = {
  hero: {
    subtitle: "The Arcium Ecosystem",
    titleLine1: "DISCOVER THE",
    titleLine2: "BUILDER NETWORK",
    description: "Explore public builder records, territory briefs, and source links across the Arcium ecosystem.",
    primaryCta: {
      type: "internal" as const,
      label: "View Directory",
      href: "/ecosystem"
    },
    secondaryCta: {
      type: "internal" as const,
      href: "/about",
      label: "What Is Arcium?"
    }
  },
  quickLinks: [
    {
      type: "internal" as const,
      label: "Browse Directory",
      href: "/ecosystem"
    },
    {
      type: "command" as const,
      command: "open-discovery",
      label: "Search Builders"
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
      text: "Explore current builder records and territory coverage"
    },
    {
      status: "SOURCE",
      text: "Follow outbound links to official docs and project sites"
    },
    {
      status: "SCOPE",
      text: "Coverage expands as new public records are added"
    }
  ]
};
